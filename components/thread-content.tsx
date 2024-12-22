import { CommitDiff } from "./commit-diff"
import { ThreadPost } from "@/types/thread"

interface ThreadContentProps {
  post: ThreadPost
}

export function ThreadContent({ post }: ThreadContentProps) {
  return (
    <>
      <p className="text-base text-muted-foreground mb-6">{post.content}</p>
      {post.commit && <CommitDiff message={post.commit.message} diff={post.commit.diff} />}
    </>
  )
}
