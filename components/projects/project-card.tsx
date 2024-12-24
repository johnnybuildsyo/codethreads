import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  name: string
  description: string
  threadCount: number
  lastUpdated: string
  image?: string
}

interface ProjectCardProps {
  project: Project
  username: string
}

export function ProjectCard({ project, username }: ProjectCardProps) {
  return (
    <Link href={`/${username}/${project.name}`} className="block hover:no-underline group">
      <Card className="transition-all hover:shadow-md group-hover:border-primary">
        {project.image && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <img src={project.image} alt={project.title} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
          </div>
        )}
        <CardHeader>
          <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>{project.threadCount} threads</span>
            <span className="flex items-center space-x-1">
              <CalendarDays className="h-3 w-3" />
              <span>{project.lastUpdated}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
