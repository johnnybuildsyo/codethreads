"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import type { Commit } from "@/types/github"
import DiffViewer from "react-diff-viewer-continued"
import { useTheme } from "next-themes"

interface ThreadEditorProps {
  projectId: string
  commit: Commit
  fullName: string
  onClose: () => void
}

interface FileChange {
  filename: string
  status: string
  additions: number
  deletions: number
  oldValue: string
  newValue: string
}

export function ThreadEditor({ projectId, commit, fullName, onClose }: ThreadEditorProps) {
  const { theme } = useTheme()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<FileChange[]>([])

  // Fetch diff when component mounts
  useEffect(() => {
    async function fetchDiff() {
      const response = await fetch(`/api/github/commits/${commit.sha}/diff?repo=${encodeURIComponent(fullName)}`)
      const data = await response.json()
      setFiles(data)
    }
    fetchDiff()
  }, [commit.sha, fullName])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const supabase = createClient()

    try {
      const { data: thread, error: threadError } = await supabase
        .from("threads")
        .insert({
          project_id: projectId,
          title,
          teaser: content.slice(0, 280),
        })
        .select()
        .single()

      if (threadError) throw threadError

      const { error: postError } = await supabase.from("posts").insert({
        thread_id: thread.id,
        content: `${content}\n\n${summary}`,
        commit_sha: commit.sha,
      })

      if (postError) throw postError

      onClose()
    } catch (error) {
      console.error("Failed to create thread:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Create Thread</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Write about the changes in commit: <code className="text-xs">{commit.sha.slice(0, 7)}</code>
        </p>
      </div>

      <Input className="!text-xl" placeholder="Thread title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />

      <Textarea placeholder="Introduce the changes you're making..." value={content} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)} rows={3} />

      <div className="space-y-4">
        {files.map((file, i) => (
          <div key={i} className="border rounded-lg p-4 bg-muted/50">
            <div className="flex justify-between items-center mb-2">
              <code className="text-xs">{file.filename}</code>
              <span className="text-xs text-muted-foreground">
                +{file.additions} -{file.deletions}
              </span>
            </div>
            <div className="max-h-[300px] overflow-auto text-[13px]">
              <DiffViewer
                oldValue={file.oldValue}
                newValue={file.newValue}
                splitView={false}
                useDarkTheme={theme === "dark"}
                hideLineNumbers
                styles={{
                  contentText: {
                    fontSize: "13px",
                    lineHeight: "1.4",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  },
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <Textarea placeholder="Summarize the impact of these changes..." value={summary} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSummary(e.target.value)} rows={3} />

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!title || !content || !summary || isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Thread"}
        </Button>
      </div>
    </div>
  )
}
