import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import Link from "next/link"

interface UserSignupProps {
  username: string
}

export function UserSignup({ username }: UserSignupProps) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Welcome to Code Threads!</CardTitle>
          <CardDescription className="text-lg mt-2">
            The username <span className="font-mono">@{username}</span> is available
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            Code Threads lets you document and share your coding journey through project threads. Sign up to claim your username and start building in public.
          </p>
          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}>
                <Github className="mr-2 h-5 w-5" />
                Sign up with GitHub
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
