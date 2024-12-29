import Header from "@/components/layout/header"
import { User, Star, GitFork, Eye, GitCommit, Calendar, Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CommitManager } from "@/components/projects/commit-manager"
import { ProjectNameEditor } from "@/components/projects/project-name-editor"
import { GitHubAuthGate } from "@/components/auth/github-auth-gate"
import { ThreadList } from "@/components/threads/thread-list"

interface ProjectPageProps {
  params: Promise<{
    username: string
    projectId: string
  }>
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
  const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
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
  const { username, projectId } = await params
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

  const isOwner = session?.user?.id === project.owner_id

  // Get threads for this project
  const { data: threads } = await supabase.from("threads").select("*, commit_shas").eq("project_id", project.id).order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <ProjectNameEditor projectId={project.id} initialName={project.display_name || project.name} className="mb-2" />
          <div className="flex items-center space-x-4 mb-6">
            <Link href={`/${username}`} className="group inline-flex items-center space-x-2 font-mono text-xs border px-2 py-1 rounded-md hover:bg-foreground/5 transition-colors">
              <User className="h-3 w-3" />
              <p className="font-medium">{project.profiles.name}</p>
            </Link>
            <Link
              href={`https://github.com/${project.full_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 font-mono text-xs bg-foreground/5 px-2 py-1 rounded-md hover:bg-foreground/10 transition-colors"
            >
              <Github className="h-3 w-3" />
              <span>{project.full_name}</span>
              <ExternalLink className="h-3 w-3" />
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
          <div className="md:col-span-3 mt-8">
            <ThreadList threads={threads || []} username={username} projectId={projectId} currentUser={session?.user} />
          </div>
          <div className="grid gap-8 md:grid-cols-3 mt-8">
            {isOwner && (
              <div className="md:col-span-3">
                {session.provider_token ? (
                  <CommitManager projectId={project.id} fullName={project.full_name} totalCommits={stats?.commits || 0} />
                ) : (
                  <GitHubAuthGate>Please sign in with GitHub to load commits</GitHubAuthGate>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
