import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { repo: string[] } }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.provider_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { repo } = await params;
  const [owner, repository] = repo;
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const per_page = searchParams.get('per_page') || '30'
  const sort = searchParams.get('sort') || 'created'
  const direction = searchParams.get('direction') || 'asc'

  const apiUrl = `https://api.github.com/repos/${owner}/${repository}/commits?page=${page}&per_page=${per_page}&sort=${sort}&direction=${direction}` 
  console.log(apiUrl)

  const response = await fetch(
    apiUrl,
    {
      headers: {
        Authorization: `Bearer ${session.provider_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  )

  const data = await response.json()
  return NextResponse.json(data)
} 