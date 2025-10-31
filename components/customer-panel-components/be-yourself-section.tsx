"use client"

import { Users, HeartHandshake, Rocket, Sparkles, Lightbulb } from "lucide-react"

export function BeYourselfSection() {
  const items = [
    {
      icon: Users,
      title: "Authenticity",
      desc: "Stay true to our roots.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      desc: "Build the future of food delivery.",
    },
    {
    icon: HeartHandshake,
      title: "Community",
      desc: "We rise by lifting others.",
    },
    {
      icon: Sparkles,
      title: "Growth",
      desc: "Empowering people to thrive.",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-26  max-md:px-12 max-sm:px-8">
        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="font-fredoka-one text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
            You can be yourself here.
          </h2>
          <div className="bg-primary h-1 w-24 mx-auto mb-5"></div>
          <p className="text-lg text-foreground font-ubuntu">
            Our roots are diverse, our flavors even more so. At Chop Now, individuality is celebrated — because every person brings a new spice to the mix.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="bg-white shadow-lg rounded-lg p-6 text-center">
                <Icon className="w-10 h-10 text-secondary mx-auto mb-4" />
                <h3 className="font-space-grotesk text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 font-ubuntu">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
