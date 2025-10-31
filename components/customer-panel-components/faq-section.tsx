"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: "How do I place an order?",
    answer: "Simply browse through our restaurant listings, select your favorite dishes, add them to your cart, and proceed to checkout. You can track your order in real-time once it's confirmed."
  },
  {
    question: "What are the delivery charges?",
    answer: "Delivery charges vary based on your location and the restaurant you order from. You can see the exact delivery fee before placing your order at checkout."
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery times typically range from 30-45 minutes depending on your location and restaurant preparation time. You'll receive an estimated delivery time when you place your order."
  },
  {
    question: "Can I cancel or modify my order?",
    answer: "You can cancel or modify your order within 2 minutes of placing it. After that, please contact our support team for assistance as the restaurant may have already started preparing your food."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, digital wallets, and cash on delivery. All online payments are secured and encrypted for your safety."
  },
  {
    question: "How do I become a restaurant partner?",
    answer: "Click on 'Partner with Us' in the menu, fill out the registration form, and our team will contact you within 24-48 hours to discuss the onboarding process."
  }
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8 max-w-4xl">
        {/* Gray Rounded Box */}
        <div className="bg-[#F9F3EB] rounded-3xl p-8 md:p-12">
          {/* Heading */}
          <h2 className="font-fredoka-one text-4xl font-extrabold text-foreground mb-4 text-center">
            Frequently Asked Questions?
          </h2>
          
          {/* Paragraph */}
          <p className="text-center text-lg text-foreground font-ubuntu mb-10">
            Helping You Make Informed Decisions
          </p>

          {/* Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      {openIndex === index ? (
                        <Minus className="w-5 h-5 text-white" />
                      ) : (
                        <Plus className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <span className="font-ubuntu text-[20px] font-semibold text-foreground">
                      {faq.question}
                    </span>
                  </div>
                </button>

                {/* Answer Content */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 pl-16">
                        <p className="text-gray-600 font-ubuntu text-[16px] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
