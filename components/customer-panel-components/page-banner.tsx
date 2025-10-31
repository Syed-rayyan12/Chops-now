import { Bike } from "lucide-react"
import { Button } from "../ui/button"

interface PageBannerProps {
    // Heading parts rendered in a single row when possible
    highlightedWord?: string
    title: string
    highlightedWord2?: string

    // Supporting content
    description: string

    // Optional inline image to place alongside the heading parts
    inlineImageSrc?: string
    inlineImageAlt?: string

    // Layout: when true, image appears above the heading (column-first image)
    imageOnTop?: boolean
}

export function PageBanner({ highlightedWord, title, highlightedWord2, description, inlineImageSrc, inlineImageAlt, imageOnTop }: PageBannerProps) {
    return (
        <div className="relative w-full flex  items-center justify-center h-[90vh] bg-gradient-to-r from-orange-100 to-orange-200">
            <img
                src="/boo.png"
                alt={`${title} Banner`}
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                {/* Optional top image shown before heading */}
                {imageOnTop && inlineImageSrc && (
                    <div className="mb-6">
                        <img
                            src={inlineImageSrc}
                            alt={inlineImageAlt || "Banner decoration"}
                            className="w-80 mx-auto pointer-events-none select-none max-sm:w-48"
                        />
                    </div>
                )}
                {/* Heading row: highlightedWord + title + highlightedWord2 + optional image */}
                <div className="mb-8">
                    <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl max-sm:text-3xl text-white flex items-center justify-center gap-3 md:flex-nowrap flex-wrap">
                         <span className="whitespace-nowrap">{title}</span>
                         {highlightedWord2 && (
                             <span className="text-secondary whitespace-nowrap">{highlightedWord2}</span>
                         )}
                        {highlightedWord && (
                            <span className="text-white whitespace-nowrap">{highlightedWord}</span>
                        )}
                        
                        {!imageOnTop && inlineImageSrc && (
                            <img
                                src={inlineImageSrc}
                                alt={inlineImageAlt || "Banner decoration"}
                                className="h-10 w-auto max-sm:h-7 pointer-events-none select-none"
                            />
                        )}
                    </h1>
                </div>

                <p className="text-white max-w-3xl mx-auto font-ubuntu leading-relaxed text-center px-4">
                    {description}
                </p>
                <div className="flex gap-4">

                    <div className="pt-8">
                        <Button variant="part1" className="text-white bg-secondary rounded-lg px-7 py-5 text-[15px]">Partner With Us</Button>
                    </div>
                    <div className="pt-8">

                        <Button variant="part2" className="text-secondary bg-white flex gap-2 rounded-lg px-7 py-5 text-[15px]">
                            <Bike className=" inline-block" />
                            Deliver With Us
                            </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
