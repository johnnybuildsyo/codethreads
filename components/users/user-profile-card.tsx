import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Twitter, Pencil } from "lucide-react"
import Link from "next/link"

interface UserProfileCardProps {
  name: string | null
  username: string
  avatar: string | null
  bio: string | null
  github: string | null
  twitter: string | null
  isCurrentUser?: boolean
}

export function UserProfileCard({ name, username, avatar, bio, github, twitter, isCurrentUser }: UserProfileCardProps) {
  return (
    <Card className="md:col-span-1">
      <CardHeader className="relative">
        {isCurrentUser && (
          <Link className="absolute top-2 right-2 text-xs flex items-center gap-1 px-2 py-1 rounded-md hover:ring-1 hover:ring-foreground/10" href={`/${username}/edit`}>
            <span>edit</span>
            <Pencil className="h-3 w-3 scale-75" />
          </Link>
        )}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatar || undefined} alt={name || undefined} />
            <AvatarFallback>
              {name
                ?.split(" ")
                .map((n) => n?.[0])
                .join("") || username[0].toUpperCase()}
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
