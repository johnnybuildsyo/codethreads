"use server"

import { createServiceClient } from "@/lib/supabase/server"
import { z } from "zod"

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  token: z.string().min(1, "reCAPTCHA token is required"),
})

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email")
  const token = formData.get("token")
  const validatedFields = schema.safeParse({ email, token })

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message }
  }

  // Verify reCAPTCHA token
  const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validatedFields.data.token}`,
  })

  const recaptchaData = await recaptchaResponse.json()
  if (!recaptchaData.success) {
    return { error: "reCAPTCHA verification failed. Please try again." }
  }

  // Use service role client for waitlist operations
  const supabase = createServiceClient()

  try {
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: validatedFields.data.email })

    if (error) {
      if (error.code === "23505") {
        return { error: "You're already on the waitlist!" }
      }
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to join waitlist:", error)
    return { error: "Failed to join waitlist. Please try again." }
  }
} 