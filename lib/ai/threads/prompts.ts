import { ThreadSection } from "@/components/threads/editor/types"

export function generateSectionPrompt(params: {
  section: ThreadSection
  title: string
  sections: ThreadSection[]
  codeChanges: string
}) {
  const { section, title, sections, codeChanges } = params
  const hasExistingContent = (section.content ?? "").trim().length > 0

  // Find adjacent markdown sections
  const sectionIndex = sections.findIndex(s => s.id === section.id)
  const prevSection = sections
    .slice(0, sectionIndex)
    .reverse()
    .find(s => s.type === "markdown")
  const nextSection = sections
    .slice(sectionIndex + 1)
    .find(s => s.type === "markdown")

  const adjacentContext = `${prevSection ? `Previous section: "${prevSection.content}"\n` : ""}${
    nextSection ? `Next section: "${nextSection.content}"\n` : ""
  }`

  return `You are helping write a technical blog post.

${
  hasExistingContent
    ? `Current content: "${section.content}"
Please add 1-2 sentences that enhance this content, focusing on ${section.role === "intro" ? "the problem and motivation" : section.role === "summary" ? "benefits and impact" : "technical implementation details"}.`
    : `Write 2-3 EXTREMELY concise short sentences for a ${section.role === "intro" ? "thread introduction about the problem and motivation" : section.role === "summary" ? "conclusion highlighting benefits and impact" : "technical explanation of the implementation"}.`
}

Context:
Title: ${title || "Untitled Thread"}
${adjacentContext}
Code changes:
${codeChanges.slice(0, 2000)}...`
} 