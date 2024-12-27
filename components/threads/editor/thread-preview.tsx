import { CommitDiff } from "./commit-diff"
import ReactMarkdown from "react-markdown"
import { ThreadSection } from "./types"
import { ThreadProvider } from "./thread-context"

interface ThreadPreviewProps {
  title: string
  sections: ThreadSection[]
  theme?: string
  fullName: string
  commit: {
    sha: string
    message: string
    author_name: string
    authored_at: string
  }
}

export function ThreadPreview({ title, sections, theme, fullName, commit }: ThreadPreviewProps) {
  return (
    <ThreadProvider defaultView="preview">
      <div className="space-y-8 border-l pl-8">
        <h1 className="text-3xl font-bold mb-4">{title || "Untitled Thread"}</h1>
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id}>
              {section.type === "markdown" && (
                <div className="prose dark:prose-invert">
                  <ReactMarkdown>{section.content || ""}</ReactMarkdown>
                </div>
              )}
              {section.type === "diff" && section.file && <CommitDiff files={[section.file]} defaultRenderDiff={true} theme={theme} />}
              {section.type === "image" && section.imageUrl && (
                <div className="my-4">
                  <img src={section.imageUrl} alt="" className="rounded-lg" />
                </div>
              )}
              {section.type === "file-link" && section.file && (
                <a
                  href={`https://github.com/${fullName}/blob/${commit.sha}/${section.file.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline block mb-4"
                >
                  View {section.file.filename} on GitHub
                </a>
              )}
              {section.type === "code" && section.file && (
                <div className="relative font-mono text-sm p-4 bg-muted rounded-lg mb-4">
                  <div className="text-xs text-muted-foreground mb-2">{section.file.filename}</div>
                  <pre className="overflow-auto">{section.file.newValue}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ThreadProvider>
  )
}
