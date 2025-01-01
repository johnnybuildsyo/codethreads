"use server"

import { createClient } from "@/lib/supabase/server"

export async function createSession(projectName: string, commitSha: string, commitMessage: string) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    if (!user) throw new Error("Not authenticated")

    // Get project UUID from the database
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("name", projectName)
      .single()

    if (projectError) throw projectError
    if (!project) throw new Error(`Could not find project with name: ${projectName}`)

    // Initialize session data
    const sessionData = {
      project_id: project.id,
      user_id: user.id,
      title: commitMessage.split("\n")[0],
      blocks: "[]", // Use a valid JSON string
      commit_shas: [commitSha],
    }
    
    console.log("Creating session with data:", sessionData)

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert(sessionData)
      .select()
      .single()

    if (sessionError) {
      console.error("Session creation error:", sessionError)
      throw sessionError
    }
    if (!session) throw new Error("Failed to create session")

    console.log("Session created successfully:", session)
    return { session, error: null }
  } catch (error) {
    console.error("Failed to create session:", error)
    return { 
      session: null, 
      error: error instanceof Error ? error.message : "Failed to create session" 
    }
  }
} 