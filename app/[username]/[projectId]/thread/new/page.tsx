import Header from "@/components/layout/header"
import { ThreadEditor } from "@/components/threads/thread-editor"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"

interface NewThreadPageProps {
  params: {
    username: string
    projectId: string
  }
  searchParams: {
    commit: string
  }
}

export default async function NewThreadPage({ params, searchParams }: NewThreadPageProps) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/signin")
  }

  const { username, projectId } = await params
  const { commit: commitSha } = await searchParams

  // Get project details
  const { data: project } = await supabase.from("projects").select("*, profiles!inner(username)").eq("name", projectId).eq("profiles.username", username).single()

  if (!project) notFound()

  // Fetch commit from GitHub
  const response = await fetch(`https://api.github.com/repos/${project.full_name}/commits/${commitSha}`, {
    headers: {
      Authorization: `Bearer ${session.provider_token}`,
      Accept: "application/vnd.github.v3+json",
    },
  })

  if (!response.ok) notFound()

  const commitData = await response.json()
  const commit = {
    sha: commitData.sha,
    message: commitData.commit.message,
    author_name: commitData.commit.author.name,
    authored_at: commitData.commit.author.date,
  }

  const projectPath = `/${username}/${projectId}`

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ThreadEditor projectId={project.id} commit={commit} fullName={project.full_name} />
      </main>
    </div>
  )
}
