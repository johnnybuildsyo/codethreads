"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function Hero() {
  const [profile, setProfile] = useState<{ username: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("username").eq("id", session.user.id).single()
        setProfile(data)
      }
    })
  }, [])

  return (
    <section className="py-20 px-6 text-center">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl text-balance">The Publishing Platform for Live Coding</h1>
        <p className="mt-4 text-xl text-muted-foreground text-balance">
          CodeThreads is your platform for building your projects in the open where your commits become posts. Grow your audience while you grow your skills as a developer.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          {profile ? (
            <Link href={`/${profile.username}`}>
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
