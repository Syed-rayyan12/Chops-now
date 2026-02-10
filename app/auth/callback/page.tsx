"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { API_CONFIG } from "@/lib/api/config"

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Prevent double processing
      if (isProcessing) {
        console.log('⏸️ Already processing OAuth callback, skipping...')
        return
      }
      
      const code = searchParams.get('code')
      const stateParam = searchParams.get('state')
      
      if (!code) {
        console.log('⚠️ No authorization code - user may have pressed back button')
        // Redirect to home instead of showing error
        router.push('/')
        return
      }

      // Mark as processing to prevent double calls
      setIsProcessing(true)

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
        console.log('Redirect URI:', `${window.location.origin}/auth/callback`)
        
        // Clear the URL immediately to prevent reuse on back button
        window.history.replaceState({}, document.title, '/auth/callback')
        
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

        // Check if this is a new user (needs profile completion)
        const isNewUser = backendData.isNewUser || false
        const requiresOTPVerification = backendData.requiresOTPVerification || false
        console.log('🔍 Is new user:', isNewUser)
        console.log('🔍 Requires OTP verification:', requiresOTPVerification)
        console.log('🔍 Needs setup:', backendData.needsSetup)

        // Store token and email based on role
        if (roleInfo.role === 'RESTAURANT') {
          localStorage.setItem('restaurantToken', backendData.token)
          localStorage.setItem('restaurantEmail', backendData.user.email)
          // If restaurant data is returned (has slug), store it
          if (backendData.user.slug) {
            localStorage.setItem('restaurantSlug', backendData.user.slug)
            localStorage.setItem('restaurantData', JSON.stringify(backendData.user))
          }
          // Set flag for OTP verification ONLY if brand new account
          if (requiresOTPVerification) {
            localStorage.setItem('requiresOTPVerification', 'true')
          }
        } else if (roleInfo.role === 'RIDER') {
          localStorage.setItem('riderToken', backendData.token)
          localStorage.setItem('riderEmail', backendData.user.email)
          localStorage.setItem('riderData', JSON.stringify(backendData.user))
          // Set flag for OTP verification ONLY if brand new account
          if (requiresOTPVerification) {
            localStorage.setItem('requiresOTPVerification', 'true')
          }
        } else {
          // USER role
          localStorage.setItem('token', backendData.token)
          localStorage.setItem('userEmail', backendData.user.email)
          // Set flag for OTP verification ONLY if brand new account
          if (requiresOTPVerification) {
            localStorage.setItem('requiresOTPVerification', 'true')
          }
        }

        // Determine redirect based on role and profile completion
        let redirectUrl = roleInfo.redirect

        // Check if user needs to go to setup page (either new user or incomplete profile)
        const needsProfileSetup = isNewUser || backendData.needsSetup
        console.log('🔍 Needs profile setup:', needsProfileSetup, '(isNewUser:', isNewUser, 'needsSetup:', backendData.needsSetup, ')')

        if (needsProfileSetup) {
          // Users need to complete their profile
          console.log('✅ Redirecting to setup page for', roleInfo.role)
          if (roleInfo.role === 'RESTAURANT') {
            redirectUrl = '/restaurant-setup'
          } else if (roleInfo.role === 'RIDER') {
            redirectUrl = '/rider-setup'
          } else if (roleInfo.role === 'USER') {
            redirectUrl = '/user-setup'
          }
        } else {
          console.log('✅ Profile complete, redirecting to dashboard')
        }

        // Redirect to appropriate page
        console.log('🔄 Redirecting to:', redirectUrl)
        console.log('🔧 Needs profile setup:', needsProfileSetup)
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
  }, [searchParams, router, isProcessing])

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
