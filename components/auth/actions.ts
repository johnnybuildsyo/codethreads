"use client"

import { createClient } from "@/lib/supabase/client"

export async function signInWithGitHub(redirectPath?: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback${redirectPath ? `?redirect_path=${encodeURIComponent(redirectPath)}` : ""}`,
      scopes: "repo",
    },
  })

  if (error) {
    console.error("Error signing in with GitHub:", error)
    return null
  }

  return data.url
}
