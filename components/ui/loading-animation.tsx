"use client"

export function LoadingAnimation({ className }: { className?: string }) {
  return (
    <div className="text-muted-foreground">
      <span className="pr-0.5 animate-pulse">Loading</span>
      <span className="inline-flex items-center gap-px">
        <span className="animate-fade-in-out text-xl">.</span>
        <span className="animate-fade-in-out text-xl [animation-delay:0.2s]">.</span>
        <span className="animate-fade-in-out text-xl [animation-delay:0.4s]">.</span>
      </span>
    </div>
  )
}
