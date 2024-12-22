export interface ThreadPost {
  id: number
  content: string
  timestamp: string
  commit: {
    message: string
    diff: string
  }
}

export interface Thread {
  id: number
  title: string
  date: string
  teaser: string
  posts: ThreadPost[]
}

export interface ThreadCardProps {
  thread: Thread
  username: string
  projectId: string
  featured?: boolean
} 