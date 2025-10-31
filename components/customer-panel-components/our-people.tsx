﻿"use client";

export function OurPeople() {
  const data = {
    title: "From Our People, For Our People",
    description: "Every meal we deliver starts with passion from the chefs in local kitchens to the couriers on the move. At Chop Now, we are proud to represent Afro-Caribbean culture through hard work, unity, and real flavor. This is more than a job it is a movement powered by people and purpose.",
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
            <img src="/vector.png" alt="Vector decoration" className="absolute bottom-0 right-4 translate-x-4 translate-y-4" />
            <img src="/Group (1).png" alt="Group decoration" className="absolute top-4 left-10 -translate-x-4 -translate-y-4" />
            <img src={data.image.src} alt={data.image.alt} className="w-full max-w-xl rounded-lg shadow-lg object-cover" />
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
