"use client"

import { ProjectImport } from "./project-import"
import { useState, useEffect } from "react"
import type { GithubRepo } from "@/types/github"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LoadingAnimation } from "../ui/loading-animation"
interface ProjectImportContainerProps {
  username: string
}

interface GitHubApiResponse {
  id: number
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  homepage: string | null
}

export function ProjectImportContainer({ username }: ProjectImportContainerProps) {
  const router = useRouter()
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchRepos() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.provider_token) {
        setError("GitHub access token not found")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
          headers: {
            Authorization: `Bearer ${session.provider_token}`,
            Accept: "application/vnd.github.v3+json",
          },
        })

        if (!response.ok) throw new Error("Failed to fetch repositories")

        const data = await response.json()
        const mappedRepos: GithubRepo[] = data.map((repo: GitHubApiResponse) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description || "",
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          updated_at: repo.updated_at,
          homepage: repo.homepage,
        }))

        setRepos(mappedRepos)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch repositories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepos()
  }, [])

  const handleProjectSelect = async (repoId: number) => {
    setIsCreating(true)
    const supabase = createClient()

    try {
      const selectedRepo = repos.find((repo) => repo.id === repoId)
      if (!selectedRepo) throw new Error("Repository not found")

      // Get session and profile data
      const [
        {
          data: { session },
        },
        { data: profile },
      ] = await Promise.all([supabase.auth.getSession(), supabase.from("profiles").select("id").eq("username", username).single()])

      if (!session) throw new Error("Not authenticated")
      if (!profile) throw new Error("Profile not found")

      // Create project with profile_id
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          github_id: selectedRepo.id,
          name: selectedRepo.name,
          display_name: selectedRepo.name.replace(/-/g, " ").replace(/_/g, " "),
          full_name: `${session.user.user_metadata.user_name}/${selectedRepo.name}`,
          description: selectedRepo.description,
          homepage: selectedRepo.homepage,
          owner_id: session.user.id,
          profile_id: profile.id,
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Redirect to the new project page
      router.push(`/${username}/${project.name}`)
    } catch (error) {
      console.error("Failed to create project:", error)
      setError(error instanceof Error ? error.message : "Failed to create project")
      setIsCreating(false)
    }
  }

  if (isLoading) return <LoadingAnimation className="w-full text-center pt-24">Loading repositories</LoadingAnimation>
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>

  return <ProjectImport username={username} repos={repos} onProjectSelect={handleProjectSelect} isCreating={isCreating} />
}
