import { UserProfileCard } from "@/components/user-profile-card"
import { ProjectList } from "@/components/project-list"
import { UserSignup } from "@/components/user-signup"
import { ProjectImportContainer } from "@/components/project-import-container"
import Header from "@/components/header"
import { usersData } from "@/_mocks/users"
import { mockRepos } from "@/_mocks/repos"

interface UserPageProps {
  params: Promise<{
    username: string
  }>
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params
  const userData = usersData[username as keyof typeof usersData]
  const isExistingUser = Boolean(userData)
  const hasProjects = userData?.projects.length > 0

  if (!isExistingUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <UserSignup username={username} />
      </div>
    )
  }

  if (!hasProjects) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <ProjectImportContainer username={username} repos={mockRepos} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          <UserProfileCard name={userData.name} username={userData.username} avatar={userData.avatar} bio={userData.bio} github={userData.github} twitter={userData.twitter} />
          <ProjectList projects={userData.projects} username={userData.username} />
        </div>
      </main>
    </div>
  )
}
