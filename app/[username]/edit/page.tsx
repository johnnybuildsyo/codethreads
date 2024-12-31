import Header from "@/components/layout/header"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { EditProfileForm, Link } from "@/components/users/edit-profile-form"

interface EditProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export default async function EditProfilePage({ params }: EditProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get profile from database
  const profile = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single()
    .then(({ data }) => (data ? { ...data, links: JSON.parse(data.links as string) as Link[] } : null))

  if (!profile) {
    notFound()
  }

  // Redirect if not the profile owner
  if (session?.user?.id !== profile.id) {
    redirect(`/${username}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-xl">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        <EditProfileForm profile={profile} />
      </main>
    </div>
  )
}
