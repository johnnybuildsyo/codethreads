import Header from "@/components/header"
import { ThreadCard } from "@/components/thread-card"

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
      firstPost: {
        content:
          "After a week of wrestling with configurations and custom webpack setups, I finally got our Storybook integration working smoothly! 📚✨ The components are now properly documented and we have a living style guide.",
        timestamp: "2023-06-10T15:20:00Z",
        commit: {
          message: "Add Storybook configuration and initial stories",
          diff: `diff --git a/.storybook/main.js b/.storybook/main.js
+module.exports = {
+  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
+  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
+  framework: '@storybook/react',
+  core: { builder: '@storybook/builder-webpack5' },
+};`,
        },
      },
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

interface ProjectPageProps {
  params: Promise<{
    username: string
    projectId: string
  }>
}

async function getProjectData(username: string, projectId: string) {
  // In a real app, this would be a database query
  // Simulating async data fetch
  await new Promise((resolve) => setTimeout(resolve, 100))
  return projectData
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { username, projectId } = await params
  const project = await getProjectData(username, projectId)
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
