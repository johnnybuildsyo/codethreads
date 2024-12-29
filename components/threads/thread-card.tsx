"use client"

import { useState } from "react"
import Link from "next/link"
import type { ThreadCardProps } from "@/types/thread"
import { cn } from "@/lib/utils"

export function ThreadCard({ thread, username, projectId, featured = false }: ThreadCardProps) {
  const [isExpanded, setIsExpanded] = useState(featured)

  return (
    <div className={`border-t py-4 lg:pr-8`}>
      <div>
        <div className={cn("font-medium", featured ? "text-2xl" : "text-lg")}>{thread.title}</div>
        <div className="text-xs font-mono flex items-center space-x-2 pb-2">
          <span>{new Date(thread.created_at).toLocaleDateString()}</span>
          <span>·</span>
          <span>{thread.commit_shas.length} commits</span>
        </div>
      </div>
      <div>
        {isExpanded && (
          <div className="prose dark:prose-invert">
            {thread.sections.map((section: any) => (
              <div key={section.id}>{section.type === "markdown" && section.content}</div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm text-primary flex items-center space-x-1">
            <span>[{isExpanded ? "-" : "+"}]</span>
            <span>{isExpanded ? "Close thread" : "Open thread"}</span>
          </button>
          <Link href={`/${username}/${projectId}/thread/${thread.id}`} className="text-xs font-mono text-muted-foreground hover:text-primary hover:underline">
            Permalink →
          </Link>
        </div>
      </div>
    </div>
  )
}
