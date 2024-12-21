import Header from "@/components/header"
import Hero from "@/components/hero"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import CommunityShowcase from "@/components/community-showcase"
import CallToAction from "@/components/call-to-action"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CommunityShowcase />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
