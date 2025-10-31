"use client"

export function AboutHero() {
  return (
    <div className="relative w-full flex items-center justify-center h-[89vh] bg-gradient-to-r from-orange-100 to-orange-200 py-22">
      <img 
        src="/boo.png" 
        alt="About Us Banner" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <img 
          src="/lines.svg" 
          alt="Lines" 
          className="w-80 mx-auto pointer-events-none mb-10 select-none max-sm:w-50" 
        />
        <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-5 max-sm:text-3xl max-sm:mb-2 text-secondary">
          Our Story
        </h1>
          <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-6 max-sm:text-3xl max-sm:mb-2 text-white">
         Our Roots, Our Future
        </h1>
        <p className="font-ubuntu text-white mb-6 text-[18px] text-center max-w-2xl px-4">
          Discover our story and passion for bringing delicious food to your doorstep
        </p>
      </div>
    </div>
  )
}
