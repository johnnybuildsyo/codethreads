import { UserProfileCard } from "@/components/user-profile-card"
import { ProjectList } from "@/components/project-list"
import { UserSignup } from "@/components/user-signup"
import { ProjectImportContainer } from "@/components/project-import-container"
import Header from "@/components/header"

// This would typically come from a database or API
const usersData = {
  sarahdev: {
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
  },
  johndev: {
    username: "johndev",
    name: "John Developer",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Building cool stuff with TypeScript and Next.js. Learning in public.",
    github: "johndev",
    twitter: "johndev",
    projects: [], // New user with no projects
  },
}

// Mock GitHub repos data
const mockRepos = [
  {
    id: 1234567,
    name: "awesome-project",
    description: "A React-based web application with modern tooling and best practices",
    stars: 12,
    forks: 3,
    language: "TypeScript",
    updated_at: "2024-03-15T10:30:00Z",
  },
  {
    id: 7654321,
    name: "api-service",
    description: "RESTful API service built with Node.js and Express",
    stars: 8,
    forks: 2,
    language: "JavaScript",
    updated_at: "2024-03-10T15:45:00Z",
  },
  // Add more repos as needed
]

export default function UserPage({ params }: { params: { username: string } }) {
  const userData = usersData[params.username as keyof typeof usersData]
  const isExistingUser = Boolean(userData)
  const hasProjects = userData?.projects.length > 0

  if (!isExistingUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <UserSignup username={params.username} />
      </div>
    )
  }

  if (!hasProjects) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <ProjectImportContainer username={params.username} repos={mockRepos} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <UserProfileCard name={userData.name} username={userData.username} avatar={userData.avatar} bio={userData.bio} github={userData.github} twitter={userData.twitter} />
          <ProjectList projects={userData.projects} username={userData.username} />
        </div>
      </main>
    </div>
  )
}
