"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { ChevronsRight, SquarePen } from "lucide-react"
import { SessionBlock, Session } from "@/lib/types/session"

interface SessionCardProps {
  session: Session
  username: string
  projectId: string
  featured?: boolean
  currentUser?: any
}

export function SessionCard({ session, username, projectId, featured = false, currentUser }: SessionCardProps) {
  const sessionUrl = `/${username}/${projectId}/session/${session.id}`
  const editUrl = `${sessionUrl}/edit`
  const introSection = session.blocks.find((section: SessionBlock) => section.type === "markdown" && section.role === "intro")
  const introContent = introSection?.content || ""
  const previewContent = introContent.split("\n")[0] || "No preview available"
  const isAuthor = currentUser?.id === session.user_id

  return (
    <div className={cn("border-t py-4 lg:pr-8 grid grid-cols-1 lg:grid-cols-3 gap-4")}>
      <div className="lg:col-span-2">
        <div className={cn("font-medium", featured ? "text-2xl" : "text-lg")}>{session.title}</div>
        <div className="text-xs font-mono flex items-center space-x-2 pb-2">
          <span>{new Date(session.created_at).toLocaleDateString()}</span>
          <span>·</span>
          <span>{session.commit_shas.length} commits</span>
        </div>
        <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground line-clamp-2 mb-4">
          <ReactMarkdown>{previewContent}</ReactMarkdown>
        </div>
      </div>
      <div className="flex justify-end pb-1 gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={sessionUrl} className="inline-flex items-center">
            View Session <ChevronsRight className="h-4 w-4" />
          </Link>
        </Button>
        {isAuthor && (
          <Button asChild size="sm">
            <Link href={editUrl}>
              Edit Session
              <SquarePen className="h-3 w-3" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
