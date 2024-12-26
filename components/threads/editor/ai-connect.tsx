import React from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export const AIConnect = ({ enabled }: { enabled: boolean }) => {
  return (
    <Button variant="outline" size="sm" className="text-xs font-mono">
      <Sparkles className={`h-4 w-4 ${enabled ? "text-yellow-500" : "text-muted-foreground"}`} />
      {enabled ? "AI Enabled" : "AI Disabled"} <span className="opacity-50 font-thin">|</span> 50 Tokens
    </Button>
  )
}
