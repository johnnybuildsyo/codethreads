"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { ChevronLeft, ChevronRight, Moon, Sun, Zap } from "lucide-react"

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b border-foreground/10">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="inline-flex items-center -space-x-[7px] scale-110 text-primary">
            <ChevronLeft className="h-4 w-4 scale-y-125" />
            {/* <Activity className="h-4 w-4 scale-y-110 -scale-x-90" /> */}
            <Zap className="h-[18px] w-[18px] scale-x-75 scale-y-125 rotate-[9deg] -left-px" />
            <ChevronRight className="h-4 w-4 scale-y-125" />
          </div>
          <span className="font-bold text-xl">Code Threads</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="#features" className="text-muted-foreground hover:text-primary">
            Features
          </Link>
          <Link href="#how-it-works" className="text-muted-foreground hover:text-primary">
            How It Works
          </Link>
          <Link href="#community" className="text-muted-foreground hover:text-primary">
            Community
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="mr-2">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost">Log In</Button>
          <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  )
}
