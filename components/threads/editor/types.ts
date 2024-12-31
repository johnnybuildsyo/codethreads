export type CommitLink = {
  filename: string
  sha: string
}

export interface FileChange {
  filename: string
  status: string
  additions: number
  deletions: number
  oldValue: string
  newValue: string
}

export type ThreadSection = {
  id: string
  type: "markdown" | "commit-links" | "code" | "image" | "diff"
  content: string
  role?: "intro" | "details" | "summary"
  filename?: string
  file?: FileChange
  imageUrl?: string
  isCollapsed?: boolean
  commits?: Array<{ sha: string; filename: string }>
} 