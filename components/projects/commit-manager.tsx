"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { LoadingAnimation } from "../ui/loading-animation"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { createSession } from "@/app/actions/create-session"

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

export function CommitManager({ projectId, fullName, totalCommits }: CommitManagerProps) {
  const [commits, setCommits] = useState<Commit[]>([])
  const [filteredCommits, setFilteredCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [loadedPages, setLoadedPages] = useState<number[]>([])
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [creatingSession, setCreatingSession] = useState<string | null>(null)
  const router = useRouter()

  // Update filteredCommits whenever commits change
  useEffect(() => {
    if (!isSearching) {
      setFilteredCommits(commits)
    }
  }, [commits, isSearching])

  const fetchCommitsForPage = async (pageNum: number, perPage: number = COMMITS_PER_PAGE_LOAD) => {
    try {
      const response = await fetch(`/api/github/commits/${fullName}?page=${pageNum}&per_page=${perPage}`)
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error(`Failed to fetch commits for page ${pageNum}:`, error)
      throw error
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false)
      setFilteredCommits(commits)
      setPage(0)
      return
    }

    setIsSearching(true)
    setLoading(true)
    try {
      // Filter commits locally based on search query
      const searchTerm = searchQuery.toLowerCase()
      const results = commits.filter((commit) => {
        const message = commit.commit.message.toLowerCase()
        const sha = commit.sha.toLowerCase()
        const author = commit.commit.author.name.toLowerCase()
        return message.includes(searchTerm) || sha.includes(searchTerm) || author.includes(searchTerm)
      })

      setFilteredCommits(
        results.sort((a, b) => {
          const dateA = new Date(a.commit.author.date).getTime()
          const dateB = new Date(b.commit.author.date).getTime()
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA
        })
      )
      setPage(0)
    } catch (error) {
      console.error("Failed to search commits:", error)
      setError("Failed to search commits")
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (value: "asc" | "desc") => {
    setSortOrder(value)
    if (searchQuery.trim()) {
      // If there's an active search, reapply it with the new sort order
      const searchTerm = searchQuery.toLowerCase()
      const results = commits.filter((commit) => {
        const message = commit.commit.message.toLowerCase()
        const sha = commit.sha.toLowerCase()
        const author = commit.commit.author.name.toLowerCase()
        return message.includes(searchTerm) || sha.includes(searchTerm) || author.includes(searchTerm)
      })

      setFilteredCommits(
        results.sort((a, b) => {
          const dateA = new Date(a.commit.author.date).getTime()
          const dateB = new Date(b.commit.author.date).getTime()
          return value === "asc" ? dateA - dateB : dateB - dateA
        })
      )
    }
  }

  // Initial load of commits
  useEffect(() => {
    async function fetchInitialCommits() {
      setLoading(true)
      try {
        const perPage = COMMITS_PER_PAGE_LOAD
        const initialPage = sortOrder === "desc" ? 1 : Math.ceil(totalCommits / perPage)

        const data = await fetchCommitsForPage(initialPage)
        const sortedData = sortOrder === "desc" ? data : data.reverse()
        setCommits(sortedData)
        setFilteredCommits(sortedData)
        setLoadedPages([initialPage])
        setPage(0)
      } catch (error) {
        console.error("Failed to fetch initial commits:", error)
        setError("Failed to fetch commits")
      } finally {
        setLoading(false)
      }
    }

    setLoadedPages([])
    fetchInitialCommits()
  }, [fullName, totalCommits, sortOrder])

  // Load additional commits when needed
  useEffect(() => {
    if (isSearching) return // Don't load more commits while searching

    async function loadMissingCommits() {
      const perPage = COMMITS_PER_PAGE_LOAD
      const totalPages = Math.ceil(totalCommits / perPage)
      const startIndex = page * COMMITS_PER_PAGE

      // Calculate which GitHub page we need based on sort order
      let githubPage
      if (sortOrder === "desc") {
        githubPage = Math.floor(startIndex / perPage) + 1
      } else {
        const commitsFromEnd = totalCommits - startIndex - COMMITS_PER_PAGE
        githubPage = Math.floor(commitsFromEnd / perPage) + 1
      }

      if (!loadedPages.includes(githubPage) && !loading && githubPage > 0 && githubPage <= totalPages) {
        setLoading(true)
        try {
          const newCommits = await fetchCommitsForPage(githubPage)
          setCommits((current) => {
            const allCommits = [...current, ...newCommits]
            const uniqueCommits = Array.from(new Map(allCommits.map((c) => [c.sha, c])).values())
            const sortedCommits = uniqueCommits.sort((a, b) => {
              const dateA = new Date(a.commit.author.date).getTime()
              const dateB = new Date(b.commit.author.date).getTime()
              return sortOrder === "asc" ? dateA - dateB : dateB - dateA
            })
            setFilteredCommits(sortedCommits)
            return sortedCommits
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
  }, [page, loadedPages, loading, totalCommits, fullName, sortOrder, isSearching])

  const handleAction = async (commit: Commit, action: "new" | "existing" | "ignore") => {
    if (action === "new") {
      router.push(`${window.location.pathname}/session/new?commit=${commit.sha}`)
    }
  }

  const handleStartSession = async (commit: Commit) => {
    setCreatingSession(commit.sha)
    try {
      const { session, error } = await createSession(projectId, commit.sha, commit.commit.message)

      if (error || !session) {
        throw new Error(error || "Failed to create session")
      }

      router.push(`${window.location.pathname}/session/${session.id}/edit`)
    } catch (error) {
      console.error("Failed to create session:", error)
      setError(error instanceof Error ? error.message : "Failed to create session")
      setCreatingSession(null)
    }
  }

  if (error) return <div className="text-sm text-red-500">Error: {error}</div>

  const pageStart = page * COMMITS_PER_PAGE
  const pageEnd = pageStart + COMMITS_PER_PAGE
  const currentPageCommits = filteredCommits.slice(pageStart, pageEnd)
  const totalPages = Math.ceil(filteredCommits.length / COMMITS_PER_PAGE)

  return (
    <div className="space-y-6 border-t pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="font-medium">Start Session from a Commit</h2>
          <div className="flex items-center space-x-2">
            <div className="relative flex">
              <div className="relative flex focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search commits..."
                  className="pl-8 w-[200px] rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                />
                <Button variant="secondary" className="rounded-l-none h-9 border border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0" onClick={handleSearch} disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
            <Select value={sortOrder} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Latest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
              <Button onClick={() => handleStartSession(commit)} disabled={creatingSession === commit.sha}>
                {creatingSession === commit.sha ? "Creating..." : "Start Session"}
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
