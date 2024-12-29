"use client"

import type { Thread } from "@/types/thread"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { getLanguageFromFilename } from "@/lib/utils"
import { useTheme } from "next-themes"

interface ThreadViewProps {
  thread: Thread
}

export function ThreadView({ thread }: ThreadViewProps) {
  const { theme } = useTheme()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{thread.title}</h1>
        <div className="text-xs font-mono flex items-center space-x-2 pb-2">
          <span>{new Date(thread.created_at).toLocaleDateString()}</span>
          <span>·</span>
          <span>{thread.commit_shas.length} commits</span>
        </div>
      </div>

      <div className="space-y-8">
        {thread.sections.map((section: any) => (
          <div key={section.id}>
            {section.type === "markdown" && (
              <div className="prose dark:prose-invert">
                <ReactMarkdown>{section.content || ""}</ReactMarkdown>
              </div>
            )}
            {section.type === "code" && section.content && (
              <div className="relative font-mono text-sm bg-muted rounded-lg mb-4">
                <div className="text-xs text-muted-foreground p-4 pb-0">{section.filename}</div>
                <div className="overflow-auto">
                  <SyntaxHighlighter language={getLanguageFromFilename(section.filename || "")} style={theme === "dark" ? oneDark : oneLight} customStyle={{ margin: 0, background: "transparent" }}>
                    {section.content}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}
            {section.type === "commit-links" && section.content && (
              <div className="prose dark:prose-invert">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
