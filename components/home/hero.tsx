import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="py-20 px-6 text-center">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl text-balance">The Publishing Platform for Live Coding</h1>
        <p className="mt-4 text-xl text-muted-foreground text-balance">
          Code threads is your platform for building your projects in the open where your commits become posts. Grow your audience while you grow your skills as a developer.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Button size="lg">Get Started</Button>
        </div>
      </div>
    </section>
  )
}
