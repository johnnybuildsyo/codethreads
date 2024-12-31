"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export async function getAuthUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null
  
  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, id, avatar_url, bio, created_at, github_username, links, name, twitter_username, updated_at")
      .eq("id", user.id)
      .single()
    profile = data
  }
  
  return { user, profile }
} 