"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import { signInWithGitHub } from "./actions"
import { useState } from "react"
import { LoadingAnimation } from "../ui/loading-animation"

export function UserSignup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Welcome to CodeThreads!</CardTitle>
        <CardDescription>Document and share your coding journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}
        {isLoading ? (
          <LoadingAnimation>Connecting to GitHub</LoadingAnimation>
        ) : (
          <Button
            size="lg"
            className="w-full"
            onClick={async () => {
              setIsLoading(true)
              console.log("Starting GitHub sign up...")
              try {
                const url = await signInWithGitHub()
                if (url) {
                  window.location.href = url
                }
              } catch (error) {
                console.error("Failed to sign up:", error)
                setError("Failed to sign up. Please try again.")
                setIsLoading(false)
              }
            }}
          >
            <Github className="mr-2 h-5 w-5" />
            Continue with GitHub
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
