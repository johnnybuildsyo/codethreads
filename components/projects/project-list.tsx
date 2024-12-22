import { ProjectCard } from "./project-card"

interface Project {
  id: number
  title: string
  description: string
  threadCount: number
  lastUpdated: string
  image?: string
}

interface ProjectListProps {
  projects: Project[]
  username: string
}

export function ProjectList({ projects, username }: ProjectListProps) {
  return (
    <div className="md:col-span-2">
      <h3 className="pb-4 font-mono" id="projects">
        Projects
      </h3>
      <div className="flex flex-col space-y-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} username={username} />
        ))}
      </div>
    </div>
  )
}
