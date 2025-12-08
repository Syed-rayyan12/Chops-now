"use client"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Phone, LocateIcon, Mail } from "lucide-react"
import MapPinLineIcon from 'remixicon-react/MapPinLineIcon';

// TikTok icon component (not available in remixicon-react v1.0.0)
const TikTokIcon = ({ size = 24, color = "#000" }: { size?: number; color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
  >
    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
  </svg>
);

export function Footer() {
  return (
    <>
      <footer className="bg-[url('/footer-bg.jpeg')] bg-cover bg-center border-t border-primary/50">
        <div className=" mx-auto px-36 max-2xl:px-6 max-sm:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-4">
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
                <Link href="https://www.tiktok.com/@chopnowofficial" className="text-white  transition-colors hover:bg-foreground bg-secondary hover:text-white w-10 h-10 rounded-full flex justify-center items-center">
                  <TikTokIcon size={20} color="#fff" />
                </Link>
                <Link href="https://www.facebook.com/chopnowofficial" className="text-white  transition-colors hover:bg-foreground bg-secondary hover:text-white w-10 h-10 rounded-full flex justify-center items-center">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="https://www.instagram.com/chopnowofficial/?igsh=NHBoODg4bDl5cTcw&utm_source=qr#" className="text-white  transition-colors hover:bg-foreground bg-secondary hover:text-white w-10 h-10 rounded-full flex justify-center items-center">
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
                    About
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
                    Blogs
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
                <div className="flex gap-4 items-center">
                  <MapPinLineIcon className="font-ubuntu text-secondary text-[30px]" />
                  <span className="font-ubuntu text-[14px]">Chopnow Ltd
                    Westgate House
                    West Square
                    HARLOW
                    Essex
                    CM20 1YS
                    UNITED KINGDOM</span>
                </div>
                <div className="flex gap-4">
                  <Phone className="font-ubuntu text-secondary text-[16px]" />
                  <span className="font-ubuntu text-[16px]">07944 445328</span>
                </div>
                <div className="flex gap-4 pb-2">
                  <Mail className="font-ubuntu text-secondary text-[16px]" />
                  <span className="font-ubuntu text-[16px]">hello@chopnow.uk.com</span>
                </div>
              </div>
            </div>


          </div>

          <div className="border-t border-secondary pt-4">
            <div className="flex justify-between items-center max-sm:flex-col max-sm:text-center max-sm:gap-2">
              <p className="text-foreground text-[16px] text-center">
                © 2025 <span className="text-ubuntu text-secondary text-[16px] font-semibold">Chop</span><span className="text-ubuntu text-primary text-[16px] font-semibold">Now</span> Ltd — All rights reserved.
              </p>
              <span className="text-md">
                Designed & Developed by{" "}
                <Link
                  href="https://xpertwebstudio.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Xpertwebstudio
                </Link>
              </span>

            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
