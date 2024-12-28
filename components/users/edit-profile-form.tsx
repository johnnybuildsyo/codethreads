"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AvatarUpload } from "@/components/auth/avatar-upload"
import Link from "next/link"

interface EditProfileFormProps {
  profile: {
    username: string
    name: string | null
    bio: string | null
    avatar_url: string | null
    github_username: string | null
    twitter_username: string | null
  }
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const [name, setName] = useState(profile.name || "")
  const [bio, setBio] = useState(profile.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "")
  const [twitter, setTwitter] = useState(profile.twitter_username || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          bio,
          avatar_url: avatarUrl,
          twitter_username: twitter || null,
        })
        .eq("username", profile.username)

      if (error) throw error

      toast.success("Profile updated successfully")
      router.push(`/${profile.username}`)
      router.refresh()
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <AvatarUpload currentUrl={avatarUrl} onUpload={(url) => setAvatarUrl(url)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitter">Twitter Username</Label>
        <div className="flex items-center">
          <span className="mr-2">@</span>
          <Input id="twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="username" />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Link className="text-sm opacity-80 hover:opacity-100 flex items-center px-4 py-1 rounded-md" href={`/${profile.username}`}>
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
