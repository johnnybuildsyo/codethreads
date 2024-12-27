"use client"

import { cn } from "@/lib/utils"

export function LoadingAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("text-muted-foreground font-mono", className)}>
      <span className="pr-0.5 animate-pulse">Loading</span>
      <span className="inline-flex items-center font-sans gap-px">
        <span className="animate-fade-in-out text-xl">.</span>
        <span className="animate-fade-in-out text-xl [animation-delay:0.2s]">.</span>
        <span className="animate-fade-in-out text-xl [animation-delay:0.4s]">.</span>
      </span>
    </div>
  )
}
