import { Button } from '@/components/ui/button'

export default function CallToAction() {
  return (
    <section className="py-20 px-6 text-center">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Coding Journey?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join Code Threads today and become part of a thriving community of developers building in public.
        </p>
        <Button size="lg">Sign Up Now</Button>
      </div>
    </section>
  )
}

