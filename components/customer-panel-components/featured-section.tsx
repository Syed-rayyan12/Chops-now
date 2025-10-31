"use client"

interface FeaturedSectionProps {
  title: string
  description: string
  features?: {
    imageSrc?: string
    title: string
    description: string
  }[]
}

export function FeaturedSection({
  title,
  description,
  features
}: FeaturedSectionProps) {
  return (
    <section 
      className="py-20 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/featured-bg.jpeg')" }}
    >
      {/* Overlay for better text readability */}
  
      
      <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-foreground mb-6 font-fredoka-one">
            {title}
          </h2>
            <div className="bg-secondary h-1 w-24 mx-auto mb-4"></div>
          <p className="text-xl text-foreground max-w-3xl mx-auto font-ubuntu leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features Grid */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="border border-secondary bg-white  p-4 rounded-lg e/20
                 transition-all duration-300"
              >
                {feature.imageSrc && (
                  <img 
                    src={feature.imageSrc} 
                    alt={feature.title}
                    className="w-full object-cover mb-4"
                  />
                )}
                <h3 className="text-[20px] font-bold text-primary  mb-3 font-space-gorotesk">
                  {feature.title}
                </h3>
                <p className="text-[16px] font-ubuntu text-foreground leading-7">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
