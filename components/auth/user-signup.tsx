"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import { signInWithGitHub } from "./actions"

export function UserSignup() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Welcome to Code Threads!</CardTitle>
        <CardDescription>Document and share your coding journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          size="lg"
          className="w-full"
          onClick={async () => {
            console.log("Starting GitHub sign up...")
            try {
              const url = await signInWithGitHub()
              if (url) {
                window.location.href = url
              }
            } catch (error) {
              console.error("Failed to sign up:", error)
            }
          }}
        >
          <Github className="mr-2 h-5 w-5" />
          Continue with GitHub
        </Button>
      </CardContent>
    </Card>
  )
}
