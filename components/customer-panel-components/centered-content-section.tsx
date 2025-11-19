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
           Ready to Write Your Success Story?
          </h2>
          <div className="bg-secondary h-1 w-24 mx-auto mb-6"></div>
          <p className="text-lg text-white font-ubuntu leading-relaxed">
           Partner with the fastest-growing African & Caribbean food delivery UK platform. Whether you run a
restaurant or deliver meals, join us to share authentic Afro-Caribbean flavours with food lovers
nationwide.
          </p>
        </div>
      </div>
    </section>
  )
}
