"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { signInWithGitHub } from "@/components/auth/actions"
import { LoadingAnimation } from "../ui/loading-animation"

interface GitHubAuthGateProps {
  message?: string
}

export function GitHubAuthGate({ message = "Please sign in with GitHub to continue" }: GitHubAuthGateProps) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] gap-4 bg-foreground/5 p-4 rounded-lg">
      <p className="text-muted-foreground">{message}</p>
      {isLoading && <LoadingAnimation />}
      <Button
        onClick={async () => {
          setIsLoading(true)
          const url = await signInWithGitHub()
          if (url) window.location.href = url
          setIsLoading(false)
        }}
        className={isLoading ? "hidden" : ""}
      >
        <Github className="w-4 h-4 mr-2" />
        Connect GitHub
      </Button>
    </div>
  )
}
