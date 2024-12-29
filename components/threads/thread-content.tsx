import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { getLanguageFromFilename } from "@/lib/utils"
import { CommitLink } from "./commit-link"
import { CommitDiff } from "./editor/commit-diff"

interface ThreadContentProps {
  title: string
  sections: any[]
  theme?: string
  fullName: string
  showDate?: boolean
  created_at?: string
  commit_shas?: string[]
}

export function ThreadContent({ title, sections, theme, fullName, showDate, created_at, commit_shas }: ThreadContentProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        {showDate && created_at && commit_shas && (
          <div className="text-xs font-mono flex items-center space-x-2 pb-2">
            <span>{new Date(created_at).toLocaleDateString()}</span>
            <span>·</span>
            <span>{commit_shas.length} commits</span>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id}>
            {section.type === "markdown" && (
              <div className="prose dark:prose-invert">
                <ReactMarkdown>{section.content || ""}</ReactMarkdown>
              </div>
            )}
            {section.type === "code" && section.content && (
              <div className="relative font-mono text-sm bg-muted rounded-lg mb-4">
                <div className="text-xs text-muted-foreground p-4 pb-0">{section.filename}</div>
                <div className="overflow-auto">
                  <SyntaxHighlighter language={getLanguageFromFilename(section.filename || "")} style={theme === "dark" ? oneDark : oneLight} customStyle={{ margin: 0, background: "transparent" }}>
                    {section.content}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}
            {section.type === "diff" && section.file && <CommitDiff files={[section.file]} defaultRenderDiff={true} theme={theme} />}
            {section.type === "image" && section.imageUrl && (
              <div className="my-4">
                <img src={section.imageUrl} alt="" className="rounded-lg" />
              </div>
            )}
            {section.type === "commit-links" && section.commits && (
              <div className="not-prose flex flex-col gap-1">
                {section.commits.map((link: any) => (
                  <div key={link.filename}>
                    <CommitLink filename={link.filename} sha={link.sha} fullName={fullName} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
