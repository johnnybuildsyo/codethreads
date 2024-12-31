import Header from "@/components/layout/header"
import Hero from "@/components/home/hero"
import Features from "@/components/home/features"
import HowItWorks from "@/components/home/how-it-works"
import CallToAction from "@/components/home/call-to-action"
import Footer from "@/components/layout/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
