import { memo, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckSquare, Square, ChevronDown, ChevronRight } from "lucide-react"
import { FileChange } from "./types"

interface FileSelectorProps {
  files: FileChange[]
  selectedFiles: Set<string>
  onToggle: (filename: string) => void
}

export const FileSelector = memo(({ files, selectedFiles, onToggle }: FileSelectorProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const selectedFilesList = files.filter((f) => selectedFiles.has(f.filename))
  const condensedView = () => {
    if (selectedFilesList.length === 0) return "No files selected"
    if (selectedFilesList.length <= 3) {
      return selectedFilesList.map((f) => f.filename).join(", ")
    }
    return `${selectedFilesList
      .slice(0, 3)
      .map((f) => f.filename)
      .join(", ")} and ${selectedFilesList.length - 3} more`
  }

  return (
    <div className="space-y-2 py-4">
      <Button variant="ghost" size="sm" onClick={() => setIsCollapsed((prev) => !prev)} className="w-full flex items-center justify-between text-sm font-medium hover:bg-transparent">
        <div className="flex items-center gap-2">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>Included Commits to Files...</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {selectedFiles.size} of {files.length} files
        </span>
      </Button>

      {isCollapsed ? (
        <div className="text-sm text-muted-foreground pl-6 truncate">{condensedView()}</div>
      ) : (
        <div className="grid grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-2 py-2">
              {files.map((file) => (
                <Button
                  key={file.filename}
                  variant={selectedFiles.has(file.filename) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onToggle(file.filename)}
                  className="text-xs flex items-center gap-1.5"
                >
                  {selectedFiles.has(file.filename) ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                  {file.filename}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

FileSelector.displayName = "FileSelector"
