import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SessionBlock } from "@/lib/types/session"
import { BlueskyIcon } from "@/components/icons/bluesky"
import { useState } from "react"
import { connectBlueskyAccount, getBlueskyConnection } from "@/app/api/bluesky/actions"
import { toast } from "sonner"

interface BlueskyShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  blocks: SessionBlock[]
}

export function BlueskyShareDialog({ open, onOpenChange, title, blocks }: BlueskyShareDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await connectBlueskyAccount(identifier, password)
      if (!result.success) {
        throw new Error(result.error)
      }
      toast.success("Successfully connected to Bluesky!")
      setIdentifier("")
      setPassword("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to connect to Bluesky")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BlueskyIcon className="h-5 w-5 text-blue-500" />
            Share to Bluesky
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-muted">
              <p className="font-medium">{title}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {blocks.filter((b) => b.type === "markdown").length} text blocks
                {blocks.filter((b) => b.type === "code" || b.type === "diff").length > 0 && `, ${blocks.filter((b) => b.type === "code" || b.type === "diff").length} code blocks`}
                {blocks.filter((b) => b.type === "image").length > 0 && `, ${blocks.filter((b) => b.type === "image").length} images`}
              </p>
            </div>
            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Handle</Label>
                <Input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com or you.bsky.social" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">App Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Bluesky app password" required />
                <p className="text-xs text-muted-foreground">
                  Create an app password at{" "}
                  <a href="https://bsky.app/settings/app-passwords" target="_blank" rel="noopener noreferrer" className="underline">
                    bsky.app/settings/app-passwords
                  </a>
                </p>
              </div>
              <DialogFooter>
                <div className="flex justify-between w-full">
                  <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Connecting..." : "Connect Bluesky Account"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
