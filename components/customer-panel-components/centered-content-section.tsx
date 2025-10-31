export function CenteredContentSection() {
  return (
    <section 
      className="py-16 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/ban.png')" }}
    >
      {/* Overlay for content visibility */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: 0.4 }}
      ></div>

      <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="font-fredoka-one text-4xl lg:text-5xl font-bold text-white mb-6">
           Powered by People, Grounded in Culture
          </h2>
          <div className="bg-secondary h-1 w-24 mx-auto mb-6"></div>
          <p className="text-lg text-white font-ubuntu leading-relaxed">
            Every partner, every courier, every dish — they all tell a story. At Chop Now, we believe in uplifting food creators and delivery heroes from Afro-Caribbean roots. Together, we're making every meal meaningful.
          </p>
        </div>
      </div>
    </section>
  )
}
