"use client"

import { useState, type FormEvent } from "react"
import { X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { API_CONFIG } from "@/lib/api/config"

interface OTPModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  role: "USER" | "RESTAURANT" | "RIDER"
  onVerified: () => void
}

export function OTPModal({ isOpen, onClose, email, role, onVerified }: OTPModalProps) {
  const { toast } = useToast()
  const [otp, setOtp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, role }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Email Verified! ✅",
          description: "You can now sign in to your account.",
        })
        onVerified()
        onClose()
      } else {
        toast({
          title: "Verification Failed",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "OTP Resent",
          description: "Please check your email for the new OTP.",
        })
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit OTP to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                setOtp(value)
              }}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Resending...
              </>
            ) : (
              "Resend OTP"
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-orange-50 border-l-4 border-primary rounded">
          <p className="text-xs text-gray-600">
            <strong>⚠️ Security Note:</strong> Never share your OTP with anyone. This code will expire in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}
