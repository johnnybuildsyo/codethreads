export interface GithubRepo {
  id: number
  name: string
  description: string
  stars: number
  forks: number
  language: string | null
  updated_at: string
}

export interface Project {
  id: string
  github_id: number
  name: string
  display_name: string
  description: string | null
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