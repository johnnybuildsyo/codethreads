"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProjectImport } from "./project-import"
import type { GithubRepo } from "@/types/github"

interface ProjectImportContainerProps {
  username: string
  repos: GithubRepo[]
}

export function ProjectImportContainer({ username, repos }: ProjectImportContainerProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleProjectSelect = async (repoId: number) => {
    setIsCreating(true)

    // Mock API call to create project
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find the selected repo
      const selectedRepo = repos.find((repo) => repo.id === repoId)

      if (!selectedRepo) throw new Error("Repository not found")

      // Mock project creation payload
      const newProject = {
        id: repoId,
        title: selectedRepo.name,
        description: selectedRepo.description,
        threadCount: 0,
        lastUpdated: new Date().toISOString(),
      }

      // In a real app, this would be an API call to create the project
      console.log("Creating project:", newProject)

      // Redirect to the new project page
      router.push(`/${username}/${repoId}`)
    } catch (error) {
      console.error("Failed to create project:", error)
      // In a real app, we'd show an error message to the user
    } finally {
      setIsCreating(false)
    }
  }

  return <ProjectImport username={username} repos={repos} onProjectSelect={handleProjectSelect} isCreating={isCreating} />
}
