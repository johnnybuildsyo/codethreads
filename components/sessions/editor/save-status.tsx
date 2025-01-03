import { Circle } from "lucide-react"

interface SaveStatusProps {
  saveStatus: "saved" | "saving" | "error"
  lastSavedAt: Date | null
}

export function SaveStatus({ saveStatus, lastSavedAt }: SaveStatusProps) {
  return (
    <div className="flex flex-col items-end gap-1 ml-auto">
      <div className="flex items-center gap-2">
        <Circle className="h-4 w-4 rounded-full scale-75 text-green-500 ring-4 ring-green-500/30" fill="currentColor" />
        <span className="text-xs text-muted-foreground">Connected</span>
      </div>
      <div className="text-[10px] text-muted-foreground font-mono">
        {saveStatus === "saving" && <span>Updating...</span>}
        {saveStatus === "saved" && lastSavedAt && <span>Last updated at {new Date(lastSavedAt).toLocaleTimeString()}</span>}
        {saveStatus === "error" && <span className="text-destructive">Update failed</span>}
      </div>
    </div>
  )
}
