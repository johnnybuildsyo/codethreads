"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { LoadingAnimation } from "../ui/loading-animation"
import { useRouter } from "next/navigation"

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
  totalCommits: number
}

const COMMITS_PER_PAGE = 5

export function CommitManager({ fullName, totalCommits }: CommitManagerProps) {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchCommits() {
      setLoading(true)
      try {
        // Calculate the initial page number to get oldest commits
        // GitHub uses 30 commits per page by default
        const perPage = 30
        const initialPage = Math.ceil(totalCommits / perPage)

        const response = await fetch(`/api/github/commits/${fullName}?page=${initialPage}&per_page=${perPage}`)
        const data = await response.json()

        // Reverse the array since we want oldest first
        setCommits(data.reverse())
      } catch (error) {
        console.error("Failed to fetch commits:", error)
        setError("Failed to fetch commits")
      } finally {
        setLoading(false)
      }
    }

    fetchCommits()
  }, [fullName, totalCommits])

  const handleAction = async (commit: Commit, action: "new" | "existing" | "ignore") => {
    if (action === "new") {
      router.push(`${window.location.pathname}/thread/new?commit=${commit.sha}`)
    }
  }

  if (loading || totalCommits === 0) {
    return <LoadingAnimation />
  }

  if (error) return <div className="text-sm text-red-500">Error: {error}</div>
  if (commits.length === 0) return <div className="text-sm text-muted-foreground">No commits found</div>

  const pageStart = page * COMMITS_PER_PAGE
  const pageEnd = pageStart + COMMITS_PER_PAGE
  const currentPageCommits = commits.slice(pageStart, pageEnd)
  const totalPages = Math.ceil(totalCommits / COMMITS_PER_PAGE)

  return (
    <div className="space-y-6 border-t pt-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Commits</h2>
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
              <Button onClick={() => handleAction(commit, "ignore")} variant="ghost">
                Ignore
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
