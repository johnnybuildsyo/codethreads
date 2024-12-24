import Header from "@/components/layout/header"
import { UserSignIn } from "@/components/auth/user-signin"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Welcome Back</h1>
          <UserSignIn />
        </div>
      </main>
    </div>
  )
}
