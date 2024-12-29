import { ThreadCard } from "./thread-card"
import type { Thread } from "@/types/thread"

interface ThreadListProps {
  threads: Thread[]
  username: string
  projectId: string
}

export function ThreadList({ threads, username, projectId }: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No threads yet</p>
        <p className="text-sm">Create a thread to document your code changes</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} username={username} projectId={projectId} />
      ))}
    </div>
  )
}
