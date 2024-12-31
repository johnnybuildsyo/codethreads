import { GitHubAuthGate } from "@/components/auth/github-auth-gate"
import Header from "@/components/layout/header"
import { SessionEditor } from "@/components/sessions/session-editor"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"

interface NewSessionPageProps {
  params: Promise<{
    username: string
    projectId: string
  }>
  searchParams: Promise<{
    commit: string
  }>
}

export default async function NewSessionPage({ params, searchParams }: NewSessionPageProps) {
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

  if (!response.ok) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <h3 className="text-2xl font-bold mb-8">New Session</h3>
          <GitHubAuthGate />
        </main>
      </div>
    )
  }

  const commitData = await response.json()
  const commit = {
    sha: commitData.sha,
    message: commitData.commit.message,
    author_name: commitData.commit.author.name,
    authored_at: commitData.commit.author.date,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl 2xl:max-w-none w-full">
        <SessionEditor projectId={project.id} commit={commit} fullName={project.full_name} />
      </main>
    </div>
  )
}
