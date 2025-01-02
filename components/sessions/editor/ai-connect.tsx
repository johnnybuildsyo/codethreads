import React from "react"
import { Button } from "@/components/ui/button"
import { SquareCheck, SquareX } from "lucide-react"

export const AIConnect = ({ enabled }: { enabled: boolean }) => {
  return (
    <Button className="inline-flex items-center gap-1" variant="outline" size="sm" className="text-xs font-mono">
      {enabled ? (
        <div className="flex items-center gap-2">
          <SquareCheck className="h-3 w-3 text-green-500" /> AI Enabled
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <SquareX className="h-3 w-3" /> AI Disabled
        </div>
      )}
      <span className="opacity-50 font-thin">|</span> 50 Tokens
    </Button>
  )
}
