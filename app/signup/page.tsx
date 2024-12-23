import Header from "@/components/layout/header"
import { UserSignup } from "@/components/auth/user-signup"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Join Code Threads</h1>
          <UserSignup />
        </div>
      </main>
    </div>
  )
}
