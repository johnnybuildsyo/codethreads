import { ThreadSection } from "./types"
import { ThreadProvider } from "./thread-context"
import { ThreadContent } from "../thread-content"

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

export function ThreadPreview({ title, sections, theme, fullName }: ThreadPreviewProps) {
  const isEmpty = !title && sections.every((section) => (section.type === "markdown" ? !section.content : false))

  if (isEmpty) {
    return (
      <div className="space-y-8 border-l pl-8 pb-8">
        <div className="prose dark:prose-invert text-muted-foreground">
          <h2 className="text-muted-foreground">Create Your CodeThread</h2>
          <p>A great CodeThread typically includes:</p>
          <ul>
            <li>A clear title describing the changes</li>
            <li>An introduction explaining the problem or feature</li>
            <li>Technical details about your implementation</li>
            <li>Relevant code snippets or diffs</li>
            <li>A summary of the impact and next steps</li>
          </ul>
          <p>Start by adding a title and writing in the markdown sections. You can also add code snippets and diffs using the buttons below each section.</p>
        </div>
      </div>
    )
  }

  return (
    <ThreadProvider defaultView="preview">
      <div className="space-y-8 border-l pl-8 pb-8">
        <ThreadContent title={title} sections={sections} theme={theme} fullName={fullName} />
      </div>
    </ThreadProvider>
  )
}
