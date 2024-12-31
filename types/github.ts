export interface GithubRepo {
  id: number
  name: string
  description: string
  stars: number
  forks: number
  language: string | null
  updated_at: string
  homepage: string | null
}

export interface Project {
  id: string
  github_id: number
  name: string
  display_name: string
  description: string | null
  homepage: string | null
  screenshot_url: string | null
  logo_url: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

export interface Commit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      email: string
      date: string
    }
  }
} 