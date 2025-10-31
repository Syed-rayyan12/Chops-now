"use client";

import { Header } from '@/components/customer-panel-components/header';
import { Footer } from '@/components/customer-panel-components/footer';
import { ContactFormSection } from '@/components/customer-panel-components/contact-form-section';
import { FaqSection } from '@/components/customer-panel-components/faq-section';
import { Newsletter } from '@/components/newsletter';

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative w-full flex items-center justify-center h-[90vh] bg-gradient-to-r from-orange-100 to-orange-200">
        <img 
          src="/boo.png" 
          alt="Contact Banner" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <img 
            src="/lines.svg" 
            alt="Lines" 
            className="w-80 mx-auto pointer-events-none mb-10 select-none max-sm:w-50" 
          />
          <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-5 max-sm:text-3xl max-sm:mb-2 text-white">
            <span className='text-secondary font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-5 max-sm:text-3xl max-sm:mb-2'>Contact</span> Us
          </h1>
          <p className='text-white max-w-3xl mx-auto font-ubuntu leading-relaxed text-center px-4'>
 Whether you've got a question, feedback, or partnership idea — we're here to help. At Chop  Now, we believe great food and great service go hand in hand.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <ContactFormSection />
       <FaqSection/>
        <Newsletter />
      <Footer />
    </div>
  );
}
