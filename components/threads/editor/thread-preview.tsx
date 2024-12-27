import { CommitDiff } from "./commit-diff"
import ReactMarkdown from "react-markdown"
import { ThreadSection } from "./types"
import { ThreadProvider } from "./thread-context"

interface ThreadPreviewProps {
  title: string
  sections: ThreadSection[]
  theme?: string
}

export function ThreadPreview({ title, sections, theme }: ThreadPreviewProps) {
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
            </div>
          ))}
        </div>
      </div>
    </ThreadProvider>
  )
}
