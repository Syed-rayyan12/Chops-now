"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/cart-context"
import { Menu, X, ShoppingCart, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { getUserProfile } from "@/lib/api/user.api"
import { Separator } from "../ui/separator"

type CustomerUser = {
  id?: number
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  image?: string | null
}

export function Header() {
  const router = useRouter()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const [user, setUser] = useState<CustomerUser | null>(null)

  const loadProfile = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) return
      const profile = await getUserProfile()
      console.log('📸 User Profile loaded:', profile)
      console.log('📸 User image:', profile?.image)
      setUser(profile)
      // keep localStorage email in sync
      if (profile?.email) localStorage.setItem('userEmail', profile.email)
    } catch (e: any) {
      console.error('Error loading profile:', e)
      // Only clear token if it's a 401/403 (unauthorized) error
      if (e?.statusCode === 401 || e?.statusCode === 403) {
        console.log('🔒 Token is invalid, clearing auth data')
        localStorage.removeItem('token')
        localStorage.removeItem('userEmail')
        setUser(null)
      } else {
        // For other errors (network, 500, etc.), keep the token
        console.log('⚠️ API error but keeping token:', e?.statusCode)
        // Still try to use the email from localStorage
        const email = localStorage.getItem('userEmail')
        if (email) setUser({ email })
      }
    }
  }

  // Load user email from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("userEmail")
    if (token) {
      loadProfile()
    } else if (email) {
      setUser({ email })
    }
    const onProfileUpdated = () => loadProfile()
    window.addEventListener('profile-updated', onProfileUpdated as any)
    return () => window.removeEventListener('profile-updated', onProfileUpdated as any)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userEmail")
    setUser(null)
    toast({ title: "You have successfully logged out.", duration: 3000 })
    router.push("/")
  }

  // Removed menuLinks array, using individual links below

  return (
    <header className="sticky top-0 z-50 py-2 bg-white border-b border-primary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 xl:px-12 2xl:px-16">
        <div className="relative flex items-center justify-end lg:justify-between h-16">
          {/* Logo */}
          <Link href="/" className="absolute left-0 lg:static lg:transform-none lg:left-auto">
            <img
              className="w-32 px-2 object-cover"
              src="/chopNow.png"
              alt="ChopNow Logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 lg:space-x-10 xl:space-x-14 flex-1 justify-center">
            <Link href="/about" className="text-foreground font-ubuntu hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/restaurants" className="text-foreground font-ubuntu hover:text-primary transition-colors">
              Restaurants
            </Link>
             <Link href="/career" className="text-foreground font-ubuntu hover:text-primary transition-colors">
              Career
            </Link>
            {/* <Link href="/services" className="text-foreground font-ubuntu hover:text-primary transition-colors">
              Services
            </Link> */}
            {/* <Link href="/offers" className="text-foreground font-ubuntu hover:text-primary transition-colors">
              Offers
            </Link> */}
             <Link href="/partners" className="text-foreground font-ubuntu hover:text-primary transition-colors">
              Partners & Careers
            </Link>
            <Link href="/blog" className="text-foreground font-ubuntu hover:text-primary transition-colors">
              Blogs
            </Link>
            <Link href="/contact" className="text-foreground font-ubuntu hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden cursor-pointer"
              onClick={() => setIsSheetOpen(true)}
            >
              <Menu className="w-5 h-5 transition-all duration-300" />
            </Button>

            {/* Cart */}
            <Button variant="tertiary" size="sm" className="relative text-foreground cursor-pointer" asChild>
              <Link href="/cart">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartCount > 0 && (
                  <Badge className="absolute bg-primary text-white -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full cursor-pointer" asChild>
                  <Button
                    size="sm"
                    className="flex items-center gap-2 bg-transparent px-2 py-1 rounded-full shadow-none hover:bg-transparent"
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold overflow-hidden">
                      {(() => {
                        console.log('🖼️ Rendering avatar, user.image:', user.image)
                        if (user.image) {
                          return <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                        }
                        const f = user.firstName?.trim()?.[0]?.toUpperCase()
                        const l = user.lastName?.trim()?.[0]?.toUpperCase()
                        if (f && l) return `${f}${l}`
                        if (f) return f
                        return user.email?.charAt(0).toUpperCase() || 'U'
                      })()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border border-primary/50 bg-white">
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-foreground leading-none pb-1">
                        {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Welcome!'}
                      </p>
                      <p className="text-xs leading-none text-secondary">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/50" />
                  <DropdownMenuItem className="hover:bg-primary text-foreground hover:text-white cursor-pointer" asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-primary text-foreground hover:text-white cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2 hover:text-white" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" className="flex items-center gap-2 ease-in duration-300 font-ubuntu font-medium cursor-pointer bg-primary text-white px-6 py-3 lg:px-10 lg:py-5 hover:bg-transparent hover:text-primary border border-transparent hover:border-primary rounded-[10px]" asChild>
                <Link href="/user-signIn">
                  <span className="text-sm lg:text-[15px]">Log In</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Sheet Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${isSheetOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setIsSheetOpen(false)}
        />

        {/* Mobile Sheet Panel (from left) */}
        <div
          className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white z-50 shadow-xl transform transition-transform duration-300 ${isSheetOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">

            
            <Button
              onClick={() => setIsSheetOpen(false)}
              className="bg-gray-200 text-gray-700 w-10 h-10 flex items-center justify-center rounded-full p-0"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Mobile Logo */}
            <Link href="/" onClick={() => setIsSheetOpen(false)} className="block">
              <img
                className="w-32 object-cover"
                src="/chopNow.png"
                alt="ChopNow Logo"
              />
            </Link>
            </div>
            <Separator className="bg-gray-200"/>
            <Link href="/restaurants" onClick={() => setIsSheetOpen(false)} className="block text-lg text-foreground hover:text-primary transition-colors">
              Restaurants
            </Link>
            <Link href="/about" onClick={() => setIsSheetOpen(false)} className="block text-lg text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/services" onClick={() => setIsSheetOpen(false)} className="block text-lg text-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/career" onClick={() => setIsSheetOpen(false)} className="block text-lg text-foreground hover:text-primary transition-colors">
             Career
            </Link>
             <Link href="/partners" onClick={() => setIsSheetOpen(false)} className="block text-lg text-foreground hover:text-primary transition-colors">
             Partners
            </Link>
            <Link href="/blog" onClick={() => setIsSheetOpen(false)} className="block text-lg text-foreground hover:text-primary transition-colors">
              Blogs
            </Link>
            <Link href="/contact" onClick={() => setIsSheetOpen(false)} className="block text-lg text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
