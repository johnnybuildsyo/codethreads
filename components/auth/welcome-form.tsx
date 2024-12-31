"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProfile } from "@/app/actions/create-profile"
import { useSearchParams } from "next/navigation"

export function WelcomeForm() {
  const searchParams = useSearchParams()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const githubUsername = searchParams.get("github_username")
    console.log("Initial GitHub username from URL:", githubUsername)
    if (githubUsername) {
      const formattedUsername = githubUsername.toLowerCase().replace(/[^a-z0-9_]/g, "")
      console.log("Setting formatted username:", formattedUsername)
      setUsername(formattedUsername)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with username:", username)
    setIsLoading(true)
    setError("")

    console.log("Calling createProfile...")
    const result = await createProfile(username)
    console.log("createProfile result:", result)
    if (result?.error) {
      console.log("Setting error:", result.error)
      setError(result.error)
      setIsLoading(false)
    } else {
      console.log("Profile creation successful, waiting for redirect...")
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
