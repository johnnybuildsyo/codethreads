"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "next-themes"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, useParams } from "next/navigation"
import { X, Sparkles, FileDiff, Plus, ChevronDown, ChevronUp, SparklesIcon } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableItem } from "./editor/sortable-item"
import { AIConnect } from "./editor/ai-connect"
import { generateThreadIdeas } from "@/lib/ai/threads/actions"
import { getStreamingText } from "@/app/api/ai/util"
import { toast } from "sonner"
import { readStreamableValue } from "ai/rsc"
import { ThreadPreview } from "./editor/thread-preview"
import { ThreadProvider } from "./editor/thread-context"
import { CommitInfo } from "./editor/commit-info"
import { ImageUpload } from "./editor/image-upload"
import { DiffSelector } from "./editor/diff-selector"
import { cn, shouldExcludeFile } from "@/lib/utils"
import { CommitDiff } from "./editor/commit-diff"
import { FileChange, ThreadSection } from "./editor/types"
import { ThreadIdeas } from "./editor/thread-ideas"
import { generateSectionPrompt } from "@/lib/ai/threads/prompts"

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

export function ThreadEditor({ projectId, commit, fullName }: ThreadEditorProps) {
  const { theme } = useTheme()
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<FileChange[]>([])
  const [view, setView] = useState<"edit" | "preview">("edit")
  const router = useRouter()
  const params = useParams()
  const [sections, setSections] = useState<ThreadSection[]>([
    {
      id: crypto.randomUUID(),
      type: "markdown",
      content: "",
      role: "intro",
    },
    {
      id: crypto.randomUUID(),
      type: "markdown",
      content: "",
      role: "details",
    },
    {
      id: crypto.randomUUID(),
      type: "markdown",
      content: "",
      role: "summary",
    },
  ])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const [aiEnabled] = useState(true)
  const [threadIdeas, setThreadIdeas] = useState<string[]>([])
  const [activeSectionId, setActiveSectionId] = useState<string>()
  const [diffDialogOpen, setDiffDialogOpen] = useState(false)

  let codeChanges = files
    .filter((f) => !shouldExcludeFile(f.filename))
    .map((f) => `File: ${f.filename}\n\nChanges:\n${f.newValue}`)
    .join("\n\n---\n\n")

  // Truncate if too long
  codeChanges = codeChanges.length > 20000 ? codeChanges.slice(0, 20000) + "...(truncated)" : codeChanges

  // Fetch diff when component mounts
  useEffect(() => {
    async function fetchDiff() {
      const response = await fetch(`/api/github/commits/${commit.sha}/diff?repo=${encodeURIComponent(fullName)}`)
      const data = await response.json()
      setFiles(data)
    }
    fetchDiff()
  }, [commit.sha, fullName])

  // Memoize filtered files
  const selectedDiffs = useMemo(
    () =>
      files
        .filter((f) => !shouldExcludeFile(f.filename))
        .map((file) => ({
          id: `diff-${file.filename}`,
          type: "diff" as const,
          file,
        })),
    [files]
  )

  const getProjectPath = () => {
    const { username, projectId } = params
    return `/${username}/${projectId}`
  }

  const handleCancel = () => {
    router.push(getProjectPath())
  }

  const handleSubmit = async () => {
    // setIsSubmitting(true)

    console.log("handleSubmit sections", JSON.stringify({ projectId, title, sections }, null, 2))

    // const supabase = createClient()

    // try {
    //   const content = sections
    //     .filter((s) => s.type === "markdown")
    //     .map((s) => s.content)
    //     .join("\n\n")

    //   const { data: thread } = await supabase
    //     .from("threads")
    //     .insert({
    //       project_id: projectId,
    //       title,
    //       teaser: content.slice(0, 280),
    //     })
    //     .select()
    //     .single()

    //   await supabase.from("posts").insert({
    //     thread_id: thread.id,
    //     intro: content,
    //     commit_sha: commit.sha,
    //   })

    //   router.push(getProjectPath())
    // } catch (error) {
    //   console.error("Failed to create thread:", error)
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  useEffect(() => {
    setSections((current) => {
      return current.filter((s) => s.type === "markdown")
    })
  }, [selectedDiffs])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const generateIdeas = async () => {
    const { object } = await generateThreadIdeas(codeChanges)
    for await (const partialObject of readStreamableValue(object)) {
      if (partialObject?.threadIdeas) {
        setThreadIdeas(partialObject.threadIdeas)
      }
    }
  }

  const generateMarkdownSection = async (section: ThreadSection) => {
    const prompt = generateSectionPrompt({
      section,
      title,
      sections,
      codeChanges,
    })

    const updateSectionContent = (content: string) => {
      setSections((current) => current.map((s) => (s.id === section.id ? { ...s, content: content } : s)))
    }

    await getStreamingText(prompt, updateSectionContent)
  }

  const handleImageUpload = async (file: File, sectionId: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { image_url } = await response.json()

      setSections((current) => {
        const updatedSections = current.map((section) => {
          if (section.id === sectionId && section.type === "markdown") {
            const imageMarkdown = `\n\n![](${image_url})`
            const updatedContent = section.content + imageMarkdown
            return {
              ...section,
              content: updatedContent,
            }
          }
          return section
        })
        return updatedSections
      })
    } catch (error) {
      console.error("Image upload failed:", error)
      toast.error("Failed to upload image. Please try again.")
    }
  }

  return (
    <ThreadProvider>
      <div className="space-y-4 2xl:grid 2xl:grid-cols-2">
        <div className="2xl:p-8 space-y-4 2xl:h-screen 2xl:overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Create Thread</h3>
            <AIConnect enabled={aiEnabled} />
          </div>

          {threadIdeas.length > 0 && <ThreadIdeas ideas={threadIdeas} onClose={() => setThreadIdeas([])} />}

          <CommitInfo commit={commit} files={files} fullName={fullName} />

          <div className="flex gap-4 items-center mb-4">
            <Input
              className="!text-2xl font-bold border-t-0 shadow-none border-l-0 border-r-0 rounded-none border-b-foreground/20 pl-1 !focus:outline-none !focus-visible:ring-0 focus:border-b-foreground !ring-0"
              placeholder="Thread title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button variant="outline" onClick={generateIdeas}>
              <>
                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                AI Assist
              </>
            </Button>
            <Tabs className="2xl:hidden" value={view} onValueChange={(v) => setView(v as "edit" | "preview")}>
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {view === "edit" ? (
            <>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                  {sections.map((section) => (
                    <SortableItem key={section.id} section={section}>
                      {section.type === "markdown" && (
                        <div className="relative mt-2">
                          <div className="flex flex-col gap-2 absolute -right-8 px-1">
                            <Button variant="ghost" className="h-6 w-6 p-0" onClick={() => setSections((s) => s.filter((item) => item.id !== section.id))}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="h-6 w-6 p-0 border-yellow-500/30 hover:animate-pulse" onClick={() => generateMarkdownSection(section)}>
                              <SparklesIcon className="h-4 w-4 text-yellow-500" />
                            </Button>
                          </div>
                          <Textarea
                            className="mb-2"
                            value={section.content}
                            onChange={(e) => setSections((s) => s.map((item) => (item.id === section.id ? { ...item, content: e.target.value } : item)))}
                            placeholder={
                              section.role === "intro"
                                ? "Start with what problem you're solving or what feature you're adding. What motivated these changes?"
                                : section.role === "summary"
                                ? "Wrap up with the key benefits and any next steps. What impact will these changes have?"
                                : "Explain the technical details. What approach did you take and why? What were the key decisions?"
                            }
                            rows={section.role === "details" ? 4 : 3}
                          />
                          <div className="flex gap-2">
                            <ImageUpload
                              onUpload={(file) => {
                                handleImageUpload(file, section.id)
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveSectionId(section.id)
                                setDiffDialogOpen(true)
                              }}
                            >
                              <FileDiff className="h-4 w-4 mr-1" />
                              Add Code
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSections((current) => {
                                  const index = current.findIndex((s) => s.id === section.id)
                                  const newSections = [...current]
                                  newSections.splice(index + 1, 0, {
                                    id: crypto.randomUUID(),
                                    type: "markdown",
                                    content: "",
                                    role: "details",
                                  })
                                  return newSections
                                })
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              New Section
                            </Button>
                          </div>
                        </div>
                      )}
                      {section.type === "diff" && section.file && <CommitDiff files={[section.file]} defaultRenderDiff={false} theme={theme} />}
                      {section.type === "code" && section.file && (
                        <div className="relative font-mono text-sm bg-muted rounded-lg">
                          <div className={cn("flex justify-between items-center text-xs text-muted-foreground px-4", section.isCollapsed ? "py-1" : "py-2")}>
                            <span>{section.file.filename}</span>
                            <Button variant="ghost" size="sm" onClick={() => setSections((s) => s.map((item) => (item.id === section.id ? { ...item, isCollapsed: !item.isCollapsed } : item)))}>
                              {section.isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                            </Button>
                          </div>
                          {!section.isCollapsed && (
                            <div className="p-4 pt-0">
                              <Textarea
                                value={section.file.newValue}
                                onChange={(e) => setSections((s) => s.map((item) => (item.id === section.id ? { ...item, file: { ...item.file!, newValue: e.target.value } } : item)))}
                                className="font-mono text-sm min-h-[200px] bg-transparent border-none focus-visible:ring-0 p-0 resize-none"
                                spellCheck={false}
                              />
                            </div>
                          )}
                        </div>
                      )}
                      {section.type === "file-link" && section.file && (
                        <a
                          href={`https://github.com/${fullName}/blob/${commit.sha}/${section.file.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          View {section.file.filename} on GitHub
                        </a>
                      )}
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            </>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {sections
                .filter((s) => s.type === "markdown")
                .map((section) => (
                  <div key={section.id} className="not-prose">
                    {section.content}
                  </div>
                ))}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!title || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Thread"}
            </Button>
          </div>
        </div>
        <div className="hidden 2xl:block px-8 2xl:h-screen overflow-y-auto">
          <ThreadPreview title={title} sections={sections} theme={theme} fullName={fullName} commit={commit} />
        </div>
      </div>

      <DiffSelector
        open={diffDialogOpen}
        onClose={() => {
          setDiffDialogOpen(false)
          setActiveSectionId(undefined)
        }}
        files={files}
        onSelect={(selections) => {
          setSections((current) => {
            const index = current.findIndex((s) => s.id === activeSectionId)
            const newSections = [...current]
            selections.forEach((selection, i) => {
              newSections.splice(index + 1 + i, 0, {
                id: crypto.randomUUID(),
                type: selection.type === "link" ? "file-link" : selection.type,
                file: selection.file,
              })
            })
            return newSections
          })
          setDiffDialogOpen(false)
          setActiveSectionId(undefined)
        }}
      />
    </ThreadProvider>
  )
}
