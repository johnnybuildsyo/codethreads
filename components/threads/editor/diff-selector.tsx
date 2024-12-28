import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FileChange } from "./types"
import { Button } from "@/components/ui/button"
import { shouldExcludeFile } from "@/lib/utils"
import { useState } from "react"
import { CheckSquare, Square } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface DiffSelection {
  type: "code" | "diff" | "commit-links"
  file: FileChange
}

interface DiffSelectorProps {
  open: boolean
  onClose: () => void
  files: FileChange[]
  onSelect: (selections: DiffSelection[]) => void
}

export function DiffSelector({ open, onClose, files, onSelect }: DiffSelectorProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [codeType, setCodeType] = useState<"diff" | "code" | "commit-links">("diff")
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
    onSelect(
      filesToAdd.map((file) => ({
        file,
        type: codeType,
      }))
    )
    setSelectedFiles(new Set())
  }

  const getButtonText = (count: number, type: "diff" | "code" | "commit-links") => {
    if (count === 0) return "Add"

    const suffix = count === 1 ? "" : "s"
    switch (type) {
      case "diff":
        return `Add ${count} Diff${suffix}`
      case "code":
        return `Add ${count} Code Block${suffix}`
      case "commit-links":
        return `Add ${count} Link${suffix}`
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Code Changes</DialogTitle>
        </DialogHeader>

        <RadioGroup value={codeType} onValueChange={(value) => setCodeType(value as "diff" | "code" | "commit-links")} className="mb-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="diff" id="diff" />
            <Label htmlFor="diff">Show diff</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="code" id="code" />
            <Label htmlFor="code">Show code</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="commit-links" id="commit-links" />
            <Label htmlFor="commit-links">Link to file</Label>
          </div>
        </RadioGroup>

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
              {getButtonText(selectedFiles.size, codeType)}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
