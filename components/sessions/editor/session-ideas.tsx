import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

interface SessionIdeasProps {
  ideas: string[]
  onClose: () => void
}

export function SessionIdeas({ ideas, onClose }: SessionIdeasProps) {
  if (ideas.length === 0) return null

  return (
    <Card>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <CardTitle className="text-sm font-medium">AI Generated Session Ideas</CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-2">
        {ideas.map((idea, i) => (
          <div key={i} className="p-2 hover:bg-muted rounded-lg cursor-pointer">
            {idea}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
