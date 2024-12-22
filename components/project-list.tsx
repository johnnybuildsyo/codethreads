import { ThreadCard } from "./thread-card"

interface Project {
  id: number
  title: string
  description: string
  threadCount: number
  lastUpdated: string
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
      <div>
        <div className="flex flex-col space-y-6">
          {projects.map((project) => (
            <ThreadCard
              key={project.id}
              thread={{
                id: project.id,
                title: project.title,
                date: project.lastUpdated,
                teaser: project.description,
              }}
              username={username}
              projectId={project.id.toString()}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
