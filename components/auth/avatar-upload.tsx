"use client"

import { ChangeEvent, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface AvatarUploadProps {
  currentUrl?: string | null
  onUpload: (url: string) => void
}

export function AvatarUpload({ currentUrl, onUpload }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { image_url } = await response.json()
      onUpload(image_url)
    } catch (error) {
      console.error("Avatar upload failed:", error)
    }
  }

  return (
    <div className="relative group w-20 h-20 rounded-full overflow-hidden">
      <img src={currentUrl || "https://github.com/identicons/app.png"} alt="Avatar" className="w-20 h-20 mx-auto mb-4" />
      <Button variant="ghost" size="icon" className="absolute w-full h-full inset-0 opacity-0 group-hover:opacity-90 bg-black/50 transition-opacity" onClick={() => inputRef.current?.click()}>
        <Camera className="h-5 w-5" />
      </Button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </div>
  )
}
