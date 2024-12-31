"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProfile } from "@/app/actions/create-profile"

export function WelcomeForm() {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      // Set initial username from GitHub
      if (session?.user?.user_metadata.preferred_username) {
        setUsername(session.user.user_metadata.preferred_username.toLowerCase().replace(/[^a-z0-9_]/g, ""))
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await createProfile(username)
      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Failed to create profile:", error)
      setError("Failed to create profile")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-2xl text-center block w-full py-4 font-extrabold">
          Choose your username
        </Label>
        <div className="flex items-center gap-2">
          <div>codecook.live/</div>
          <Input
            id="username"
            placeholder="username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value.toLowerCase())}
            pattern="^[a-z0-9_]+$"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">Only lowercase letters, numbers, and underscores</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Profile..." : "Continue »"}
      </Button>
    </form>
  )
}
