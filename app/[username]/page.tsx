import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Twitter } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

// This would typically come from a database or API
const userData = {
  username: "sarahdev",
  name: "Sarah Developer",
  avatar: "/placeholder.svg?height=100&width=100",
  bio: "Full-stack developer passionate about React and Node.js. Building in public and sharing my journey on Code Threads.",
  github: "sarahdev",
  twitter: "sarahdev",
  projects: [
    {
      id: 1,
      title: "React Component Library",
      description: "A collection of reusable React components with Storybook integration.",
      threadCount: 15,
      lastUpdated: "2023-06-15",
    },
    {
      id: 2,
      title: "Node.js API Boilerplate",
      description: "A starter template for building scalable Node.js APIs with Express and MongoDB.",
      threadCount: 8,
      lastUpdated: "2023-05-22",
    },
    {
      id: 3,
      title: "Vue.js Todo App",
      description: "A simple but feature-rich todo application built with Vue.js and Vuex.",
      threadCount: 5,
      lastUpdated: "2023-04-10",
    },
  ],
}

export default function UserPage({ params }: { params: { username: string } }) {
  // In a real application, you would fetch the user data based on the username parameter
  const user = userData

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>@{user.username}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{user.bio}</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`https://github.com/${user.github}`}>
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`https://twitter.com/${user.twitter}`}>
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="md:col-span-2">
            <h3 className="pb-4 font-mono" id="projects">
              Projects
            </h3>
            <div>
              <div className="flex flex-col space-y-6">
                {user.projects.map((project) => (
                  <Link key={project.id} href={`/${user.username}/${project.id}`}>
                    <Card className="transition-colors hover:bg-muted/50">
                      <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-xs text-muted-foreground font-mono">
                          <span>{project.threadCount} threads</span>
                          <span>{project.lastUpdated}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
