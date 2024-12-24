"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import type { Commit } from "@/types/github"
import DiffViewer from "react-diff-viewer-continued"
import { useTheme } from "next-themes"
import ReactMarkdown from "react-markdown"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

interface ThreadEditorProps {
  projectId: string
  commit: {
    sha: string
    message: string
    author_name: string
    authored_at: string
  }
  fullName: string
  username: string
}

interface FileChange {
  filename: string
  status: string
  additions: number
  deletions: number
  oldValue: string
  newValue: string
}

const CommitDiff = ({ files, theme }: { files: FileChange[]; theme: string | undefined }) => (
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
)

export function ThreadEditor({ projectId, commit, fullName, username }: ThreadEditorProps) {
  const { theme } = useTheme()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<FileChange[]>([])
  const [view, setView] = useState<"write" | "preview">("write")
  const router = useRouter()

  // Fetch diff when component mounts
  useEffect(() => {
    async function fetchDiff() {
      const response = await fetch(`/api/github/commits/${commit.sha}/diff?repo=${encodeURIComponent(fullName)}`)
      const data = await response.json()
      setFiles(data)
    }
    fetchDiff()
  }, [commit.sha, fullName])

  const handleCancel = () => {
    router.push(`/${username}/${projectId}`)
  }

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

      router.push(`/${username}/${projectId}`)
    } catch (error) {
      console.error("Failed to create thread:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Create Thread</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Write (in Markdown) about the changes in commit: <code className="text-xs">{commit.sha.slice(0, 7)}</code>
      </p>

      <div className="flex gap-4 items-center mb-4">
        <Input className="!text-2xl font-bold" placeholder="Thread title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
        <Tabs value={view} onValueChange={(v) => setView(v as "write" | "preview")}>
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "write" ? (
        <>
          <Textarea className="font-mono" placeholder="Introduce the changes you're making..." value={content} onChange={(e) => setContent(e.target.value)} rows={3} />
          <CommitDiff files={files} theme={theme} />
          <Textarea placeholder="Summarize the impact of these changes..." value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} />
        </>
      ) : (
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{content || "No introduction yet"}</ReactMarkdown>
          <div className="not-prose">
            <CommitDiff files={files} theme={theme} />
          </div>
          <ReactMarkdown>{summary || "No summary yet"}</ReactMarkdown>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!title || !content || !summary || isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Thread"}
        </Button>
      </div>
    </div>
  )
}
