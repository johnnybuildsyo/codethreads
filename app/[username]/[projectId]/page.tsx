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
      firstPost: {
        content:
          "Just pushed a major update to our color system, and I'm thrilled with the results! 🎉 Our accessibility scores have skyrocketed, and the components look better than ever. Here's a quick rundown of what changed:",
        timestamp: "2023-06-15T10:30:00Z",
        commit: {
          message: "Implement new color system for improved accessibility",
          diff: `diff --git a/src/styles/colors.ts b/src/styles/colors.ts
@@ -1,10 +1,10 @@
 export const colors = {
-  primary: '#3498db',
-  secondary: '#2ecc71',
-  text: '#333333',
-  background: '#ffffff',
+  primary: '#0056b3',
+  secondary: '#28a745',
+  text: '#212529',
+  background: '#f8f9fa',
 };`,
        },
      },
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
  const project = projectData
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
        <Link href={`/${params.username}/${params.projectId}/thread/${featuredThread.id}`} className="block mb-8">
          <Card className="transition-shadow hover:shadow-md border-2">
            <CardHeader>
              <CardTitle className="text-2xl">{featuredThread.title}</CardTitle>
              <CardDescription className="text-sm flex items-center space-x-2">
                <CalendarDays className="h-3 w-3" />
                <span>{featuredThread.date}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground mb-6">{featuredThread.firstPost.content}</p>
              {featuredThread.firstPost.commit && (
                <div className="bg-muted rounded-md mb-6 overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 border-b">
                    <h3 className="font-mono text-sm">
                      <span className="text-muted-foreground">Commit:</span> {featuredThread.firstPost.commit.message}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <pre className="text-xs leading-relaxed">
                      <code className="block p-4">
                        {featuredThread.firstPost.commit.diff.split("\n").map((line, i) => {
                          let lineClass = "block"
                          if (line.startsWith("+")) {
                            lineClass += " bg-green-500/10 text-green-700"
                          } else if (line.startsWith("-")) {
                            lineClass += " bg-red-500/10 text-red-700"
                          } else if (line.startsWith("@")) {
                            lineClass += " bg-blue-500/10 text-blue-700"
                          }
                          return (
                            <span key={i} className={lineClass}>
                              {line}
                            </span>
                          )
                        })}
                      </code>
                    </pre>
                  </div>
                </div>
              )}
              <p className="text-sm text-primary hover:underline">Read full thread →</p>
            </CardContent>
          </Card>
        </Link>

        {/* Other Threads */}
        <div className="space-y-4">
          {otherThreads.map((thread) => (
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
