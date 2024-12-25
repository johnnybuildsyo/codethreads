import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"

export const AIConnect = ({ apiKey, onConnect }: { apiKey: string; onConnect: (key: string) => void }) => {
  const [showDialog, setShowDialog] = useState(false)
  const [keyInput, setKeyInput] = useState("")

  const handleSubmit = () => {
    if (keyInput?.startsWith("sk-")) {
      localStorage.setItem("openai-key", keyInput)
      onConnect(keyInput)
      setShowDialog(false)
      setKeyInput("")
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setShowDialog(true)} className="text-xs">
        <Sparkles className={`h-4 w-4 ${apiKey ? "text-yellow-500" : "text-muted-foreground"}`} />
        {apiKey ? "AI Connected" : "Connect AI"}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect OpenAI</DialogTitle>
            <DialogDescription>Add your API key to enable AI-assisted thread creation</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">OpenAI API Key</label>
              <Input type="password" placeholder="sk-..." value={keyInput} onChange={(e) => setKeyInput(e.target.value)} autoComplete="off" />
              <p className="text-xs text-muted-foreground">Your API key is stored locally and never sent to our servers</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!keyInput?.startsWith("sk-")}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
