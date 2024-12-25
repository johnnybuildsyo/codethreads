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
  type: "intro" | "diff" | "markdown" | "summary"
  content?: string
  file?: FileChange
  afterFile?: string
} 