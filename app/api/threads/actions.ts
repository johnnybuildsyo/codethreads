"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Database } from "@/lib/supabase/database.types"

type ThreadSection = {
  type: "markdown" | "commit-links"
  content: string
  role?: "intro" | "body" | "conclusion"
}

type ThreadData = Pick<Database["public"]["Tables"]["threads"]["Insert"], "title" | "commit_shas" | "published_at"> & {
  sections: ThreadSection[]
}

export async function upsertThread(projectId: string, threadData: ThreadData, threadId?: string) {
  const supabase = await createClient()

  // Get current session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("Not authenticated")
  }

  // Get project to verify ownership/permissions
  const { data: project } = await supabase
    .from("projects")
    .select("owner_id")
    .eq("id", projectId)
    .single()

  if (!project) {
    throw new Error("Project not found")
  }

  if (project.owner_id !== session.user.id) {
    throw new Error("Not authorized to modify threads in this project")
  }

  // Prepare thread data
  const data = {
    project_id: projectId,
    user_id: session.user.id,
    ...threadData,
    sections: threadData.sections as unknown as Database["public"]["Tables"]["threads"]["Insert"]["sections"]
  }

  try {
    let result
    if (threadId) {
      // Update existing thread
      // First verify thread ownership
      const { data: existingThread } = await supabase
        .from("threads")
        .select("user_id")
        .eq("id", threadId)
        .single()

      if (!existingThread || existingThread.user_id !== session.user.id) {
        throw new Error("Not authorized to edit this thread")
      }

      result = await supabase
        .from("threads")
        .update(data)
        .eq("id", threadId)
        .select()
        .single()
    } else {
      // Create new thread
      result = await supabase
        .from("threads")
        .insert(data)
        .select()
        .single()
    }

    if (result.error) throw result.error

    // Get project path for revalidation and redirect
    const { data: projectPath } = await supabase
      .from("projects")
      .select("name, profiles!inner(username)")
      .eq("id", projectId)
      .single()

    if (!projectPath) throw new Error("Could not find project path")

    const path = `/${projectPath.profiles.username}/${projectPath.name}`
    revalidatePath(path)
    return { success: true, path }

  } catch (error) {
    console.error("Failed to save thread:", error)
    throw error
  }
} 