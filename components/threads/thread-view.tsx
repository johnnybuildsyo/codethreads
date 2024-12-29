"use client"

import type { Thread } from "@/types/thread"
import { useTheme } from "next-themes"
import { ThreadContent } from "./thread-content"

interface ThreadViewProps {
  thread: Thread
  fullName: string
}

export function ThreadView({ thread, fullName }: ThreadViewProps) {
  const { theme } = useTheme()

  return <ThreadContent title={thread.title} sections={thread.sections} theme={theme} fullName={fullName} showDate={true} created_at={thread.created_at} commit_shas={thread.commit_shas} />
}
