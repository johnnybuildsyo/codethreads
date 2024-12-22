import Header from "@/components/header"
import { ThreadCard } from "@/components/thread-card"
import { projectData } from "@/_mocks/projects"
import { User } from "lucide-react"
import Link from "next/link"

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
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <Link href={`/${username}`} className="group inline-flex items-center space-x-2 mb-6 font-mono text-xs bg-foreground/5 px-2 py-1 rounded-md hover:bg-foreground/10 transition-colors">
            <User className="h-3 w-3" />
            <p className="font-medium">{user.name}</p>
            <p className="text-muted-foreground group-hover:text-primary">@{user.username}</p>
          </Link>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="space-y-6">
          <ThreadCard thread={project.threads[0]} username={username} projectId={projectId} featured={true} />

          {project.threads.slice(1).map((thread) => (
            <ThreadCard key={thread.id} thread={thread} username={username} projectId={projectId} />
          ))}
        </div>
      </main>
    </div>
  )
}
