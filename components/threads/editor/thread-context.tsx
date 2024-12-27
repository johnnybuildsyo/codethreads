import { createContext, useContext, useState } from "react"

interface ThreadContextType {
  activeView: "editor" | "preview"
  setActiveView: (view: "editor" | "preview") => void
}

const ThreadContext = createContext<ThreadContextType | null>(null)

export function ThreadProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor")

  return <ThreadContext.Provider value={{ activeView, setActiveView }}>{children}</ThreadContext.Provider>
}

export const useThreadContext = () => {
  const context = useContext(ThreadContext)
  if (!context) throw new Error("useThreadContext must be used within ThreadProvider")
  return context
}
