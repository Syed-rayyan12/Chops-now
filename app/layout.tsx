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
  title: "Authentic African Meals in UK | ChopNow",
  description: "Order Caribbean dishes in UK with ChopNow. Enjoy jerk chicken, jollof rice, and fresh plantains delivered fast. Taste island flavors at home today!",
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
