import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Header from "@/components/layout/header"
import { ThreadView } from "@/components/threads/thread-view"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ThreadSection } from "@/components/threads/editor/types"

interface ThreadPageProps {
  params: Promise<{
    username: string
    projectId: string
    threadId: string
  }>
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { username, projectId, threadId } = await params
  const supabase = await createClient()

  // Get thread data
  const thread = await supabase
    .from("threads")
    .select("*, commit_shas")
    .eq("id", threadId)
    .single()
    .then(({ data }) => (data ? { ...data, sections: (JSON.parse(data.sections as string) as ThreadSection[]) || [] } : null))

  if (!thread) {
    notFound()
  }

  // Get next and previous threads
  const [{ data: prevThread }, { data: nextThread }] = await Promise.all([
    supabase.from("threads").select("id").eq("project_id", thread.project_id).lt("created_at", thread.created_at).order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("threads").select("id").eq("project_id", thread.project_id).gt("created_at", thread.created_at).order("created_at", { ascending: true }).limit(1).single(),
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

        <ThreadView thread={thread} fullName={project.full_name} />

        <div className="flex justify-between mt-8">
          {prevThread ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${username}/${projectId}/thread/${prevThread.id}`}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Thread
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {nextThread ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${username}/${projectId}/thread/${nextThread.id}`}>
                Next Thread <ChevronRight className="ml-2 h-4 w-4" />
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
