import { ProjectCard } from "./project-card"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Project } from "@/types/github"

interface ProjectListProps {
  projects: Project[]
  username: string
  isCurrentUser?: boolean
}

export function ProjectList({ projects, username, isCurrentUser }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="md:col-span-2">
        <h3 className="pb-4 font-mono" id="projects">
          Projects
        </h3>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {isCurrentUser ? "Start documenting your coding journey by importing a GitHub repository." : `@${username} hasn't created any projects yet.`}
          </p>
          {isCurrentUser && (
            <Button asChild>
              <Link href="/import">
                <PlusCircle className="mr-2 h-4 w-4" />
                Import Project
              </Link>
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="md:col-span-2">
      <h3 className="pb-4 font-mono" id="projects">
        Projects
      </h3>
      <div className="flex flex-col space-y-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={{
              id: project.id,
              name: project.name,
              title: project.display_name,
              description: project.description || "",
              threadCount: 0,
              lastUpdated: project.updated_at,
            }}
            username={username}
          />
        ))}
      </div>
    </div>
  )
}
