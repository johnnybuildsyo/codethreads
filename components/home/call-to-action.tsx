"use client"

import { useState } from "react"
import { WaitlistDialog } from "./waitlist-dialog"

export default function CallToAction() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <section className="py-20 px-6 text-center">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-5xl font-extrabold mb-4">Ready to Start Cooking?</h2>
        <p className="text-xl text-muted-foreground mb-8">Join CodeCook.live today and become part of a thriving community of developers building in public.</p>
        <WaitlistDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </section>
  )
}
