"use server"

import { createClient } from "@/lib/supabase/server"
import { loginWithBluesky, type BlueskyCredentials } from "@/lib/bluesky/client"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/supabase/database.types"

export async function connectBlueskyAccount(identifier: string, password: string) {
  const supabase = await createClient()
  
  try {
    // First authenticate with Bluesky
    const credentials = await loginWithBluesky(identifier, password)
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    // Store credentials in Supabase
    const { error } = await supabase
      .from("bluesky_connections")
      .upsert({
        user_id: user.id,
        did: credentials.did,
        handle: credentials.handle,
        access_jwt: credentials.accessJwt,
        refresh_jwt: credentials.refreshJwt,
      } satisfies Database["public"]["Tables"]["bluesky_connections"]["Insert"])

    if (error) throw error

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to connect Bluesky account:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to connect Bluesky account" 
    }
  }
}

export async function getBlueskyConnection(): Promise<BlueskyCredentials | null> {
  const supabase = await createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from("bluesky_connections")
      .select("did, handle, access_jwt, refresh_jwt")
      .eq("user_id", user.id)
      .single()

    if (!data) return null

    return {
      did: data.did,
      handle: data.handle,
      accessJwt: data.access_jwt,
      refreshJwt: data.refresh_jwt,
    }
  } catch (error) {
    console.error("Failed to get Bluesky connection:", error)
    return null
  }
}

export async function disconnectBlueskyAccount() {
  const supabase = await createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { error } = await supabase
      .from("bluesky_connections")
      .delete()
      .eq("user_id", user.id)

    if (error) throw error

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to disconnect Bluesky account:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to disconnect Bluesky account" 
    }
  }
} 