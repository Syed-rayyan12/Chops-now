import type React from "react"
import type { Metadata } from "next"
import { Ubuntu, Space_Grotesk } from "next/font/google"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-ubuntu",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Chop Now - Food Delivery Made Easy",
  description: "Order your favorite food from the best restaurants near you. Fast delivery, great taste!",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${ubuntu.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="font-sans text-[18px]">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
