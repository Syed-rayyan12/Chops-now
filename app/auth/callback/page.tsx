"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { API_CONFIG } from "@/lib/api/config"

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get('code')
      
      if (!code) {
        setError("No authorization code received")
        return
      }

      try {
        console.log('🔄 Exchanging Google code for token...')
        
        // Send code to backend for token exchange
        const backendResponse = await fetch(`${API_CONFIG.BASE_URL}/oauth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            redirectUri: `${window.location.origin}/auth/callback`
          })
        })

        const backendData = await backendResponse.json()

        if (!backendResponse.ok) {
          throw new Error(backendData.message || 'Backend authentication failed')
        }

        console.log('✅ Google OAuth successful')

        // Store token
        localStorage.setItem('token', backendData.token)
        localStorage.setItem('userEmail', backendData.user.email)

        // Redirect to customer panel
        router.push('/customer-panel')
      } catch (err: any) {
        console.error('❌ Google OAuth Error:', err)
        setError(err.message)
        setTimeout(() => router.push('/user-signIn'), 3000)
      }
    }

    handleGoogleCallback()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <div className="text-gray-500">Redirecting to sign in...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <div className="text-gray-700">Completing Google sign in...</div>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <div className="text-gray-700">Loading...</div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  )
}
