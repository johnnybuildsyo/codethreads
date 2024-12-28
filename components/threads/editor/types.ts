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
  type: "markdown" | "diff" | "code" | "image" | "commit-links"
  content?: string
  role?: "intro" | "details" | "summary"
  file?: FileChange
  imageUrl?: string
  isCollapsed?: boolean
  commits?: Array<{
    sha: string
    filename: string
  }>
} 