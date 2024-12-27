export interface FileChange {
  filename: string
  status: string
  additions: number
  deletions: number
  oldValue: string
  newValue: string
}

export interface ThreadSection {
  id: string
  type: "intro" | "diff" | "markdown" | "image" | "code" | "file-link"
  content?: string
  file?: FileChange
  role?: "intro" | "details" | "summary"
  imageUrl?: string
  codeType?: "diff" | "code" | "link"
  isCollapsed?: boolean
} 