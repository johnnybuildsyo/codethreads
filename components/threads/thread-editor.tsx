"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import type { Commit } from "@/types/github"

interface ThreadEditorProps {
  projectId: string
  commit: Commit
  onClose: () => void
}

export function ThreadEditor({ projectId, commit, onClose }: ThreadEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const supabase = createClient()

    try {
      // Create thread
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

      // Create post with commit
      const { error: postError } = await supabase.from("posts").insert({
        thread_id: thread.id,
        content,
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

      <Input placeholder="Thread title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />

      <Textarea placeholder="What's significant about this commit?" value={content} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)} rows={5} />

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!title || !content || isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Thread"}
        </Button>
      </div>
    </div>
  )
}
