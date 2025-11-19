import React from 'react'
import { Utensils, Rocket, Megaphone, ShieldCheck, CheckCircle, Bolt, BoltIcon, GraduationCap, Sheet, Zap } from 'lucide-react'

// Centered section with heading, primary line, paragraph, and four cards
// Cards match the style of "Our Values" but with different content
export default function CenteredValuesSection() {
  const items = [
    {
      icon: Sheet,
      title: 'Apply Online',
      description:
        'Submit your details through our online form.',
    },
    {
      icon: CheckCircle,
      title: 'Connect',
      description:
        'Have a quick chat with our friendly team.',
    },
    {
      icon: GraduationCap,
      title: 'Onboard',
      description:
        'Get set up with your personalised partner portal',
    },
    {
      icon: Zap,
      title: 'Earn',
      description:
        'Start receiving orders and growing your business immediately.',
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-fredoka-one font-extrabold text-5xl max-sm:text-2xl max-lg:text-4xl text-foreground mb-4">
       Your Path to Partnership is Simple
          </h2>
          <div className="bg-primary h-1 w-24 mx-auto mb-4"></div>
          <p className="text-xl text-foreground max-w-3xl mx-auto font-ubuntu leading-relaxed">
     Get started in just four quick and easy steps
          </p>
        </div>

        {/* Four Cards Grid (same style as Our Values) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                {/* Icon with light pink circle background */}
                <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-secondary" />
                </div>

                <h3 className="font-space-grotesk text-primary text-[20px] font-bold mb-4">
                  {item.title}
                </h3>
                <p className="text-foreground text-[16px] font-ubuntu leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
