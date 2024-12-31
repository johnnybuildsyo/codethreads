import { ProjectCard } from "./project-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ProjectWithCount {
  id: string
  name: string
  display_name: string
  description: string | null
  created_at: string
  updated_at: string
  logo_url?: string | null
  sessionCount: number
}

interface ProjectListProps {
  projects: ProjectWithCount[]
  username: string
  isCurrentUser: boolean
}

export function ProjectList({ projects, username, isCurrentUser }: ProjectListProps) {
  return (
    <div className="md:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        {isCurrentUser && (
          <Button asChild>
            <Link href="/projects/import">Import Project</Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} username={username} sessionCount={project.sessionCount} />
        ))}
      </div>
    </div>
  )
}
