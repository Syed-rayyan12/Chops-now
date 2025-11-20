"use client"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Phone, LocateIcon, Mail } from "lucide-react"

export function Footer() {
  return (
    <>
      <footer className="bg-[url('/footer-bg.jpeg')] bg-cover bg-center border-t border-primary/50">
        <div className=" mx-auto px-36 max-2xl:px-6 max-sm:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <Link href="/" >
                <img className="w-32 object-cover mb-2" src="/chopNow.png" alt="" />
              </Link>
              <p className="text-foreground mb-4 text-[15px] font-ubuntu">
                ChopNow is the UK's leading food platform for authentic African and Caribbean cuisine. We connect
                food lovers with vibrant flavours and deliver a true taste of home.

              </p>

              {/* Follow Us inside company column */}
              <h3 className="font-fredoka-one font-bold text-foreground mt-6 mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-white  transition-colors hover:bg-foreground bg-secondary hover:text-white w-10 h-10 rounded-full flex justify-center items-center">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-white  transition-colors hover:bg-foreground bg-secondary hover:text-white w-10 h-10 rounded-full flex justify-center items-center">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-white  transition-colors hover:bg-foreground bg-secondary hover:text-white w-10 h-10 rounded-full flex justify-center items-center">
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>

            </div>

            {/* Contact Info (separate column) */}

            {/* Quick Links */}
            <div>
              <h3 className="font-fredoka-one font-bold  text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    about
                  </Link>
                </li>
                <li>
                  <Link href="/restaurants" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    Restaurants
                  </Link>
                </li>
                <li>
                  <Link href="/career" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    Partners & Couriers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    blogs
                  </Link>
                </li>

                <li>
                  <Link href="/blog" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>


            {/* Legal & Policies */}
            <div>
              <h3 className="font-fredoka-one font-bold text-foreground mb-4">Legal & Policies</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms-of-service" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>

                <li>
                  <Link href="/slavery-statement" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    Modern Slavery Statement
                  </Link>

                </li>
                 <li>
                  <Link href="/gender-pay" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                   Gender Pay Gap
                  </Link>

                </li>
                <li>
                  <Link href="/privacy-policy" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="text-foreground font-ubuntu text-sm hover:text-primary transition-colors">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-fredoka-one font-semibold text-foreground mb-4">Contact Info</h3>
              <div className="flex flex-col gap-4 pb-4">
                <div className="flex gap-4">
                  <Phone className="font-ubuntu text-secondary text-[16px]" />
                  <span className="font-ubuntu text-[16px]">123 High Street, London, UK</span>
                </div>
                <div className="flex gap-4">
                  <LocateIcon className="font-ubuntu text-secondary text-[16px]" />
                  <span className="font-ubuntu text-[16px]">+44 20 7946 0123</span>
                </div>
                <div className="flex gap-4 pb-2">
                  <Mail className="font-ubuntu text-secondary text-[16px]" />
                  <span className="font-ubuntu text-[16px]">hello@chopnow.co.uk</span>
                </div>
              </div>
            </div>


          </div>

          <div className="border-t border-secondary pt-4">
            <p className="text-foreground text-[16px] text-center">
              © 2025 <span className="text-ubuntu text-secondary text-[16px] font-semibold">Chop</span><span className="text-ubuntu text-primary text-[16px] font-semibold">Now</span> Ltd — All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
