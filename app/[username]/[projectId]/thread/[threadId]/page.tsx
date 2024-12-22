import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Header from "@/components/layout/header"
import { projectData } from "@/_mocks/projects"
import { ThreadCard } from "@/components/threads/thread-card"
import Link from "next/link"

interface ThreadPageProps {
  params: Promise<{
    username: string
    projectId: string
    threadId: string
  }>
}

async function getThreadData(threadId: string) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return projectData.threads.find((thread) => thread.id.toString() === threadId)
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { username, projectId, threadId } = await params
  const thread = await getThreadData(threadId)

  if (!thread) {
    return <div>Thread not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href={`/${username}/${projectId}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to project
        </Link>

        <ThreadCard thread={thread} username={username} projectId={projectId} featured={true} />

        <div className="flex justify-between mt-8">
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Thread
          </Button>
          <Button variant="outline" size="sm">
            Next Thread <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
