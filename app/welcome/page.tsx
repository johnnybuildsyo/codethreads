import { Suspense } from "react"
import LogoIcon from "@/components/graphics/logo-icon"
import { WelcomeForm } from "@/components/auth/welcome-form"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-lg mx-auto px-4 py-16">
        <div className="flex justify-center mb-8">
          <LogoIcon className="scale-150" />
        </div>
        <h1 className="text-3xl font-bold mb-16 text-center">Welcome to CodeCook.live!</h1>
        <div className="space-y-6">
          <Suspense>
            <WelcomeForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
