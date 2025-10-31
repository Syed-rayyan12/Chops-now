"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function SupportSection() {
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
          <div className="pt-4 space-y-4">
          <div>
            <Label htmlFor="subject" className="pb-2 text-gray-400">
              Subject
            </Label>
            <Input className="border border-gray-400" id="subject" placeholder="Enter subject" />
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
            />
          </div>
          
          <Button className="bg-secondary cursor-pointer hover:bg-secondary/80">Send Message</Button>
          </div>
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
