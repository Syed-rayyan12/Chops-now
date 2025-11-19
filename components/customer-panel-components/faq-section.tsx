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
    question: "How do I order food from ChopNow?",
    answer:
      "To order, use the ChopNow web app or visit our website, browse menus from authentic African and Caribbean restaurants, select your dishes, and place your order for fast, convenient delivery."
  },
  {
    question: "Can I become a ChopNow restaurant partner?",
    answer:
      "Yes! Any home cook or restaurant offering African or Caribbean cuisine can join. We provide support, platform access, and exposure to customers seeking authentic flavours across the UK."
  },
  {
    question: "How can I become a ChopNow delivery driver?",
    answer:
      "Sign up via our website, submit your details, undergo verification, and start delivering Afro-Caribbean dishes to customers in your area, earning flexible income on your schedule."
  },
  {
    question: "Which cities do you deliver to in the UK?",
    answer:
      "ChopNow currently serves major UK cities, including London, Birmingham, Manchester, Leeds, Liverpool, and Glasgow, with plans to expand further, bringing authentic African and Caribbean meals closer to every community."
  },
  {
    question: "Are the restaurants and cooks verified?",
    answer:
      "Yes, ChopNow carefully vets all restaurant partners and home cooks, ensuring food safety, authenticity, and quality, so customers can confidently enjoy traditional African and Caribbean meals anytime."
  },
  {
    question: "Does ChopNow offer catering for events?",
    answer:
      "Yes, ChopNow provides group and event catering options. You can order authentic African and Caribbean dishes for parties, cultural events, or gatherings, celebrating heritage with friends, family, and colleagues."
  }
];


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
            What is ChopNow?
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
