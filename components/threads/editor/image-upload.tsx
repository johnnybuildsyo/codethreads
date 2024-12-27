import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

interface ImageUploadProps {
  onUpload: (file: File) => void
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  return (
    <div>
      <input type="file" ref={inputRef} onChange={handleChange} accept="image/*" className="hidden" />
      <Button variant="outline" size="sm" onClick={handleClick} className="text-xs">
        <UploadCloud className="h-3 w-3 mr-1" />
        Add image
      </Button>
    </div>
  )
}
