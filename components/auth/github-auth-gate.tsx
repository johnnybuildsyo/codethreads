import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { signInWithGitHub } from "@/components/auth/actions"

interface GitHubAuthGateProps {
  message?: string
}

export function GitHubAuthGate({ message = "Please sign in with GitHub to continue" }: GitHubAuthGateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] gap-4 bg-foreground/5 p-4 rounded-lg">
      <p className="text-muted-foreground">{message}</p>
      <Button
        onClick={async () => {
          const url = await signInWithGitHub()
          if (url) window.location.href = url
        }}
      >
        <Github className="w-4 h-4 mr-2" />
        Connect GitHub
      </Button>
    </div>
  )
}
