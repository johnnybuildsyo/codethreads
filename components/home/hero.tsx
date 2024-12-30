"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { joinWaitlist } from "@/app/api/waitlist/actions"
import { toast } from "sonner"
import { Check, Zap } from "lucide-react"
import ReCAPTCHA from "react-google-recaptcha"
import { useTheme } from "next-themes"

export default function Hero() {
  const [profile, setProfile] = useState<{ username: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOnWaitlist, setIsOnWaitlist] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("username").eq("id", session.user.id).single()
        setProfile(data)
      }
    })
    // Check if user is on waitlist
    const waitlistStatus = localStorage.getItem("onWaitlist")
    if (waitlistStatus === "true") {
      setIsOnWaitlist(true)
    }
  }, [])

  async function handleSubmit(formData: FormData) {
    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA")
      return
    }

    formData.append("token", recaptchaToken)
    setIsLoading(true)
    try {
      const result = await joinWaitlist(formData)
      if (result.error) {
        toast.error(result.error)
        if (result.error === "You're already on the waitlist!") {
          localStorage.setItem("onWaitlist", "true")
          setIsOnWaitlist(true)
        }
      } else {
        toast.success("Thanks for joining the waitlist! We'll be in touch soon.")
        localStorage.setItem("onWaitlist", "true")
        setIsOnWaitlist(true)
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 px-6 text-center">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl text-balance">The Publishing Platform for Live Coding</h1>
        <p className="mt-4 text-xl text-muted-foreground text-balance">
          CodeThreads is your platform for building your projects in the open where your commits become posts. Grow your audience while you grow your skills as a developer.
        </p>
        <div className="mt-8">
          {profile ? (
            <Link href={`/${profile.username}`}>
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : isOnWaitlist ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5 text-green-500" />
                <span>You're on the waitlist!</span>
              </div>
              <p className="text-sm text-muted-foreground">We'll notify you when CodeThreads is ready.</p>
            </div>
          ) : showForm ? (
            <form action={handleSubmit} className="flex flex-col items-center justify-center gap-4 max-w-lg mx-auto border rounded-lg p-8">
              <div className="flex flex-col sm:flex-row w-full items-center gap-2">
                <Input type="email" name="email" placeholder="Enter your email" required className="grow w-full sm:w-auto" />
                <Button type="submit" size="lg" disabled={isLoading || !recaptchaToken}>
                  <Zap className="h-5 w-5 mr-1" /> {isLoading ? "Joining..." : "Join Waitlist"}
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden border bg-background border-background ring-2 ring-foreground/10">
                <div className="-m-1">
                  <ReCAPTCHA theme={resolvedTheme === "dark" ? "dark" : "light"} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} onChange={setRecaptchaToken} />
                </div>
              </div>
            </form>
          ) : (
            <Button className="text-xl px-12 py-4 h-auto" onClick={() => setShowForm(true)}>
              <Zap className="h-5 w-5 mr-2 scale-150" /> Join Waitlist
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
