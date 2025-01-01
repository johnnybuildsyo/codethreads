import { ChevronLeft, ChevronRight } from "lucide-react"
import { BoltIcon } from "@heroicons/react/24/solid"
import { cn } from "@/lib/utils"

export default function LogoIcon({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center -space-x-[7px] scale-110 text-blue-500", className)}>
      <ChevronLeft className="h-5 w-5 scale-y-125 text-blue-500" />
      <BoltIcon className="h-[18px] w-[18px] scale-x-75 scale-y-125 rotate-[9deg] -left-px text-blue-500" />
      <ChevronRight className="h-5 w-5 scale-y-125 text-blue-500" />
    </div>
  )
}
