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
      const stateParam = searchParams.get('state')
      
      if (!code) {
        setError("No authorization code received")
        return
      }

      // Parse state to get role and redirect URL
      let roleInfo = { role: 'USER', redirect: '/customer-panel' }
      try {
        if (stateParam) {
          roleInfo = JSON.parse(decodeURIComponent(stateParam))
        }
      } catch (e) {
        console.warn('Failed to parse state parameter, using defaults')
      }

      try {
        console.log('🔄 Exchanging Google code for token...')
        console.log('Role:', roleInfo.role, 'Redirect:', roleInfo.redirect)
        
        // Send code to backend for token exchange
        const backendResponse = await fetch(`${API_CONFIG.BASE_URL}/oauth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            redirectUri: `${window.location.origin}/auth/callback`,
            role: roleInfo.role
          })
        })

        const backendData = await backendResponse.json()

        if (!backendResponse.ok) {
          console.error('❌ Backend error:', backendData)
          throw new Error(backendData.message || 'Backend authentication failed')
        }

        console.log('✅ Google OAuth successful')
        console.log('Backend data:', backendData)

        // Store token and email
        localStorage.setItem('token', backendData.token)
        localStorage.setItem('userEmail', backendData.user.email)

        // Store role-specific data
        if (roleInfo.role === 'RESTAURANT' && backendData.user) {
          localStorage.setItem('restaurantEmail', backendData.user.email)
          // If restaurant data is returned (has slug), store it
          if (backendData.user.slug) {
            localStorage.setItem('restaurantSlug', backendData.user.slug)
            localStorage.setItem('restaurantData', JSON.stringify(backendData.user))
          }
        } else if (roleInfo.role === 'RIDER' && backendData.user) {
          localStorage.setItem('riderEmail', backendData.user.email)
          localStorage.setItem('riderData', JSON.stringify(backendData.user))
        }

        // Check if this is a new user (needs profile completion)
        const isNewUser = backendData.isNewUser || false
        console.log('Is new user:', isNewUser)

        // Determine redirect based on role and profile completion
        let redirectUrl = roleInfo.redirect

        if (isNewUser) {
          // New users need to complete their profile
          if (roleInfo.role === 'RESTAURANT') {
            redirectUrl = '/restaurant-setup'
          } else if (roleInfo.role === 'RIDER') {
            redirectUrl = '/rider-setup'
          }
          // USER role goes directly to customer-panel (already has email)
        }

        // Redirect to appropriate page
        console.log('🔄 Redirecting to:', redirectUrl)
        router.push(redirectUrl)
      } catch (err: any) {
        console.error('❌ Google OAuth Error:', err)
        setError(err.message)
        
        // Redirect to appropriate signin based on role
        const signinPage = roleInfo.role === 'RESTAURANT' 
          ? '/restaurant-signIn' 
          : roleInfo.role === 'RIDER' 
          ? '/rider-signIn' 
          : '/user-signIn'
        
        setTimeout(() => router.push(signinPage), 3000)
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
