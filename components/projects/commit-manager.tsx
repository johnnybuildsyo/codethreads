"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { GitHubAuthGate } from "../auth/github-auth-gate"
import { LoadingAnimation } from "../ui/loading-animation"
import { useRouter } from "next/navigation"
import { Session } from "@supabase/supabase-js"

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
  fullName: string
  isOwner: boolean
}

const COMMITS_PER_PAGE = 5

export function CommitManager({ fullName, isOwner }: CommitManagerProps) {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    fetchCommits()
  }, [fullName])

  const handleAction = async (commit: Commit, action: "new" | "existing" | "ignore") => {
    if (action === "new") {
      router.push(`${window.location.pathname}/thread/new?commit=${commit.sha}`)
    }
  }

  const fetchCommits = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.provider_token) {
        setLoading(false)
        return
      }

      const response = await fetch(`/api/github/commits/${fullName}?page=1&per_page=100&sort=created&direction=asc`, {
        headers: {
          Authorization: `Bearer ${session.provider_token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch commits: ${response.statusText}`)
      }

      const data = await response.json()
      if (Array.isArray(data)) {
        const sortedCommits = [...data].sort((a, b) => new Date(a.commit.author.date).getTime() - new Date(b.commit.author.date).getTime())
        setCommits(sortedCommits)
      } else {
        console.error("Unexpected response format:", data)
        setError("Received invalid data format from server")
      }
    } catch (error) {
      console.error("Error fetching commits:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch commits")
    } finally {
      setLoading(false)
    }
  }

  if (!session) return null

  if (loading) {
    return <LoadingAnimation />
  }

  if (!session.provider_token && isOwner) {
    return <GitHubAuthGate />
  }

  if (!session.provider_token) return null

  if (error) return <div className="text-sm text-red-500">Error: {error}</div>
  if (commits.length === 0) return <div className="text-sm text-muted-foreground">No commits found</div>

  const pageStart = page * COMMITS_PER_PAGE
  const pageEnd = pageStart + COMMITS_PER_PAGE
  const currentPageCommits = commits.slice(pageStart, pageEnd)
  const totalPages = Math.ceil(commits.length / COMMITS_PER_PAGE)

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
      <p className="text-sm text-muted-foreground">{commits.length} unprocessed commits</p>
    </div>
  )
}
