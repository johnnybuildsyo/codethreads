import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const redirectPath = requestUrl.searchParams.get("redirect_path")

  if (code) {
    const supabase = await createClient()
    
    // Exchange the code for a session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error || !session) {
      return NextResponse.redirect(new URL("/login?error=auth", requestUrl.origin))
    }

    // Get GitHub user data from the session
    const githubUser = session.user.user_metadata

    // Check if user already exists in our database
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', session.user.id)
      .single()

    if (profile?.username) {
      // User already has a profile, redirect to their page or the specified path
      return NextResponse.redirect(new URL(redirectPath || `/${profile.username}`, requestUrl.origin))
    }

    // No profile yet, redirect to username selection with GitHub data
    const params = new URLSearchParams({
      name: githubUser.name || githubUser.user_name,
      avatar_url: githubUser.avatar_url,
      github_username: githubUser.user_name,
    })

    // Add the redirect path to the welcome page if it exists
    if (redirectPath) {
      params.append("redirect_path", redirectPath)
    }

    return NextResponse.redirect(new URL(`/welcome?${params.toString()}`, requestUrl.origin))
  }

  // If no code, redirect to home page
  return NextResponse.redirect(new URL("/", requestUrl.origin))
} 