import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const adjustHeight = () => {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    textarea.addEventListener("input", adjustHeight)
    adjustHeight() // Initial adjustment

    return () => textarea.removeEventListener("input", adjustHeight)
  }, [])

  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={(element) => {
        // Handle both refs
        if (typeof ref === "function") {
          ref(element)
        } else if (ref) {
          ref.current = element
        }
        textareaRef.current = element
      }}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
