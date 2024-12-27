import { FileChange } from "./types"
import { useState } from "react"
import { LoadingAnimation } from "@/components/ui/loading-animation"

interface CommitInfoProps {
  commit: {
    sha: string
    message: string
    author_name: string
    authored_at: string
  }
  files: FileChange[]
  fullName: string
}

export function CommitInfo({ commit, files, fullName }: CommitInfoProps) {
  const [showAll, setShowAll] = useState(false)
  const displayFiles = showAll ? files : files.slice(0, 6)
  const hasMore = files.length > 6

  return (
    <div className="p-4 bg-muted/50 rounded-md">
      <div className="font-medium flex justify-between pb-2">
        <div className="flex items-center gap-2">
          <a href={`https://github.com/${fullName}/commit/${commit.sha}`} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground font-mono text-sm underline">
            {commit.sha.slice(0, 7)}
          </a>
          <div>{commit.message}</div>
        </div>
        {files.length > 0 ? <div className="text-xs font-mono">{files.length} files changed</div> : <LoadingAnimation className="text-sm font-mono" />}
      </div>
      <div className="text-sm">
        <div className="space-y-1">
          <div className="text-xs font-mono flex items-start justify-start flex-wrap gap-1">
            {displayFiles.map((file) => (
              <div key={file.filename} className="flex px-2 py-1 bg-foreground/5 rounded-md">
                <span>{file.filename}</span>
                <span className="text-muted-foreground ml-2">
                  +{file.additions} -{file.deletions}
                </span>
              </div>
            ))}
            {hasMore && (
              <button className="px-1 py-1 h-auto text-foreground/70 hover:text-foreground" onClick={() => setShowAll(!showAll)}>
                {showAll ? <>-show less</> : <>+show {files.length - 6} more</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
