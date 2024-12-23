export interface Profile {
  id: string
  username: string
  name: string | null
  avatar_url: string | null
  bio: string | null
  github_username: string | null
  twitter_username: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
    }
  }
} 