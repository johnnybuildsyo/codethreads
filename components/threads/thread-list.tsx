import { ThreadCard } from "./thread-card"
import type { Thread } from "@/types/thread"
import { User } from "@supabase/supabase-js"

interface ThreadListProps {
  threads: Thread[]
  username: string
  projectId: string
  currentUser?: User | null
}

export function ThreadList({ threads, username, projectId, currentUser }: ThreadListProps) {
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
        <ThreadCard key={thread.id} thread={thread} username={username} projectId={projectId} currentUser={currentUser} />
      ))}
    </div>
  )
}
