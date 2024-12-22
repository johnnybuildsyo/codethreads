export interface ThreadPost {
  content: string
  timestamp: string
  commit?: {
    message: string
    diff: string
  }
}

export interface Thread {
  id: number
  title: string
  date: string
  teaser: string
  firstPost?: ThreadPost
}

export interface ThreadCardProps {
  thread: Thread
  username: string
  projectId: string
  featured?: boolean
} 