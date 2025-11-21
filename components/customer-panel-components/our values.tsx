import React from 'react'
import { Heart, Users, Award, Sparkles } from 'lucide-react'

const ourValues = () => {
 const values = [
  {
    icon: Heart,
    title: "Authenticity",
    description:
      "We honour real flavours, real stories, and real roots. Every dish reflects heritage, tradition, and the cooks who pour heart."
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We support responsible cooking, mindful sourcing, and conscious habits. By uplifting local chefs and reducing waste, we strengthen our community."
  },
  {
    icon: Award,
    title: "Quality",
    description:
      "People come first. We create space for connection, celebration, and opportunity. Every order supports a cook, a family, and a future."
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description:
      "Taste drives us. Bold spices, comforting stews, rich textures; the kind of flavours that feel like home and inspire new possibilities."
  }
];


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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-md:grid-cols-1 gap-6 max-w-6xl mx-auto">
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
