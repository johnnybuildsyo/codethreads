"use client"

import Link from "next/link"
import type { ThreadCardProps } from "@/types/thread"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function ThreadCard({ thread, username, projectId, featured = false }: ThreadCardProps) {
  const threadUrl = `/${username}/${projectId}/thread/${thread.id}`
  const introSection = thread.sections.find((section: any) => section.type === "markdown" && section.role === "intro")
  const introContent = introSection?.content || ""
  const previewContent = introContent.split("\n")[0] || "No preview available"

  return (
    <div className={cn("border-t py-4 lg:pr-8 grid grid-cols-1 lg:grid-cols-3 gap-4")}>
      <div className="lg:col-span-2">
        <div className={cn("font-medium", featured ? "text-2xl" : "text-lg")}>{thread.title}</div>
        <div className="text-xs font-mono flex items-center space-x-2 pb-2">
          <span>{new Date(thread.created_at).toLocaleDateString()}</span>
          <span>·</span>
          <span>{thread.commit_shas.length} commits</span>
        </div>
        <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground line-clamp-2 mb-4">
          <ReactMarkdown>{previewContent}</ReactMarkdown>
        </div>
      </div>
      <div className="flex justify-end pb-1">
        <Button asChild variant="outline" size="sm">
          <Link href={threadUrl} className="inline-flex items-center">
            View Thread <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
