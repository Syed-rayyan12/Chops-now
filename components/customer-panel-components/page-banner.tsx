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
                <div className="mb-8 text-center px-4 sm:px-8 lg:px-40">
                    <h1 className="font-fredoka-one font-bold text-3xl  md:text-5xl lg:text-5xl text-white flex items-center text-center justify-center gap-3 flex-wrap">
                        <span>{title}</span>
                        {highlightedWord2 && (
                            <span className="text-secondary">{highlightedWord2}</span>
                        )}
                        {highlightedWord && (
                            <span className="text-white">{highlightedWord}</span>
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
                <div className="flex items-center max-sm:flex-col max-md:flex-col gap-4">

                    <div className="flex gap-4">

                        <div className="pt-8">
                            <Button variant="part1" className="text-white bg-secondary rounded-lg px-7 py-5 text-[15px]">Become Part of Our Partner Chefs</Button>
                        </div>

                    </div>
                    <div className="flex gap-4">

                        <div className="pt-8">
                            <Button variant="part1" className="text-white bg-secondary rounded-lg px-7 py-5 text-[15px]">Join As A Courier</Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
