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
      <div className={className}>
        <Button variant="ghost" className="h-auto p-0 group hover:ring-1 hover:ring-foreground/10 hover:bg-transparent pl-1 relative -left-1" onClick={() => setIsEditing(true)}>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <Pencil className="h-3 w-3 opacity-0 scale-75 relative -left-1 -top-1 group-hover:opacity-100 duration-300 ease-in-out transition-opacity" />
          </div>
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
