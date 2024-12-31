export interface ProfileLink {
  title: string
  url: string
}

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  created_at: string
  github_username: string | null
  links: ProfileLink[]
  name: string | null
  twitter_username: string | null
  updated_at: string
} 