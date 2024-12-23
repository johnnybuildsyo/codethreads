import { ChevronLeft, ChevronRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LogoIcon({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center -space-x-[7px] scale-110 text-primary", className)}>
      <ChevronLeft className="h-4 w-4 scale-y-125" />
      <Zap className="h-[18px] w-[18px] scale-x-75 scale-y-125 rotate-[9deg] -left-px" />
      <ChevronRight className="h-4 w-4 scale-y-125" />
    </div>
  )
}
