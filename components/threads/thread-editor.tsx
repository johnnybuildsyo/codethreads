"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "next-themes"
import ReactMarkdown from "react-markdown"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, useParams } from "next/navigation"
import { CheckSquare, Square, X, Plus, Sparkles } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CommitDiff } from "./editor/commit-diff"
import { SortableItem } from "./editor/sortable-item"
import { AIConnect } from "./editor/ai-connect"
import { generateThreadIdeas } from "@/lib/ai/threads/actions"
import { getStreamingText } from "@/app/api/ai/util"
import { toast } from "sonner"
import { readStreamableValue } from "ai/rsc"
import { Card, CardContent, CardTitle } from "../ui/card"

interface ThreadEditorProps {
  projectId: string
  commit: {
    sha: string
    message: string
    author_name: string
    authored_at: string
  }
  fullName: string
}

interface FileChange {
  filename: string
  status: string
  additions: number
  deletions: number
  oldValue: string
  newValue: string
}

interface ThreadSection {
  id: string
  type: "intro" | "diff" | "markdown" | "summary"
  content?: string
  file?: FileChange
  afterFile?: string
}

const shouldExcludeFile = (filename: string): boolean => {
  const excludePatterns = [
    /^public\//, // public folder
    /package-lock\.json$/, // npm
    /yarn\.lock$/, // yarn
    /pnpm-lock\.yaml$/, // pnpm
    /\.lock$/, // generic lock files
    /\.(woff2?|ttf|eot|otf)$/, // font files
    /\.ico$/, // ico files
  ]

  return excludePatterns.some((pattern) => pattern.test(filename))
}

