import React from 'react'
import { Heart, Users, Award, Sparkles } from 'lucide-react'

const ourValues = () => {
  const values = [
    {
      icon: Heart,
      title: "Authenticity",
      description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. "
    },
    {
      icon: Users,
      title: "Community",
      description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. "
    },
    {
      icon: Award,
      title: "Quality",
      description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. "
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. "
    }
  ]

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8">
        <div className='text-center mb-12'>
          <h2 className='font-fredoka-one font-extrabold text-5xl max-sm:text-2xl max-lg:text-4xl text-foreground mb-4'>
            Our Core Values
          </h2>
          <div className="bg-primary h-1 w-24 mx-auto mb-4"></div>
          <p className='text-xl text-foreground max-w-3xl mx-auto font-ubuntu leading-relaxed'>
            Guided by culture, community, and care.
          </p>
        </div>

        {/* Four Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const IconComponent = value.icon
            return (
              <div 
                key={index}
                className="bg-white shadow-lg rounded-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                {/* Icon with light pink background */}
                <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-secondary" />
                </div>
                
                <h3 className="font-space-grotesk text-primary text-[20px] font-bold mb-4">
                  {value.title}
                </h3>
                <p className="text-foreground text-[16px] font-ubuntu leading-relaxed">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ourValues;
