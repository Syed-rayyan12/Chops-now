"use client";

export function OurPeople() {
  const data = {
    title: "Serving Authentic Culture on Every Plate",
    description: "We know the comfort found in a bowl of rich African soups in UK or the simple joy of perfectly ripe plantain dishes in UK. Whether you're searching for 'Ghanaian food near me delivery' or a taste of home, we bring the heart of our heritage directly to you",
    image: {
      src: "/people.png",
      alt: "Chop Now team collaboration",
    },
  };

  return (
    <section className="py-16 bg-[#F9F3EB]">
      <div className="container mx-auto  max-2xl:px-8 max-md:px-12 max-sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full flex justify-center relative">
            <img src="/Vector.png" alt="Vector decoration" className="absolute bottom-0 right-4 translate-x-4 translate-y-4 z-0" />
            <img src="/Group (1).png" alt="Group decoration" className="absolute top-4 left-10 -translate-x-4 -translate-y-4 z-0" />
            <img src={data.image.src} alt={data.image.alt} className="w-full max-w-xl rounded-lg shadow-lg object-cover relative z-10" />
          </div>
          <div className="w-full">
            <h2 className="font-fredoka-one text-4xl font-extrabold text-foreground mb-4">{data.title}</h2>
            <div className="bg-secondary h-1 w-24 mb-6"></div>
            <p className="text-lg text-foreground font-ubuntu leading-relaxed">{data.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
