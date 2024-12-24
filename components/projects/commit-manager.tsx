"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Commit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      email: string
      date: string
    }
  }
}

interface CommitManagerProps {
  projectId: string
  fullName: string
}

const COMMITS_PER_PAGE = 5

export function CommitManager({ projectId, fullName }: CommitManagerProps) {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    async function fetchUnprocessedCommits() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.provider_token) return

      try {
        // Get all commits from GitHub
        const response = await fetch(`https://api.github.com/repos/${fullName}/commits`, {
          headers: {
            Authorization: `Bearer ${session.provider_token}`,
            Accept: "application/vnd.github.v3+json",
          },
        })
        const allCommits = await response.json()

        // Get processed commits from our database
        const { data: processedCommits } = await supabase.from("commits").select("sha").eq("project_id", projectId)

        // Filter out commits that have already been processed and sort by date
        const processedShas = new Set(processedCommits?.map((c) => c.sha) || [])
        const unprocessedCommits = allCommits
          .filter((c: Commit) => !processedShas.has(c.sha))
          .sort((a: Commit, b: Commit) => new Date(a.commit.author.date).getTime() - new Date(b.commit.author.date).getTime())

        setCommits(unprocessedCommits)
      } catch (error) {
        console.error("Failed to fetch commits:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUnprocessedCommits()
  }, [fullName, projectId])

  const handleAction = async (commit: Commit, action: "new" | "existing" | "ignore") => {
    console.log(`Processing commit ${commit.sha} with action: ${action}`)
    // TODO: Process the commit based on action
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading commits...</div>
  if (commits.length === 0) return null

  const pageStart = page * COMMITS_PER_PAGE
  const pageEnd = pageStart + COMMITS_PER_PAGE
  const currentPageCommits = commits.slice(pageStart, pageEnd)
  const totalPages = Math.ceil(commits.length / COMMITS_PER_PAGE)

  return (
    <div className="space-y-6 border-t pt-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Process Commits</h2>
        <div className="flex items-center space-x-2 text-sm">
          <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <Button variant="ghost" size="sm" disabled={pageEnd >= commits.length} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {currentPageCommits.map((commit) => (
          <div key={commit.sha} className="border p-4 rounded-lg">
            <p className="font-mono text-sm text-muted-foreground">{commit.sha.slice(0, 7)}</p>
            <p className="font-medium">{commit.commit.message.split("\n")[0]}</p>
            <p className="text-sm text-muted-foreground mt-1">{new Date(commit.commit.author.date).toLocaleDateString()}</p>
            <div className="mt-4 flex items-center space-x-2">
              <Button onClick={() => handleAction(commit, "new")}>New Thread</Button>
              <Button onClick={() => handleAction(commit, "existing")} variant="outline">
                Add to Thread
              </Button>
              <Button onClick={() => handleAction(commit, "ignore")} variant="ghost">
                Ignore
              </Button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{commits.length} unprocessed commits</p>
    </div>
  )
}
