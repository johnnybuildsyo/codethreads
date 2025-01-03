"use client"

import type { Session } from "@/lib/types/session"
import { useTheme } from "next-themes"
import { SessionContent } from "./session-content"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "../ui/badge"
import { Circle } from "lucide-react"

interface SessionViewProps {
  session: Session
  fullName: string
}

export function SessionView({ session, fullName }: SessionViewProps) {
  const { theme } = useTheme()
  const [isLive, setIsLive] = useState(session.is_live)

  useEffect(() => {
    const supabase = createClient()

    console.log("Setting up realtime subscription for session:", session.id, "Current is_live:", session.is_live)

    // Subscribe to changes
    const channel = supabase
      .channel(`session-${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${session.id}`,
        },
        (payload: { new: { is_live: boolean | null } }) => {
          console.log("Received realtime update:", payload)
          setIsLive(payload.new.is_live)
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status)
      })

    // Check for stale session every minute
    const checkStale = setInterval(async () => {
      const { data } = await supabase.from("sessions").select("updated_at, is_live").eq("id", session.id).single()

      if (data?.is_live) {
        const lastUpdate = new Date(data.updated_at).getTime()
        const now = new Date().getTime()
        const STALE_THRESHOLD = 5 * 60 * 1000 // 5 minutes

        if (now - lastUpdate > STALE_THRESHOLD) {
          setIsLive(false)
        }
      }
    }, 60000)

    return () => {
      clearInterval(checkStale)
      supabase.removeChannel(channel)
    }
  }, [session.id])

  return (
    <div className="relative">
      {isLive && (
        <Badge variant="secondary" className="absolute -top-8 right-0 bg-background ring-1 ring-green-500/50 py-2">
          <Circle className="h-4 w-4 rounded-full scale-75 text-green-500/50 ring-4 ring-green-500/30 mr-2 fill-green-500/90" />
          <span className="text-green-500">Live Session in Progress</span>
        </Badge>
      )}
      <SessionContent title={session.title} blocks={session.blocks} theme={theme} fullName={fullName} showDate={true} created_at={session.created_at} commit_shas={session.commit_shas} />
    </div>
  )
}
