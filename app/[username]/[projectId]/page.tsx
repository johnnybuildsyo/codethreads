import Header from "@/components/layout/header"
import { ThreadCard } from "@/components/threads/thread-card"
import { projectData } from "@/_mocks/projects"
import { User, Star, GitFork, Eye, GitCommit, Calendar } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProjectPageProps {
  params: Promise<{
    username: string
    projectId: string
  }>
}

async function getProjectData() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return projectData
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { username, projectId } = await params
  const project = await getProjectData()
  const user = project.creator

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <div className="flex items-center space-x-4 mb-6">
            <Link
              id="user-link"
              href={`/${username}`}
              className="group inline-flex items-center space-x-2 font-mono text-xs bg-foreground/5 px-2 py-1 rounded-md hover:bg-foreground/10 transition-colors"
            >
              <User className="h-3 w-3" />
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground group-hover:text-primary">@{user.username}</p>
            </Link>
            <TooltipProvider>
              <div className="flex items-center space-x-4 font-mono text-xs text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>{project.stats.stars.toLocaleString()}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{project.stats.stars.toLocaleString()} stars on GitHub</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-3 w-3" />
                      <span>{project.stats.forks.toLocaleString()}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{project.stats.forks.toLocaleString()} forks on GitHub</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{project.stats.watchers.toLocaleString()}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{project.stats.watchers.toLocaleString()} watching this repository</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1">
                      <GitCommit className="h-3 w-3" />
                      <span>{project.stats.commits.toLocaleString()}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{project.stats.commits.toLocaleString()} commits</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Project created on {new Date(project.createdAt).toLocaleDateString()}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="space-y-2">
          <ThreadCard thread={project.threads[0]} username={username} projectId={projectId} featured={true} />

          {project.threads.slice(1).map((thread) => (
            <ThreadCard key={thread.id} thread={thread} username={username} projectId={projectId} />
          ))}
        </div>
      </main>
    </div>
  )
}
