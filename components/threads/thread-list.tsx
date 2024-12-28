import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"

interface Thread {
  id: string
  title: string
  created_at: string
  published_at: string | null
  sections: any[]
}

interface ThreadListProps {
  threads: Thread[]
  username: string
  projectId: string
}

export function ThreadList({ threads, username, projectId }: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="col-span-2">
        <p className="text-muted-foreground text-sm">No CodeThreads yet.</p>
      </div>
    )
  }

  return (
    <div className="col-span-2 space-y-4">
      <h2 className="font-medium">CodeThreads</h2>
      <div className="space-y-4">
        {threads.map((thread) => (
          <Link key={thread.id} href={`/${username}/${projectId}/thread/${thread.id}`}>
            <Card className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{thread.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</p>
                </div>
                {thread.published_at ? (
                  <Badge variant="secondary">
                    <Zap className="h-3 w-3 mr-1" />
                    Published
                  </Badge>
                ) : (
                  <Badge variant="outline">Draft</Badge>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
