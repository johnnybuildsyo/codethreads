"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitFork, Star, ArrowRight } from "lucide-react"
import type { GithubRepo } from "@/types/github"
import { LoadingAnimation } from "../ui/loading-animation"

interface ProjectImportProps {
  username: string
  repos: GithubRepo[]
  onProjectSelect: (repoId: number) => void
  isCreating: boolean
}

export function ProjectImport({ repos, onProjectSelect, isCreating }: ProjectImportProps) {
  const [selectedRepo, setSelectedRepo] = useState<number | null>(null)

  const selectedRepoData = selectedRepo ? repos.find((repo) => repo.id === selectedRepo) : null

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Import Your First Project</CardTitle>
          <CardDescription className="text-lg mt-2">{selectedRepo ? "Create your first Code Thread" : "Select a GitHub repository to start your first Code Thread"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {(selectedRepo ? [selectedRepoData] : repos).map(
              (repo) =>
                repo && (
                  <div key={repo.id} className="cursor-pointer" onClick={() => setSelectedRepo(repo.id)}>
                    <Card className={`transition-colors hover:bg-muted/50 ${selectedRepo === repo.id ? "border-primary" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{repo.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              {repo.stars}
                            </span>
                            <span className="flex items-center">
                              <GitFork className="h-4 w-4 mr-1" />
                              {repo.forks}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 text-xs">
                          <span className="text-muted-foreground">Last updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                          <span className="font-mono">{repo.language}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
            )}
          </div>
          {isCreating ? (
            <LoadingAnimation className="w-full text-right text-sm p-2">Importing Project</LoadingAnimation>
          ) : (
            <div className="flex justify-end space-x-4">
              {selectedRepo && (
                <Button variant="ghost" onClick={() => setSelectedRepo(null)}>
                  Go Back
                </Button>
              )}
              <Button size="lg" disabled={!selectedRepo || isCreating} onClick={() => selectedRepo && onProjectSelect(selectedRepo)}>
                Import Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
