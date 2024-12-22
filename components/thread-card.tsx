"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ThreadContent } from "./thread-content"
import type { ThreadCardProps } from "@/types/thread"

export function ThreadCard({ thread, username, projectId, featured = false }: ThreadCardProps) {
  const [isExpanded, setIsExpanded] = useState(featured)

  return (
    <Card className={`transition-shadow hover:shadow-md ${featured ? "border-2" : ""}`}>
      <CardHeader>
        <CardTitle className={featured ? "text-2xl" : "text-lg"}>{thread.title}</CardTitle>
        <CardDescription className="text-sm flex items-center space-x-2">
          <CalendarDays className="h-3 w-3" />
          <span>{thread.date}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isExpanded && thread.firstPost ? <ThreadContent post={thread.firstPost} /> : <p className="text-sm text-muted-foreground mb-6">{thread.teaser}</p>}
        <div className="flex items-center justify-between">
          {thread.firstPost && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm text-primary hover:underline flex items-center space-x-1">
              <span>{isExpanded ? "Show less" : "Read full thread"}</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
          <Link href={`/${username}/${projectId}/thread/${thread.id}`} className="text-sm text-muted-foreground hover:text-primary hover:underline">
            Permalink →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
