interface ContentWithImageProps {
  heading: string
  paragraph: string
  paragraph2: string
  imageSrc: string
  imageAlt?: string
}

export function ContentWithImage({ heading, paragraph, paragraph2, imageSrc, imageAlt = "Content Image" }: ContentWithImageProps) {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <div>
            <h2 className="font-fredoka-one text-4xl font-extrabold text-foreground mb-4">
              {heading}
            </h2>
            <div className="bg-secondary h-1 w-24 mb-6"></div>
            <p className="text-lg text-foreground font-ubuntu leading-relaxed mb-6">
              {paragraph}
            </p>
             <p className="text-lg text-foreground font-ubuntu leading-relaxed">
              {paragraph2}
            </p>
          </div>

          {/* Right Side - Image */}
          <div>
            <img 
              src={imageSrc}
              alt={imageAlt}
              className="w-full  rounded-lg  object-cover"
            />
          </div>

        </div>
      </div>
    </div>
  )
}
