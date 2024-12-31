import Header from "@/components/layout/header"
import { UserSignup } from "@/components/auth/user-signup"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <UserSignup />
        </div>
      </main>
    </div>
  )
}
