"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CookingPot, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { signInWithGitHub } from "@/components/auth/actions"
import { CommitManager } from "./commit-manager"
import { createClient } from "@/lib/supabase/client"

interface ProjectActionsProps {
  username: string
  projectId: string
  fullName: string
  totalCommits: number
  hasGitHubToken: boolean
}

export function ProjectActions({ username, projectId, fullName, totalCommits, hasGitHubToken }: ProjectActionsProps) {
  const [showCommits, setShowCommits] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleStartFromScratch = async () => {
    setIsCreating(true)
    try {
      const supabase = createClient()
      const { data: session, error } = await supabase
        .from("sessions")
        .insert({
          project_id: projectId,
          title: "New Session",
          blocks: [],
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/${username}/${projectId}/session/${session.id}/edit`)
    } catch (error) {
      console.error("Failed to create session:", error)
      setIsCreating(false)
    }
  }

  const handleStartFromCommit = async () => {
    if (!hasGitHubToken) {
      const url = await signInWithGitHub(window.location.pathname)
      if (url) {
        window.location.href = url
        return
      }
    }
    setShowCommits(true)
  }

  return (
    <>
      {!showCommits && (
        <Card className="mt-8 max-w-3xl mx-auto">
          <CardContent className="grid grid-cols-2 gap-6 p-6">
            <Card className="p-8 flex flex-col items-center justify-center gap-8">
              <p className="text-center text-balance text-muted-foreground">We’ll start you off with a clean slate and listen for new commits</p>
              <Button className="text-base py-3 w-64 h-auto" onClick={handleStartFromScratch} disabled={isCreating}>
                <CookingPot className="h-4 w-4 mr-2" />
                {isCreating ? "Creating..." : "Start from Scratch"}
              </Button>
            </Card>
            <Card className="p-8 flex flex-col items-center justify-center gap-8">
              <p className="text-center text-balance text-muted-foreground">Import commits you’ve already cooked up and start from there</p>
              <Button className="text-base py-3 w-64 h-auto" onClick={handleStartFromCommit}>
                <Sparkles className="h-4 w-4 mr-2" />
                {showCommits ? "Loading Commits..." : "Start from a Commit"}
              </Button>
            </Card>
          </CardContent>
        </Card>
      )}
      {hasGitHubToken && showCommits && (
        <div className="mt-8">
          <CommitManager projectId={projectId} fullName={fullName} totalCommits={totalCommits} />
        </div>
      )}
    </>
  )
}
