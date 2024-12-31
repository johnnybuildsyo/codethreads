import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Header from "@/components/layout/header"
import { SessionView } from "@/components/sessions/session-view"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { SessionBlock } from "@/lib/types/session"

interface SessionPageProps {
  params: Promise<{
    username: string
    projectId: string
    sessionId: string
  }>
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { username, projectId, sessionId } = await params
  const supabase = await createClient()

  // Get session data
  const session = await supabase
    .from("sessions")
    .select("*, commit_shas")
    .eq("id", sessionId)
    .single()
    .then(({ data }) => (data ? { ...data, blocks: (JSON.parse(data.blocks as string) as SessionBlock[]) || [] } : null))

  if (!session) {
    notFound()
  }

  // Get next and previous sessions
  const [{ data: prevSession }, { data: nextSession }] = await Promise.all([
    supabase.from("sessions").select("id").eq("project_id", session.project_id).lt("created_at", session.created_at).order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("sessions").select("id").eq("project_id", session.project_id).gt("created_at", session.created_at).order("created_at", { ascending: true }).limit(1).single(),
  ])

  // Get project details
  const { data: project } = await supabase.from("projects").select("full_name").eq("name", projectId).single()

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 w-full max-w-6xl">
        <Link href={`/${username}/${projectId}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to project
        </Link>

        <SessionView session={session} fullName={project.full_name} />

        <div className="flex justify-between mt-8">
          {prevSession ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${username}/${projectId}/session/${prevSession.id}`}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Session
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {nextSession ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${username}/${projectId}/session/${nextSession.id}`}>
                Next Session <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  )
}
