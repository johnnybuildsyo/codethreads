import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Twitter } from "lucide-react"
import Link from "next/link"

interface UserProfileProps {
  name: string
  username: string
  avatar: string
  bio: string
  github: string
  twitter: string
}

export function UserProfileCard({ name, username, avatar, bio, github, twitter }: UserProfileProps) {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>@{username}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{bio}</p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`https://github.com/${github}`}>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`https://twitter.com/${twitter}`}>
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
