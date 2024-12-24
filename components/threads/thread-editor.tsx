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
import { CheckSquare, Square, X, Plus } from "lucide-react"

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

interface MarkdownSection {
  id: string
  content: string
  afterFile?: string // filename this section follows
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
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [showIntro, setShowIntro] = useState(true)
  const [showSummary, setShowSummary] = useState(true)
  const [sections, setSections] = useState<MarkdownSection[]>([])

  // Fetch diff when component mounts
  useEffect(() => {
    async function fetchDiff() {
      const response = await fetch(`/api/github/commits/${commit.sha}/diff?repo=${encodeURIComponent(fullName)}`)
      const data = await response.json()
      setFiles(data)
      // By default, select all files
      setSelectedFiles(new Set(data.map((f: FileChange) => f.filename)))
    }
    fetchDiff()
  }, [commit.sha, fullName])

  const toggleFile = (filename: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(filename)) {
      newSelected.delete(filename)
    } else {
      newSelected.add(filename)
    }
    setSelectedFiles(newSelected)
  }

  const selectedDiffs = files.filter((f) => selectedFiles.has(f.filename))

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

  const addSection = (afterFile: string) => {
    setSections([
      ...sections,
      {
        id: crypto.randomUUID(),
        content: "",
        afterFile,
      },
    ])
  }

  const updateSection = (id: string, content: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, content } : s)))
  }

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id))
  }

  const renderDiffWithSections = () => {
    return selectedDiffs.map((file, i) => (
      <div key={file.filename}>
        <div className="border rounded-lg p-4 bg-muted/50">
          <CommitDiff files={[file]} theme={theme} />
        </div>

        {i < selectedDiffs.length - 1 && !sections.some((s) => s.afterFile === file.filename) && (
          <div className="flex justify-center">
            <Button variant="ghost" onClick={() => addSection(file.filename)} className="mt-4">
              <Plus className="h-3 w-3 mr-1" />
              Add markdown
            </Button>
          </div>
        )}

        {sections
          .filter((s) => s.afterFile === file.filename)
          .map((section) => (
            <div key={section.id} className="relative mt-2">
              <Button variant="ghost" className="absolute -right-8 h-6 w-6 px-1" onClick={() => removeSection(section.id)}>
                <X className="h-4 w-4" />
              </Button>
              <Textarea value={section.content} onChange={(e) => updateSection(section.id, e.target.value)} placeholder="Add notes about these changes..." rows={2} />
            </div>
          ))}
      </div>
    ))
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
          <div className="space-y-2 py-4">
            <h4 className="text-sm font-medium">Included Commits to Files...</h4>
            <div className="flex flex-wrap gap-2">
              {files.map((file) => (
                <Button
                  key={file.filename}
                  variant={selectedFiles.has(file.filename) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleFile(file.filename)}
                  className="text-xs flex items-center gap-1.5"
                >
                  {selectedFiles.has(file.filename) ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                  {file.filename}
                </Button>
              ))}
            </div>
          </div>

          {showIntro ? (
            <div className="relative">
              <Button variant="ghost" className="absolute -right-8 h-6 w-6 px-1" onClick={() => setShowIntro(false)}>
                <X className="h-4 w-4" />
              </Button>
              <Textarea className="font-mono" placeholder="Introduce the changes you're making..." value={content} onChange={(e) => setContent(e.target.value)} rows={3} />
            </div>
          ) : (
            <Button variant="ghost" className="w-full" onClick={() => setShowIntro(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add introduction
            </Button>
          )}

          {renderDiffWithSections()}

          {showSummary ? (
            <div className="relative">
              <Button variant="ghost" className="absolute -right-8 h-6 w-6 px-1" onClick={() => setShowSummary(false)}>
                <X className="h-4 w-4" />
              </Button>
              <Textarea placeholder="Summarize the impact of these changes..." value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} />
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => setShowSummary(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Summary
            </Button>
          )}
        </>
      ) : (
        <div className="prose dark:prose-invert max-w-none">
          {showIntro && <ReactMarkdown>{content || "No introduction yet"}</ReactMarkdown>}
          {selectedDiffs.map((file, i) => (
            <div key={file.filename}>
              <div className="not-prose">
                <CommitDiff files={[file]} theme={theme} />
              </div>
              {sections
                .filter((s) => s.afterFile === file.filename)
                .map((section) => (
                  <ReactMarkdown key={section.id}>{section.content || "No notes yet"}</ReactMarkdown>
                ))}
            </div>
          ))}
          {showSummary && <ReactMarkdown>{summary || "No summary yet"}</ReactMarkdown>}
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
