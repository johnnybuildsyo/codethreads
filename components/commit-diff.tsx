interface CommitDiffProps {
  message: string
  diff: string
}

export function CommitDiff({ message, diff }: CommitDiffProps) {
  return (
    <div className="bg-muted rounded-md mb-6 overflow-hidden">
      <div className="bg-muted/50 px-4 py-2 border-b">
        <h3 className="font-mono text-sm">
          <span className="text-muted-foreground">Commit:</span> {message}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <pre className="text-xs leading-relaxed">
          <code className="block p-4">
            {diff.split("\n").map((line, i) => {
              let lineClass = "block"
              if (line.startsWith("+")) {
                lineClass += " bg-green-500/10 text-green-700"
              } else if (line.startsWith("-")) {
                lineClass += " bg-red-500/10 text-red-700"
              } else if (line.startsWith("@")) {
                lineClass += " bg-blue-500/10 text-blue-700"
              }
              return (
                <span key={i} className={lineClass}>
                  {line}
                </span>
              )
            })}
          </code>
        </pre>
      </div>
    </div>
  )
}
