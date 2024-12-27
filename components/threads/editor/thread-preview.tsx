import { CommitDiff } from "./commit-diff"
import ReactMarkdown from "react-markdown"
import { ThreadSection } from "./types"

interface ThreadPreviewProps {
  title: string
  intro: string
  sections: ThreadSection[]
  summary: string
  theme?: string
  showIntro: boolean
  showSummary: boolean
}

export function ThreadPreview({ title, intro, sections, summary, theme, showIntro, showSummary }: ThreadPreviewProps) {
  return (
    <div className="space-y-8 border-l pl-8">
      <div className="border-b pb-8">
        <h1 className="text-3xl font-bold mb-4">{title || "Untitled Thread"}</h1>
        {showIntro && (
          <div className="prose dark:prose-invert">
            <ReactMarkdown>{intro || "No introduction yet"}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {sections
          .filter((s) => s.type === "diff")
          .map((section) => (
            <div key={section.id}>{section.file && <CommitDiff files={[section.file]} theme={theme} />}</div>
          ))}
      </div>

      {showSummary && (
        <div className="prose dark:prose-invert border-t pt-8">
          <ReactMarkdown>{summary || "No summary yet"}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
