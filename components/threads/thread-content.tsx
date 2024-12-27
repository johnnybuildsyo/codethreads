import { CommitDiff } from "./editor/commit-diff"
import { ThreadPost } from "@/types/thread"
import { useTheme } from "next-themes"

interface ThreadContentProps {
  post: ThreadPost
}

export function ThreadContent({ post }: ThreadContentProps) {
  const { theme } = useTheme()

  return (
    <>
      <p className="text-base text-muted-foreground mb-4">{post.content}</p>
      {post.commit?.files && <CommitDiff files={post.commit.files} theme={theme} defaultRenderDiff={false} />}
    </>
  )
}
