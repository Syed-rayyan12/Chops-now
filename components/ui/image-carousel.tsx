"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
  showThumbnails?: boolean
  autoPlay?: boolean
}

export function ImageCarousel({ 
  images, 
  alt, 
  className,
  showThumbnails = false,
  autoPlay = false 
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Handle empty or single image
  if (!images || images.length === 0) {
    return (
      <img
        src="/placeholder.svg"
        alt={alt}
        className={cn("w-full h-full object-cover", className)}
      />
    )
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0] || "/placeholder.svg"}
        alt={alt}
        className={cn("w-full h-full object-cover", className)}
      />
    )
  }

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToSlide = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex(index)
  }

  return (
    <div className={cn("relative w-full h-full group", className)}>
      {/* Main Image */}
      <img
        src={images[currentIndex] || "/placeholder.svg"}
        alt={`${alt} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-secondary opacity-0  transition-opacity z-10 h-8 w-8 rounded-full shadow-lg"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-secondary opacity-0  transition-opacity z-10 h-8 w-8 rounded-full shadow-lg"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToSlide(index, e)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/60 hover:bg-white/90"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Navigation (optional) */}
      {showThumbnails && images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={(e) => goToSlide(index, e)}
                className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all",
                  index === currentIndex
                    ? "border-white scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md z-10">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
