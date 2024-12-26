export const FileSelector = memo(({ files, selectedFiles, onToggle }: { files: FileChange[]; selectedFiles: Set<string>; onToggle: (filename: string) => void }) => (
  <div className="space-y-2 py-4">
    <h4 className="text-sm font-medium">Included Commits to Files...</h4>
    <div className="flex flex-wrap gap-2">
      {files.map((file) => (
        <Button key={file.filename} variant={selectedFiles.has(file.filename) ? "default" : "ghost"} size="sm" onClick={() => onToggle(file.filename)} className="text-xs flex items-center gap-1.5">
          {selectedFiles.has(file.filename) ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
          {file.filename}
        </Button>
      ))}
    </div>
  </div>
))
