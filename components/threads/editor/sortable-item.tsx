import { useSortable } from "@dnd-kit/sortable"
import { GripVertical } from "lucide-react"
import { ThreadSection } from "./types"
import type { CSSProperties } from "react"
import { useEffect, useRef, useState } from "react"

interface SortableItemProps {
  section: ThreadSection
  children: React.ReactNode
}

export function SortableItem({ section, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })
  const [height, setHeight] = useState<number>()
  const ref = useRef<HTMLDivElement>(null)

  // Capture height before dragging starts
  useEffect(() => {
    if (ref.current && !height) {
      setHeight(ref.current.offsetHeight)
    }
  }, [height])

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(1)` : undefined,
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: isDragging ? ("relative" as const) : undefined,
    height: isDragging ? height : undefined,
  }

  return (
    <div ref={mergeRefs([ref, setNodeRef])} style={style} className="relative group">
      {children}
      <div {...attributes} {...listeners} className="absolute -left-8 top-2 opacity-50 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

// Helper to merge refs
const mergeRefs = (refs: any[]) => {
  return (value: any) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value)
      } else if (ref != null) {
        ref.current = value
      }
    })
  }
}
