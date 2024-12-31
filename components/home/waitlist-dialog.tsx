import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Zap } from "lucide-react"
import ReCAPTCHA from "react-google-recaptcha"
import { useTheme } from "next-themes"
import { joinWaitlist } from "@/app/api/waitlist/actions"
import { toast } from "sonner"

interface WaitlistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WaitlistDialog({ open, onOpenChange }: WaitlistDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()

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
          onOpenChange(false)
        }
      } else {
        toast.success("Thanks for joining the waitlist! We'll be in touch soon.")
        localStorage.setItem("onWaitlist", "true")
        onOpenChange(false)
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join the Waitlist</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col sm:flex-row w-full items-center gap-2">
            <Input type="email" name="email" placeholder="Enter your email" required className="grow w-full sm:w-auto" />
            <Button type="submit" disabled={isLoading || !recaptchaToken}>
              <Zap className="h-5 w-5 mr-1" /> {isLoading ? "Joining..." : "Join Waitlist"}
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden border bg-background border-background ring-2 ring-foreground/10">
            <div className="-m-1">
              <ReCAPTCHA theme={resolvedTheme === "dark" ? "dark" : "light"} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} onChange={setRecaptchaToken} />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
