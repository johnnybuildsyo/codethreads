import { SessionCard } from "./session-card"
import type { Session } from "@/lib/types/session"
import { User } from "@supabase/supabase-js"

interface SessionListProps {
  sessions: Session[]
  username: string
  projectId: string
  currentUser?: User | null
}

export function SessionList({ sessions, username, projectId, currentUser }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No sessions yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} username={username} projectId={projectId} currentUser={currentUser} />
      ))}
    </div>
  )
}
