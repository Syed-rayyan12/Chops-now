"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { submitNewsletterSubscription } from "@/lib/api/newsletter.api"
import { useAuth } from "@/contexts/auth-context"

export function Newsletter() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
    }
  }, [user])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isSubmitting) return

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter a valid email address to subscribe.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitNewsletterSubscription({
        email: email.trim(),
      })

      if (result.success) {
        toast({
          title: "Subscribed!",
          description: `Subscription request sent for ${email.trim()}.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Newsletter submission error:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className=" py-32 relative">
      <img
        src="/cusine-shape-2.png"
        alt="Cuisine shape"
        className="absolute top-70 left-40 w-30 max-sm:left-0 max-md:left-0 md:left-12 max-sm:top-174 max-sm:w-30 pointer-events-none select-none  float-shape" />
      <img
        src="/changa.png"
        alt="Cuisine shape"
        className="absolute top-4 right-10 w-40 max-sm:right-0 max-sm:w-30 pointer-events-none select-none  float-shape" />

      <div className="mx-auto max-sm:px-10 max-md:px-14 md:px-12 text-center max-w-3xl">
        <div className="bg-secondary w-18 h-18 mx-auto flex justify-center items-center rounded-full mb-5">
          <Send className="text-white" />
        </div>
        <h2 className="font-fredoka-one text-4xl max-sm:text-2xl font-extrabold mb-4 leading-15 max-sm:leading-12">
          Stay Connected with Your Favourite African & Caribbean Restaurant in
London
        </h2>
        <div className="bg-secondary h-1 w-24 mx-auto mt-6 mb-6"></div>
        <p className="text-[16px] font-ubuntu mb-8 px-44 max-sm:px-0">
         Get fresh updates, exclusive offers, and cultural food stories delivered straight to you
        </p>
        <form onSubmit={handleSubmit} className="flex max-sm:flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-primary/40 rounded-[10px] w-full px-4 py-2 mr-4 bg-white text-foreground"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary rounded-[10px] text-white px-6 py-3 hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      </div>
    </section>
  )
}