"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitFork, Star, ArrowRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { GithubRepo } from "@/types/github"

interface ProjectImportProps {
  username: string
  repos: GithubRepo[]
  onProjectSelect: (repoId: number) => void
  isCreating: boolean
}

export function ProjectImport({ repos, onProjectSelect, isCreating = false }: ProjectImportProps) {
  const [selectedRepo, setSelectedRepo] = useState<number | null>(null)

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Import Your First Project</CardTitle>
          <CardDescription className="text-lg mt-2">Select a GitHub repository to start your first Code Thread</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup className="space-y-4" onValueChange={(value) => setSelectedRepo(Number(value))} disabled={isCreating}>
            {repos.map((repo) => (
              <div key={repo.id} className="flex items-start space-x-3">
                <RadioGroupItem value={repo.id.toString()} id={repo.id.toString()} className="mt-1" />
                <Label htmlFor={repo.id.toString()} className="flex-1 cursor-pointer">
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
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex justify-end">
            <Button size="lg" disabled={!selectedRepo || isCreating} onClick={() => selectedRepo && onProjectSelect(selectedRepo)}>
              {isCreating ? (
                <>
                  <span className="animate-pulse">Creating Thread...</span>
                </>
              ) : (
                <>
                  Start Code Thread
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
