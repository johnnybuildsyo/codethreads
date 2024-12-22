import Header from "@/components/header"
import { ThreadCard } from "@/components/thread-card"
import { projectData } from "@/_mocks/projects"

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
  const [featuredThread, ...otherThreads] = project.threads

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <div className="flex items-center space-x-4 mb-6 font-mono text-xs">
            <p className="font-medium">{user.name}</p>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="space-y-6">
          <ThreadCard thread={featuredThread} username={username} projectId={projectId} featured={true} />

          {otherThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} username={username} projectId={projectId} />
          ))}
        </div>
      </main>
    </div>
  )
}
