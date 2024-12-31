"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LoadingAnimation } from "../ui/loading-animation"
import Link from "next/link"

interface ProjectEditFormProps {
  project: {
    id: string
    name: string
    display_name: string
    description: string | null
    homepage: string | null
  }
  username: string
}

export function ProjectEditForm({ project, username }: ProjectEditFormProps) {
  const [displayName, setDisplayName] = useState(project.display_name)
  const [description, setDescription] = useState(project.description || "")
  const [homepage, setHomepage] = useState(project.homepage || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("projects")
        .update({
          display_name: displayName,
          description: description || null,
          homepage: homepage || null,
        })
        .eq("id", project.id)

      if (error) throw error

      toast.success("Project updated successfully")
      router.push(`/${username}/${project.name}`)
      router.refresh()
    } catch (error) {
      console.error("Failed to update project:", error)
      toast.error("Failed to update project")
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Update your project information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="homepage">Homepage URL</Label>
            <Input id="homepage" type="url" value={homepage} onChange={(e) => setHomepage(e.target.value)} placeholder="https://" />
          </div>

          <div className="flex justify-end space-x-4">
            {isSubmitting ? (
              <LoadingAnimation className="text-sm">Saving Changes</LoadingAnimation>
            ) : (
              <>
                <Link className="text-sm opacity-80 hover:opacity-100 flex items-center px-4 py-1 rounded-md" href={`/${username}/${project.name}`}>
                  Cancel
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