export function ThreadEditor({ projectId, commit, fullName }: ThreadEditorProps) {
  const { theme } = useTheme()
  const [title, setTitle] = useState("")
  const [intro, setIntro] = useState("")
  const [summary, setSummary] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<FileChange[]>([])
  const [view, setView] = useState<"edit" | "preview">("edit")
  const router = useRouter()
  const params = useParams()
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [showIntro, setShowIntro] = useState(true)
  const [showSummary, setShowSummary] = useState(true)
  const [sections, setSections] = useState<ThreadSection[]>([])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const [isDragging, setIsDragging] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiEnabled] = useState(true)
  const [threadIdeas, setThreadIdeas] = useState<string[]>([])

  let codeChanges = files
    .filter((f) => selectedFiles.has(f.filename))
    .map((f) => `File: ${f.filename}\n\nChanges:\n${f.newValue}`)
    .join("\n\n---\n\n")

  // Truncate if too long
  codeChanges = codeChanges.length > 20000 ? codeChanges.slice(0, 20000) + "...(truncated)" : codeChanges

  console.log({ codeChanges })

  // Fetch diff when component mounts
  useEffect(() => {
    async function fetchDiff() {
      const response = await fetch(`/api/github/commits/${commit.sha}/diff?repo=${encodeURIComponent(fullName)}`)
      const data = await response.json()
      setFiles(data)
      // By default, select all non-excluded files
      setSelectedFiles(new Set(data.filter((f: FileChange) => !shouldExcludeFile(f.filename)).map((f: FileChange) => f.filename)))
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

  const getProjectPath = () => {
    const { username, projectId } = params
    return `/${username}/${projectId}`
  }

  const handleCancel = () => {
    router.push(getProjectPath())
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
          teaser: intro.slice(0, 280),
        })
        .select()
        .single()

      if (threadError) throw threadError

      const { error: postError } = await supabase.from("posts").insert({
        thread_id: thread.id,
        intro: `${intro}\n\n${summary}`,
        commit_sha: commit.sha,
      })

      if (postError) throw postError

      router.push(getProjectPath())
    } catch (error) {
      console.error("Failed to create thread:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    // Only include sections for selected files
    const selectedDiffs = files
      .filter((f) => selectedFiles.has(f.filename))
      .map((file) => ({
        id: `diff-${file.filename}`,
        type: "diff" as const,
        file,
      }))

    // Keep non-diff sections and add selected diffs
    setSections((current) => {
      const nonDiffSections = current.filter((s) => s.type !== "diff")
      return [{ id: "intro", type: "intro" as const }, ...selectedDiffs, { id: "summary", type: "summary" as const }]
    })
  }, [files, selectedFiles])

  const handleDragStart = () => setIsDragging(true)
  const handleDragEnd = (event: any) => {
    setIsDragging(false)
    const { active, over } = event

    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addMarkdownSection = (afterId: string) => {
    setSections((current) => {
      const index = current.findIndex((s) => s.id === afterId)
      const newSections = [...current]
      newSections.splice(index + 1, 0, {
        id: crypto.randomUUID(),
        type: "markdown",
        content: "",
      })
      return newSections
    })
  }

  const generateIdeas = async () => {
    const { object } = await generateThreadIdeas(codeChanges)
    for await (const partialObject of readStreamableValue(object)) {
      if (partialObject?.threadIdeas) {
        setThreadIdeas(partialObject.threadIdeas)
      }
    }
  }

  const generateIntro = async () => {
    setIsGenerating(true)
    try {
      setIntro("")
      setView("preview")
      const input = `Given the following code changes, reply with a short intro of 1-2 paragraphs. The writing style should be concise and to the point without hyperbole:\n\n${codeChanges}`
      await getStreamingText(input, setIntro)
    } catch (error) {
      console.error("Failed to generate thread:", error)
      toast.error("AI generation failed. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Create Thread</h3>
        <AIConnect enabled={aiEnabled} />
      </div>

      {threadIdeas.length > 0 && (
        <Card>
          <CardTitle className="text-sm font-medium px-4 py-2 border-b">AI Generated Thread Ideas</CardTitle>
          <CardContent className="p-2">
            <div className="flex flex-wrap justify-center">
              {threadIdeas.map((idea) => (
                <div className="w-1/3" key={idea}>
                  <div className="p-2">
                    <div className="text-center text-balance border text-sm rounded-lg p-2">{idea}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-lg py-8">
              <div>Choose an idea</div>
              <div className="text-sm">
                or{" "}
                <button className="underline" onClick={generateIdeas}>
                  try again
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        Write (in Markdown) about the changes in commit: <code className="text-xs">{commit.sha.slice(0, 7)}</code>
      </p>

      <div className="flex gap-4 items-center mb-4">
        <Input className="!text-2xl font-bold" placeholder="Thread title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button variant="outline" onClick={generateIdeas} disabled={!aiEnabled || isGenerating}>
          {isGenerating ? (
            <span className="animate-pulse">Generating...</span>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assist
            </>
          )}
        </Button>
        <Tabs value={view} onValueChange={(v) => setView(v as "edit" | "preview")}>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "edit" ? (
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

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={sections} strategy={verticalListSortingStrategy}>
              {sections.map((section, index) => (
                <SortableItem key={section.id} section={section}>
                  {section.type === "intro" && (
                    <div className="relative">
                      {showIntro ? (
                        <>
                          <Button variant="ghost" className="absolute -right-8 h-6 w-6 px-1" onClick={() => setShowIntro(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                          <Textarea className="font-mono" placeholder="Introduce the changes you're making..." value={intro} onChange={(e) => setIntro(e.target.value)} rows={3} />
                        </>
                      ) : (
                        <Button variant="ghost" className="w-full" onClick={() => setShowIntro(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add introduction
                        </Button>
                      )}
                    </div>
                  )}
                  {section.type === "diff" && section.file && (
                    <>
                      <div className="border rounded-lg p-4 bg-muted/50">
                        <CommitDiff files={[section.file]} theme={theme} onRemove={() => toggleFile(section.file!.filename)} />
                      </div>
                      {!isDragging && index < sections.length - 2 && (
                        <div className="flex justify-center">
                          <Button variant="ghost" onClick={() => addMarkdownSection(section.id)} className="mt-4">
                            <Plus className="h-3 w-3 mr-1" />
                            Add markdown
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                  {section.type === "markdown" && (
                    <div className="relative mt-2">
                      <Button variant="ghost" className="absolute -right-8 h-6 w-6 px-1" onClick={() => setSections((s) => s.filter((item) => item.id !== section.id))}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Textarea
                        value={section.content}
                        onChange={(e) => setSections((s) => s.map((item) => (item.id === section.id ? { ...item, content: e.target.value } : item)))}
                        placeholder="Add notes about these changes..."
                        rows={2}
                      />
                    </div>
                  )}
                  {section.type === "summary" && (
                    <div className="relative">
                      {showSummary ? (
                        <>
                          <Button variant="ghost" className="absolute -right-8 h-6 w-6 px-1" onClick={() => setShowSummary(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                          <Textarea placeholder="Summarize the impact of these changes..." value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} />
                        </>
                      ) : (
                        <Button variant="ghost" className="w-full" onClick={() => setShowSummary(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add summary
                        </Button>
                      )}
                    </div>
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </>
      ) : (
        <div className="prose dark:prose-invert max-w-none">
          {showIntro && <ReactMarkdown>{intro || "No introduction yet"}</ReactMarkdown>}
          {sections
            .filter((s) => s.type === "diff")
            .map((section) => (
              <div key={section.id} className="not-prose">
                {section.file && <CommitDiff files={[section.file]} theme={theme} />}
              </div>
            ))}
          {showSummary && <ReactMarkdown>{summary || "No summary yet"}</ReactMarkdown>}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!title || !intro || !summary || isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Thread"}
        </Button>
      </div>
    </div>
  )
}
