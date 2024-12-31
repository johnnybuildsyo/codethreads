import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileChange } from "@/lib/types/session"
import { Button } from "@/components/ui/button"
import { Check, Github } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommitLinkSelectorProps {
  open: boolean
  onClose: () => void
  files: FileChange[]
  existingLinks: { filename: string; sha: string }[]
  onSelect: (selectedFiles: FileChange[]) => void
}

export function CommitLinkSelector({ open, onClose, files, existingLinks, onSelect }: CommitLinkSelectorProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<FileChange[]>([])
  const existingFilenames = new Set(existingLinks.map((link) => link.filename))
  const fileArray = Array.isArray(files) ? files : []

  const handleSelect = (file: FileChange) => {
    if (selectedFiles.some((f) => f.filename === file.filename)) {
      setSelectedFiles(selectedFiles.filter((f) => f.filename !== file.filename))
    } else {
      setSelectedFiles([...selectedFiles, file])
    }
  }

  const handleSubmit = () => {
    onSelect(selectedFiles)
    setSelectedFiles([])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add File Links</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto py-4">
          <div className="space-y-2">
            {fileArray.map((file) => {
              const isSelected = selectedFiles.some((f) => f.filename === file.filename)
              const isExisting = existingFilenames.has(file.filename)
              return (
                <div
                  key={file.filename}
                  className={cn("flex items-center justify-between p-2 rounded-md", isExisting ? "bg-muted/50" : "hover:bg-muted/50 cursor-pointer", isSelected && "bg-muted")}
                  onClick={() => !isExisting && handleSelect(file)}
                >
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <span className="font-mono text-sm">{file.filename}</span>
                  </div>
                  {isExisting ? <span className="text-xs text-muted-foreground">Already linked</span> : isSelected ? <Check className="h-4 w-4" /> : null}
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedFiles.length === 0}>
            Add Selected Files
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
