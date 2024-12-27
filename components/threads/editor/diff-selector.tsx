import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FileChange } from "./types"
import { Button } from "@/components/ui/button"
import { shouldExcludeFile } from "@/lib/utils"
import { useState } from "react"
import { CheckSquare, Square } from "lucide-react"

interface DiffSelectorProps {
  open: boolean
  onClose: () => void
  files: FileChange[]
  onSelect: (files: FileChange[]) => void
}

export function DiffSelector({ open, onClose, files, onSelect }: DiffSelectorProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const filteredFiles = files.filter((f) => !shouldExcludeFile(f.filename))

  const handleToggle = (filename: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev)
      if (next.has(filename)) {
        next.delete(filename)
      } else {
        next.add(filename)
      }
      return next
    })
  }

  const handleAdd = () => {
    const filesToAdd = filteredFiles.filter((f) => selectedFiles.has(f.filename))
    onSelect(filesToAdd)
    setSelectedFiles(new Set())
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Code Changes</DialogTitle>
        </DialogHeader>
        <div className="grid gap-1 max-h-[50vh] overflow-y-auto border rounded-md">
          {filteredFiles.map((file) => (
            <Button key={file.filename} variant="ghost" className="justify-start font-mono text-xs h-auto py-2" onClick={() => handleToggle(file.filename)}>
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                  {selectedFiles.has(file.filename) ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                  <span className="truncate">{file.filename}</span>
                </div>
                <span className="text-muted-foreground ml-2 shrink-0">
                  +{file.additions} -{file.deletions}
                </span>
              </div>
            </Button>
          ))}
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={selectedFiles.size === 0}>
              Add {selectedFiles.size} {selectedFiles.size === 1 ? "Diff" : "Diffs"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
