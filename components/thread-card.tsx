"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ThreadPost {
  content: string
  timestamp: string
  commit?: {
    message: string
    diff: string
  }
}

interface Thread {
  id: number
  title: string
  date: string
  teaser: string
  firstPost?: ThreadPost
}

interface ThreadCardProps {
  thread: Thread
  username: string
  projectId: string
  featured?: boolean
}

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
        {isExpanded && thread.firstPost ? (
          <>
            <p className="text-base text-muted-foreground mb-6">{thread.firstPost.content}</p>
            {thread.firstPost.commit && (
              <div className="bg-muted rounded-md mb-6 overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 border-b">
                  <h3 className="font-mono text-sm">
                    <span className="text-muted-foreground">Commit:</span> {thread.firstPost.commit.message}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <pre className="text-xs leading-relaxed">
                    <code className="block p-4">
                      {thread.firstPost.commit.diff.split("\n").map((line, i) => {
                        let lineClass = "block"
                        if (line.startsWith("+")) {
                          lineClass += " bg-green-500/10 text-green-700"
                        } else if (line.startsWith("-")) {
                          lineClass += " bg-red-500/10 text-red-700"
                        } else if (line.startsWith("@")) {
                          lineClass += " bg-blue-500/10 text-blue-700"
                        }
                        return (
                          <span key={i} className={lineClass}>
                            {line}
                          </span>
                        )
                      })}
                    </code>
                  </pre>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground mb-6">{thread.teaser}</p>
        )}
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
