import Header from "@/components/layout/header"
import { ProjectImportContainer } from "@/components/projects/project-import-container"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ImportProjectPage() {
  const supabase = await createClient()

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/signin")
  }

  const username = session.user.user_metadata.preferred_username

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Import Project</h1>
            <p className="text-muted-foreground">Select a GitHub repository to start documenting your progress</p>
          </div>
          <ProjectImportContainer username={username} />
        </div>
      </main>
    </div>
  )
}
