import { FileChange } from "@/components/threads/editor/types"
import { User } from "@supabase/supabase-js"
import { ThreadSection } from "@/components/threads/editor/types"

export interface ThreadPost {
  id: number
  content: string
  timestamp: string
  commit?: {
    message: string
    diff: string
    files?: FileChange[]
  }
}

export interface Thread {
  id: string
  title: string
  sections: ThreadSection[]
  commit_shas: string[]
  published_at: string | null
  created_at: string
  updated_at: string
  project_id: string
  user_id: string
}

export interface ThreadCardProps {
  thread: Thread
  username: string
  projectId: string
  featured?: boolean
  currentUser?: User | null
} 