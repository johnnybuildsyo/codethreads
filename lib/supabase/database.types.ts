export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
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
      }
    }
  }
}