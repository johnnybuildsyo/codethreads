import Header from "@/components/layout/header"
import { User, Star, GitFork, Eye, GitCommit, Calendar } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CommitManager } from "@/components/projects/commit-manager"
import { ProjectNameEditor } from "@/components/projects/project-name-editor"
import type { Database } from "@/lib/supabase/database.types"

interface ProjectPageProps {
  params: {
    username: string
    projectId: string
  }
}

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  display_name: string | null
}

type ProjectWithProfile = Project & {
  profiles: {
    name: string | null
    username: string
    avatar_url: string | null
  }
}

async function getGitHubStats(fullRepoName: string, token: string) {
  const [owner, repo] = fullRepoName.split("/")

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  })
  if (!response.ok) return null
  const data = await response.json()

  // Get commit count using the repository's default branch
  const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1&sha=${data.default_branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  })
  const linkHeader = commitsResponse.headers.get("link")
  const commitCount = linkHeader ? parseInt(linkHeader.match(/page=(\d+)>; rel="last"/)?.[1] || "0") : 0

  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    watchers: data.watchers_count,
    commits: commitCount,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { username, projectId } = params
  const supabase = await createClient()

  const [
    { data: project },
    {
      data: { session },
    },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select(
        `
        *,
        profiles!inner (
          name,
          username,
          avatar_url
        )
      `
      )
      .eq("name", projectId)
      .eq("profiles.username", username)
      .single(),
    supabase.auth.getSession(),
  ])

  if (!project) notFound()

  const stats = session?.provider_token && project.full_name ? await getGitHubStats(project.full_name, session.provider_token) : null

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <ProjectNameEditor projectId={project.id} initialName={project.display_name || project.name} className="mb-2" />
          <div className="flex items-center space-x-4 mb-6">
            <Link href={`/${username}`} className="group inline-flex items-center space-x-2 font-mono text-xs bg-foreground/5 px-2 py-1 rounded-md hover:bg-foreground/10 transition-colors">
              <User className="h-3 w-3" />
              <p className="font-medium">{project.profiles.name}</p>
              <p className="text-muted-foreground group-hover:text-primary">@{project.profiles.username}</p>
            </Link>
            <TooltipProvider>
              <div className="flex items-center space-x-4 font-mono text-xs text-muted-foreground">
                {stats && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>{stats.stars.toLocaleString()}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{stats.stars.toLocaleString()} stars on GitHub</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <GitFork className="h-3 w-3" />
                          <span>{stats.forks.toLocaleString()}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{stats.forks.toLocaleString()} forks on GitHub</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{stats.watchers.toLocaleString()}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{stats.watchers.toLocaleString()} watching this repository</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <GitCommit className="h-3 w-3" />
                          <span>{stats.commits.toLocaleString()}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{stats.commits.toLocaleString()} commits</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Project created on {new Date(project.created_at).toLocaleDateString()}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
          <div className="mt-4">
            <CommitManager projectId={project.id} fullName={project.full_name} />
          </div>
        </div>
        {/* Thread list will be added later */}
      </main>
    </div>
  )
}
