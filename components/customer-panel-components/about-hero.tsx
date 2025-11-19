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
         Bringing
        </h1>
          <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-6 max-sm:text-3xl max-sm:mb-2 text-white">
        Caribbean Food Delivery UK 
        </h1>
          <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-6 max-sm:text-3xl max-sm:mb-2 text-white">
       Straight to Your Doorstep
        </h1>
        <p className="font-ubuntu text-white mb-6 text-[18px] text-center max-w-2xl px-4">
          Enjoy authentic flavours with reliable African food delivery UK service.
        </p>
      </div>
    </div>
  )
}
