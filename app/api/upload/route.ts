import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { uploadToS3 } from "@/lib/s3/utils"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const { data: userData } = await supabase.from("profiles").select("username").eq("id", user.id).single()

    if (!userData?.username) {
      return NextResponse.json({ error: "User profile not found" }, { status: 400 })
    }

    const timestamp = new Date().getTime()
    const fileExtension = file.name.split(".").pop()
    const s3Key = `thread-images/${userData.username}/${timestamp}.${fileExtension}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const imageUrl = await uploadToS3({
      bucketName: process.env.S3_BUCKET_NAME!,
      key: s3Key,
      body: buffer,
      contentType: file.type,
    })

    return NextResponse.json({ image_url: imageUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
