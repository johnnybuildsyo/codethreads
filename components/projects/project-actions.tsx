"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CookingPot, Sparkles } from "lucide-react"
import Link from "next/link"
import { signInWithGitHub } from "@/components/auth/actions"
import { CommitManager } from "./commit-manager"

interface ProjectActionsProps {
  username: string
  projectId: string
  fullName: string
  totalCommits: number
  hasGitHubToken: boolean
}

export function ProjectActions({ username, projectId, fullName, totalCommits, hasGitHubToken }: ProjectActionsProps) {
  const [showCommits, setShowCommits] = useState(false)

  const handleStartFromCommit = async () => {
    if (!hasGitHubToken) {
      await signInWithGitHub()
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
              <Link href={`/${username}/${projectId}/session/new`}>
                <Button className="text-base py-3 w-64 h-auto">
                  <CookingPot className="h-4 w-4 mr-2" />
                  Start from Scratch
                </Button>
              </Link>
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
