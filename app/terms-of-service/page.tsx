"use client"

import { Header } from '@/components/customer-panel-components/header'
import { Footer } from '@/components/customer-panel-components/footer'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Banner Section */}
      <div className="relative w-full flex items-center justify-center h-[89vh] bg-gradient-to-r from-orange-100 to-orange-200 py-22">
        <img 
          src="/boo.png" 
          alt="Terms of Service Banner" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <img 
            src="/lines.svg" 
            alt="Lines" 
            className="w-80 mx-auto pointer-events-none mb-10 select-none max-sm:w-50" 
          />
          <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-5 max-sm:text-3xl max-sm:mb-2 text-white">
            Terms of <span className='text-secondary'>Service</span>
          </h1>
          
          <p className="font-ubuntu text-white mb-6 text-[18px] text-center max-w-2xl px-4">
            Understanding our terms helps you enjoy our services with confidence.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8">
          <div className="max-w-4xl mx-auto space-y-6 text-foreground font-ubuntu">
            
            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Our Commitment</h2>
            <p className="leading-relaxed">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.
            </p>
            
            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Information We Collect</h2>
            <p className="leading-relaxed">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">How We Use Your Information</h2>
            <p className="leading-relaxed">
              It is a long established fact that a reader will be distracted by the readable content of a page when letters, as opposed to using 'Content here, content here', making it look like readable English
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">How We Protect Your Data</h2>
            <p className="leading-relaxed">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Sharing and Disclosure</h2>
            <p className="leading-relaxed">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Cookies and Tracking Technologies</h2>
            <p className="leading-relaxed">
              It is a long established fact that a reader will be distracted by the readable content of a page when lf letters, as opposed to using 'Content here, content here', making it look like readable English
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">International Data Transfers</h2>
            <p className="leading-relaxed">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
