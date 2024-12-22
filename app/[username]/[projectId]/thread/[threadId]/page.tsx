import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Header from "@/components/header"
import { threadData } from "@/_mocks/threads"

interface ThreadPageProps {
  params: Promise<{
    username: string
    projectId: string
    threadId: string
  }>
}

async function getThreadData() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return threadData
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { username, projectId, threadId } = await params
  const thread = await getThreadData()
  const user = thread.creator // In a real app, fetch based on params.username

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{thread.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 mb-6 font-mono text-xs">
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground">@{user.username}</p>
              <span>{thread.date}</span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {thread.posts.map((post, index) => (
            <Card key={post.id}>
              <CardHeader>
                <CardDescription>{new Date(post.timestamp).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{post.content}</p>
                {post.commit && (
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-semibold mb-2">Commit: {post.commit.message}</h3>
                    <pre className="text-sm overflow-x-auto">
                      <code dangerouslySetInnerHTML={{ __html: post.commit.diff }} />
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Thread
          </Button>
          <Button variant="outline" size="sm">
            Next Thread <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
