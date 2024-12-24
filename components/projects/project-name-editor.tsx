"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, X, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ProjectNameEditorProps {
  projectId: string
  initialName: string
  className?: string
}

export function ProjectNameEditor({ projectId, initialName, className }: ProjectNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(initialName)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("projects").update({ display_name: displayName }).eq("id", projectId)

    if (error) {
      console.error("Failed to update display name:", error)
      setDisplayName(initialName)
    }

    setIsLoading(false)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <h1 className="text-3xl font-bold">{displayName}</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="!text-3xl font-bold h-auto py-0 max-w-xl" />
      <Button variant="ghost" size="icon" disabled={isLoading} onClick={handleSave}>
        <Check className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={isLoading}
        onClick={() => {
          setDisplayName(initialName)
          setIsEditing(false)
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
