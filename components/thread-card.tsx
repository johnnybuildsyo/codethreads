"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { ThreadContent } from "./thread-content"
import type { ThreadCardProps } from "@/types/thread"
import { cn } from "@/lib/utils"

export function ThreadCard({ thread, username, projectId, featured = false }: ThreadCardProps) {
  const [isExpanded, setIsExpanded] = useState(featured)

  return (
    <div className={`border-t py-4 lg:pr-8`}>
      <div>
        <div className={cn("font-medium", featured ? "text-2xl" : "text-lg")}>{thread.title}</div>
        <div className="text-xs font-mono flex items-center space-x-2 pb-2">
          <span>{thread.date}</span>
        </div>
      </div>
      <div>
        {isExpanded && thread.firstPost ? <ThreadContent post={thread.firstPost} /> : <p className="text-sm text-muted-foreground mb-6">{thread.teaser}</p>}
        <div className="flex items-center justify-between">
          {thread.firstPost && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm text-primary hover:underline flex items-center space-x-1">
              <span>{isExpanded ? "Show less" : "Read full thread"}</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
          <Link href={`/${username}/${projectId}/thread/${thread.id}`} className="text-xs font-mono text-muted-foreground hover:text-primary hover:underline">
            Permalink →
          </Link>
        </div>
      </div>
    </div>
  )
}
