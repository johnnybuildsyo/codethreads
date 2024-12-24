"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CommitManager } from "./commit-manager"

interface ImportCommitsButtonProps {
  projectId: string
  fullName: string
}

export function ImportCommitsButton({ projectId, fullName }: ImportCommitsButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (isOpen) {
    return <CommitManager projectId={projectId} fullName={fullName} />
  }

  return <Button onClick={() => setIsOpen(true)}>Import Commits as Threads</Button>
}
