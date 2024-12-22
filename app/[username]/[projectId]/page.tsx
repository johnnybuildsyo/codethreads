import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

// This would typically come from a database or API
const projectData = {
  id: 1,
  title: "React Component Library",
  description: "A collection of reusable React components with Storybook integration.",
  threadCount: 15,
  lastUpdated: "2023-06-15",
  creator: {
    username: "sarahdev",
    name: "Sarah Developer",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  threads: [
    {
      id: 1,
      title: "🎨 Nailed it! Our new color system is a game-changer for accessibility",
      date: "2023-06-15",
      teaser: "Just pushed some major updates to our color system. You won't believe the impact on accessibility scores!",
    },
    {
      id: 2,
      title: "📚 Storybook integration complete - here's what I learned",
      date: "2023-06-10",
      teaser: "Finally got Storybook up and running smoothly. Here's a quick rundown of the challenges and wins.",
    },
    {
      id: 3,
      title: "🚀 New Button component: From basic to baller in 24 hours",
      date: "2023-06-05",
      teaser: "Started with a simple button, ended up with a flexible, accessible component. Here's how it evolved.",
    },
    {
      id: 4,
      title: "🏗️ Project kickoff: Setting up our React component library",
      date: "2023-06-01",
      teaser: "Day 1 of our new project! Here's how I set up the foundation for our React component library.",
    },
  ],
}

export default function ProjectPage({ params }: { params: { username: string; projectId: string } }) {
  const project = projectData // In a real app, fetch based on params.projectId
  const user = project.creator // In a real app, fetch based on params.username

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
        <div className="space-y-4">
          {project.threads.map((thread) => (
            <Link key={thread.id} href={`/${params.username}/${params.projectId}/thread/${thread.id}`} className="block hover:no-underline">
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{thread.title}</CardTitle>
                  <CardDescription className="text-sm flex items-center space-x-2">
                    <CalendarDays className="h-3 w-3" />
                    <span>{thread.date}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{thread.teaser}</p>
                  <p className="text-sm text-primary hover:underline">Read more...</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
