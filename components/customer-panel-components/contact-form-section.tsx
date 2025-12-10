"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { submitContactForm } from "@/lib/api/contact.api"

export function ContactFormSection() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await submitContactForm({
      name: formData.firstName,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    })

    if (result.success) {
      toast({
        title: "Message Sent!",
        description: result.message,
      })
      // Reset form
      setFormData({
        firstName: "",
        email: "",
        subject: "",
        message: "",
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <div 
      className="py-16 bg-white relative bg-cover  bg-no-repeat"
      style={{ backgroundImage: "url('/featured-bg.jpeg')" }}
    >
      {/* Dark overlay for better text readability */}

      
      <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          
          {/* Left Side - Get In Touch */}
          <div className="pt-14">
            <h2 className="font-fredoka-one text-4xl font-extrabold text-foreground mb-4">
             Let's Start a Conversation
            </h2>
            <div className="bg-secondary h-1 w-24 mb-6"></div>
            <p className="text-lg text-foreground font-ubuntu leading-relaxed mb-8">
              Reach out using the form, and our team will get back to you as soon as humanly possible
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-space-grotesk text-lg font-bold text-foreground mb-1">
                    Our Address
                  </h3>
                  <p className="text-gray-600 text-[16px] font-ubuntu">
                    123 Food Street, London, UK, SW1A 1AA
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-space-grotesk text-lg font-bold text-foreground mb-1">
                  Contact Us
                  </h3>
                  <p className="text-gray-600 text-[16px] font-ubuntu">
                    +44 20 1234 5678
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-space-grotesk text-lg font-bold text-foreground mb-1">
                    Email Address
                  </h3>
                  <p className="text-gray-600 text-[16px] font-ubuntu">
                    info@chopnow.co.uk
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-lg relative rounded-lg p-8 z-10"
          >
            {/* Top Right Border - Half Width */}
            <div className="absolute top-0 right-0 w-1/2 h-3 bg-secondary -z-10"></div>
            
            {/* Right Vertical Border */}
            <div className="absolute top-0 right-0 w-4 h-full bg-secondary -z-10"></div>
            
            {/* Bottom Right Border - Half Width */}
            <div className="absolute bottom-0 right-0 w-1/2 h-3 bg-secondary -z-10"></div>
            
            <h2 className="font-fredoka-one text-3xl font-extrabold text-foreground mb-4">
              General Inquiries
            </h2>
            <div className="bg-secondary h-1 w-24 mb-6"></div>
            <p className="text-base text-foreground font-ubuntu leading-relaxed mb-6">
             For all general questions and feedback, please contact us at [add email]. We're here to help!

            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-foreground">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Your first name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="your@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-foreground">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Subject of your message"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                  placeholder="Your message here..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors font-medium font-ubuntu disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
