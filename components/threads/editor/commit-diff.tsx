import { memo, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import DiffViewer from "react-diff-viewer-continued"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

interface FileChange {
  filename: string
  status: string
  additions: number
  deletions: number
  oldValue: string
  newValue: string
}

export const CommitDiff = memo(
  ({ files, theme, onRemove, defaultRenderDiff = false }: { files: FileChange[]; theme: string | undefined; onRemove?: (filename: string) => void; defaultRenderDiff?: boolean }) => {
    const [renderDiff, setRenderDiff] = useState(defaultRenderDiff)
    const { ref, inView } = useInView({
      threshold: 0,
      triggerOnce: true,
    })

    const shouldRenderDiff = inView && renderDiff

    return (
      <div ref={ref} className="space-y-4">
        {files.map((file, i) => (
          <div key={i} className={cn("border rounded-lg px-4 bg-muted/50 relative", shouldRenderDiff ? "py-4" : "pt-1 pb-0")}>
            {onRemove && (
              <Button variant="ghost" className="absolute -top-4 -right-[50px] h-6 w-6 px-1" onClick={() => onRemove(file.filename)}>
                <X className="h-4 w-4" />
              </Button>
            )}
            <div className="flex justify-between items-center mb-2">
              <code className="text-xs">{file.filename}</code>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  +{file.additions} -{file.deletions}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setRenderDiff((prev) => !prev)}>
                  {renderDiff ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="max-h-[300px] overflow-auto text-[13px]">
              {shouldRenderDiff && (
                <DiffViewer
                  oldValue={file.oldValue}
                  newValue={file.newValue}
                  splitView={false}
                  useDarkTheme={theme === "dark"}
                  hideLineNumbers
                  styles={{
                    contentText: {
                      fontSize: "13px",
                      lineHeight: "1.4",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    },
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }
)

CommitDiff.displayName = "CommitDiff"
