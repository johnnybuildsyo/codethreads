import { createContext, useContext, useState } from "react"

interface SessionContextType {
  activeView: "editor" | "preview"
  setActiveView: (view: "editor" | "preview") => void
}

const SessionContext = createContext<SessionContextType | null>(null)

interface SessionProviderProps {
  children: React.ReactNode
  defaultView?: "editor" | "preview"
}

export function SessionProvider({ children, defaultView = "editor" }: SessionProviderProps) {
  const [activeView, setActiveView] = useState<"editor" | "preview">(defaultView)

  return <SessionContext.Provider value={{ activeView, setActiveView }}>{children}</SessionContext.Provider>
}

export const useSessionContext = () => {
  const context = useContext(SessionContext)
  if (!context) throw new Error("useSessionContext must be used within SessionProvider")
  return context
}
