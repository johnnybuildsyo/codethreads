"use client"

import type { Session } from "@/lib/types/session"
import { useTheme } from "next-themes"
import { SessionContent } from "./session-content"

interface SessionViewProps {
  session: Session
  fullName: string
}

export function SessionView({ session, fullName }: SessionViewProps) {
  const { theme } = useTheme()

  return <SessionContent title={session.title} blocks={session.blocks} theme={theme} fullName={fullName} showDate={true} created_at={session.created_at} commit_shas={session.commit_shas} />
}
