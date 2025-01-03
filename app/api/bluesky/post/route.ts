import { NextResponse } from "next/server"
import { createBskyAgent } from "@/lib/bluesky/client"
import { getBlueskyConnection } from "@/app/api/bluesky/actions"
import { AppBskyFeedPost } from "@atproto/api"

export async function POST(request: Request) {
  try {
    // Get the posts from the request body
    const { posts } = await request.json()
    if (!Array.isArray(posts)) {
      return NextResponse.json({ error: "Invalid posts data" }, { status: 400 })
    }

    // Get the user's Bluesky connection
    const connection = await getBlueskyConnection()
    if (!connection) {
      return NextResponse.json({ error: "Not connected to Bluesky" }, { status: 401 })
    }

    // Create a Bluesky agent
    const agent = await createBskyAgent(connection)

    // Post the thread
    const refs: { uri: string; cid: string }[] = []
    
    for (const [index, post] of posts.entries()) {
      const record: AppBskyFeedPost.Record = {
        text: post.text,
        createdAt: new Date().toISOString(),
        langs: ["en"],
      }

      // If this is a reply in the thread, add the parent reference
      if (index > 0 && refs[index - 1]) {
        record.reply = {
          root: { uri: refs[0].uri, cid: refs[0].cid },
          parent: { uri: refs[index - 1].uri, cid: refs[index - 1].cid },
        }
      }

      // If there are images, upload them and add them to the post
      if (post.images?.length) {
        const images = await Promise.all(
          post.images.map(async (image: { url: string; alt: string }) => {
            const response = await fetch(image.url)
            const blob = await response.blob()
            const upload = await agent.uploadBlob(blob, {
              encoding: "image/jpeg",
            })
            return {
              image: upload.data.blob,
              alt: image.alt,
            }
          })
        )

        record.embed = {
          $type: "app.bsky.embed.images",
          images,
        }
      }

      // Create the post
      const { uri, cid } = await agent.post(record)
      refs.push({ uri, cid })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to post to Bluesky:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to post to Bluesky" },
      { status: 500 }
    )
  }
} 