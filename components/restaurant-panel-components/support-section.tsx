"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitSupportMessage } from "@/lib/api/notification.api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function SupportSection() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both subject and message",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await submitSupportMessage(subject, message)
      toast({
        title: "Success",
        description: "Your message has been sent to the admin",
      })
      setSubject("")
      setMessage("")
    } catch (error) {
      console.error("Error submitting support message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
     <div className="bg-secondary rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold font-ubuntu mb-2">SUPPORT</h2>
        <p className="text-white font-ubuntu text-sm ">Message the admin directly from your dashboard</p>
      </div>
      <Card className="border-primary/50 p-4  bg-white">
        <CardHeader>
          <CardTitle className="text-foreground">Contact Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          <div>
            <Label htmlFor="subject" className="pb-2 text-gray-400">
              Subject
            </Label>
            <Input 
              className="border border-gray-400" 
              id="subject" 
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="message" className="pb-2 text-gray-400">
              Message
            </Label>
            <Textarea
              className="border border-gray-400"
              id="message"
              placeholder="Describe your issue or question"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="bg-secondary cursor-pointer hover:bg-secondary/80"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-primary/50 p-4 bg-white">
        <CardHeader>
          <CardTitle className="text-foreground">Frequently Asked Questions</CardTitle>
           <CardDescription className="text-secondary">Have a question? We’ve got you covered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <h4 className="font-medium text-lg text-primary">1. How do I update my menu items?</h4>
            <p className="text-sm text-gray-400">
              Go to Menu Management section and click on the edit button next to any item.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-lg text-primary">1. When do I receive payments?</h4>
            <p className="text-sm text-gray-400">
              Payments are processed weekly every Monday for the previous week's orders.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-lg text-primary">1. How do I handle order cancellations?</h4>
            <p className="text-sm text-gray-400">
              You can cancel orders from the Orders section before they are marked as in-progress.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
