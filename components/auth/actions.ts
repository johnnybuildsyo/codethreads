"use server"

import { createClient } from "@/lib/supabase/server"

export async function signInWithGitHub() {
  console.log("Server: Starting GitHub OAuth...")
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        scopes: 'read:user',
      },
    })

    if (error) {
      console.error("Server: GitHub OAuth Error:", error)
      throw error
    }

    console.log("Server: OAuth response:", JSON.stringify(data, null, 2))
    return data.url
  } catch (error) {
    console.error("Server: Unexpected error:", error)
    throw error
  }
}
