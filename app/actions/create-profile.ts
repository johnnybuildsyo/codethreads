"use server"

import { createClient } from "@/lib/supabase/server"
import { RESERVED_USERNAMES } from "@/lib/constants/reserved-usernames"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProfile(username: string) {
  const supabase = await createClient()

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "Not authenticated" }
  }

  // Validate username
  if (!username.match(/^[a-z0-9_]+$/)) {
    return { error: "Username can only contain lowercase letters, numbers, and underscores" }
  }

  // Check against reserved usernames
  if (RESERVED_USERNAMES.includes(username as any)) {
    return { error: "This username is reserved" }
  }

  // Check if username is available
  const { data: existing } = await supabase.from("profiles").select("username").eq("username", username).single()

  if (existing) {
    return { error: "Username already taken" }
  }

  // Create profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: session.user.id,
    username,
    name: session.user.user_metadata.name,
    avatar_url: session.user.user_metadata.avatar_url,
    github_username: session.user.user_metadata.user_name,
  })

  if (profileError) {
    return { error: profileError.message }
  }

  revalidatePath("/")
  redirect(`/${username}`)
} 