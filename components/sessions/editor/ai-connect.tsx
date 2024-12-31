import React from "react"
import { Button } from "@/components/ui/button"
import { Circle } from "lucide-react"

export const AIConnect = ({ enabled }: { enabled: boolean }) => {
  return (
    <Button variant="outline" size="sm" className="text-xs font-mono">
      <Circle
        className={`h-4 w-4 rounded-full scale-75 ${enabled ? "text-green-500 ring-4 ring-green-500/30" : "text-muted-foreground/70 ring-4 ring-foreground/10"}`}
        fill={enabled ? "currentColor" : "none"}
      />
      {enabled ? "AI Enabled" : "AI Disabled"} <span className="opacity-50 font-thin">|</span> 50 Tokens
    </Button>
  )
}
