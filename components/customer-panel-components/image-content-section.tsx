"use client"

interface ImageContentSectionProps {
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  buttonText?: string
  buttonLink?: string
  reverse?: boolean
}

export function ImageContentSection({
  imageSrc,
  imageAlt,
  title,
  description,
  buttonText,
  buttonLink,
  reverse = false
}: ImageContentSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8">
        <div className="flex justify-between max-sm:flex-col items-center gap-6">
          {/* Image Side */}
          <div className="w-full flex justify-center relative">
            {/* Vector and Group images */}
            <img
              src="/vector.png"
              alt="Vector decoration"
              className="absolute bottom-0 right-4 w-50 h-50 translate-x-4 translate-y-4 "
            />
            <img
              src="/Group (1).png"
              alt="Group decoration"
              className="
              absolute top-4 left-10 w-50 h-50 -translate-x-4 -translate-y-4 
              "
            />
            
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-[70%] h-full object-cover relative z-0"
            />
          </div>

          {/* Content Side */}
          <div className="w-full ">
            <h2 className="text-4xl font-bold text-foreground mb-6 font-fredoka-one leading-14">
              {title}
            </h2>
            <div className="bg-secondary h-1 w-24  mb-4"></div>
            <p className="text-lg text-gray-600 mb-6 font-ubuntu leading-10">
              {description}
            </p>
          
          </div>
        </div>
      </div>
    </section>
  )
}
