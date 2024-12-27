import { CommitDiff } from "./commit-diff"
import ReactMarkdown from "react-markdown"
import { ThreadSection } from "./types"
import { ThreadProvider } from "./thread-context"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { getLanguageFromFilename } from "@/lib/utils"

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
                <div className="relative font-mono text-sm bg-muted rounded-lg mb-4">
                  <div className="text-xs text-muted-foreground p-4 pb-0">{section.file.filename}</div>
                  <div className="overflow-auto">
                    <SyntaxHighlighter language={getLanguageFromFilename(section.file.filename)} style={theme === "dark" ? oneDark : oneLight} customStyle={{ margin: 0, background: "transparent" }}>
                      {section.file.newValue}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ThreadProvider>
  )
}