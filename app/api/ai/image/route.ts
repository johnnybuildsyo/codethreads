import { NextRequest, NextResponse } from "next/server"
import { generateImage } from "../util"
import { transferImageToS3 } from "@/lib/s3/util"
import { getUserProfile } from "@/lib/supabase/util"
import { v4 as uuidv4 } from "uuid"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI")
  }

  const userData = await getUserProfile()
  if (!userData || !userData.username) {
    return NextResponse.json({ error: `User data not found. Not Authorized` }, { status: 401 })
  }

  const { prompt, size, n, path } = await req.json()

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 })
  }

  const images = await generateImage({
    prompt,
    size: size || "1024x1024",
    n: n || 1,
  })

  if (!images || !images[0].url) {
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 })
  }

  const imageKey = `${userData.id}${path ? `/${path}` : ""}/${uuidv4()}.jpg`

  const imageUrl = await transferImageToS3(images[0].url, imageKey)

  return NextResponse.json({ image: imageUrl })
}
