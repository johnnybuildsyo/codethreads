"use client"

import { ProjectImport } from "./project-import"
import type { GithubRepo } from "@/types/github"

interface ProjectImportContainerProps {
  username: string
  repos: GithubRepo[]
}

export function ProjectImportContainer({ username, repos }: ProjectImportContainerProps) {
  const handleProjectSelect = (repoId: number) => {
    // Handle project selection
    console.log("Selected repo:", repoId)
  }

  return <ProjectImport username={username} repos={repos} onProjectSelect={handleProjectSelect} />
}
