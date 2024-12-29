import { Github, ExternalLink } from "lucide-react"

interface CommitLinkProps {
  filename: string
  sha: string
  fullName: string
}

export function CommitLink({ filename, sha, fullName }: CommitLinkProps) {
  return (
    <a
      href={`https://github.com/${fullName}/blob/${sha}/${filename}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-md font-mono"
    >
      <Github className="h-3.5 w-3.5" />
      <span>{filename}</span>
      <ExternalLink className="h-3 w-3" />
    </a>
  )
}
