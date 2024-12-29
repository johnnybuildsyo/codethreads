"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { LoadingAnimation } from "../ui/loading-animation"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

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
const COMMITS_PER_PAGE_LOAD = 30

export function CommitManager({ fullName, totalCommits }: CommitManagerProps) {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [loadedPages, setLoadedPages] = useState<number[]>([])

  const fetchCommitsForPage = async (pageNum: number, perPage: number = COMMITS_PER_PAGE_LOAD) => {
    try {
      const response = await fetch(`/api/github/commits/${fullName}?page=${pageNum}&per_page=${perPage}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Failed to fetch commits for page ${pageNum}:`, error)
      throw error
    }
  }

  // Initial load of oldest commits
  useEffect(() => {
    async function fetchInitialCommits() {
      setLoading(true)
      try {
        const perPage = COMMITS_PER_PAGE_LOAD
        const initialPage = Math.ceil(totalCommits / perPage)

        const data = await fetchCommitsForPage(initialPage)
        setCommits(data.reverse())
        setLoadedPages([initialPage])
      } catch (error) {
        console.error("Failed to fetch initial commits:", error)
        setError("Failed to fetch commits")
      } finally {
        setLoading(false)
      }
    }

    fetchInitialCommits()
  }, [fullName, totalCommits])

  // Load additional commits when needed
  useEffect(() => {
    async function loadMissingCommits() {
      const perPage = COMMITS_PER_PAGE_LOAD
      const totalPages = Math.ceil(totalCommits / perPage)
      const startIndex = page * COMMITS_PER_PAGE

      // Calculate which GitHub page we need based on the commit index from the end
      const commitsFromEnd = totalCommits - startIndex - COMMITS_PER_PAGE
      const githubPage = Math.floor(commitsFromEnd / perPage) + 1

      console.log(
        JSON.stringify(
          {
            startIndex,
            commitsFromEnd,
            githubPage,
            totalCommits,
            perPage,
            loadedPages,
            totalPages,
            calculation: {
              startIndexDivPerPage: startIndex / perPage,
              flooredStartIndex: Math.floor(startIndex / perPage),
            },
          },
          null,
          2
        )
      )

      if (!loadedPages.includes(githubPage) && !loading && githubPage > 0) {
        setLoading(true)
        try {
          const newCommits = await fetchCommitsForPage(githubPage)
          setCommits((current) => {
            const allCommits = [...current, ...newCommits]
            const uniqueCommits = Array.from(new Map(allCommits.map((c) => [c.sha, c])).values())
            return uniqueCommits.sort((a, b) => new Date(a.commit.author.date).getTime() - new Date(b.commit.author.date).getTime())
          })
          setLoadedPages((current) => [...current, githubPage])
        } catch (error) {
          console.error("Failed to load additional commits:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadMissingCommits()
  }, [page, loadedPages, loading, totalCommits, fullName])

  const handleAction = async (commit: Commit, action: "new" | "existing" | "ignore") => {
    if (action === "new") {
      router.push(`${window.location.pathname}/thread/new?commit=${commit.sha}`)
    }
  }

  if (error) return <div className="text-sm text-red-500">Error: {error}</div>

  const pageStart = page * COMMITS_PER_PAGE
  const pageEnd = pageStart + COMMITS_PER_PAGE
  const currentPageCommits = commits.slice(pageStart, pageEnd)
  const totalPages = Math.ceil(totalCommits / COMMITS_PER_PAGE)

  return (
    <div className="space-y-6 border-t pt-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Commits</h2>

        <div className={cn("flex items-center space-x-2 text-sm", commits.length === 0 && "opacity-0")}>
          <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Page {page + 1} of {totalPages}
            {loading && "..."}
          </span>
          <Button variant="ghost" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
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
              <Button asChild>
                <Link href={`${window.location.pathname}/thread/new?commit=${commit.sha}`}>
                  <Plus className="h-4 w-4" />
                  Start Thread
                </Link>
              </Button>
              <Button onClick={() => handleAction(commit, "ignore")} variant="ghost">
                Ignore
              </Button>
            </div>
          </div>
        ))}
        {(loading || totalCommits === 0 || commits.length === 0) && <LoadingAnimation />}
      </div>
    </div>
  )
}
