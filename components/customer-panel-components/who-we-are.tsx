import { Phone } from 'lucide-react';
import React from 'react';

const WhoWeAre = () => {
    return (
        <section
            className="relative bg-[#F9F3EB]  flex items-center justify-center"
        >
            <img
                src="/patte.png"
                alt="patte"
                className="absolute top-0 left-0 w-80 pointer-events-none select-none" />

            <div className="container mx-auto px-24 max-2xl:scale-[0.98] max-2xl:px-0 max-sm:px-8 max-sm:py-20 pt-18 z-20 text-center text-white">
                <div className="flex max-sm:flex-col max-lg:flex-col max-xl:flex-col max-xl:px-44 max-lg:px-6  max-sm:gap-6 gap-8 justify-around items-center">
                    <div className="flex flex-col gap-10 z-3 max-lg:w-full max-xl:w-full">
                        {[
                            { img: "/who-4.svg", text: "Freshly Prepared Meals" },
                            { img: "/who-1.svg", text: "Fast & Reliable Delivery" },
                            { img: "/who-2.svg", text: "Speed You Can Trust" },
                            { img: "/who-3.svg", text: "Trusted Quality & Service" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="relative bg-white flex items-center px-5 gap-6 font-space-grotesk font-bold w-82 h-22 max-lg:w-full max-xl:w-full rounded-[40px]"
                            >
                                {/* Custom border */}
                                <span className="absolute inset-0 translate-x-1 translate-y-1 -z-10 rounded-[40px] border-t-[2px] border-r-[333px] max-sm:border-r-[303px] border-b-[50px] border-l-0 border-orange-500">
                                </span>

                                <img src="/vector.svg" className="w-12 h-12 absolute -right-6 top-6 text-foreground" alt="" />
                                {/* Icon */}
                                <img src={item.img} className="w-10 h-10 text-primary" alt="" />

                                {/* Text */}
                                <span className="text-foreground">{item.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className='relative flex-shrink-0  max-lg:w-full max-xl:w-full'>
                        <img src="/arrow.png" className='absolute top-0 max-lg:hidden max-xl:hidden -left-20' alt="" />
                        <img src="/man.png" className='w-full h-full' alt="" />
                    </div>
                    <div className='text-left max-lg:mt-8'>
                        <h2 className='font-fredoka-one text-5xl mb-5 max-sm:text-2xl text-foreground font-extrabold'>Who We Are</h2>
                        <div className="bg-secondary h-1 w-24 mb-5"></div>
                        <p className='text-[16px] text-foreground font-ubuntu'>ChopNow is the UK’s first African & Caribbean food delivery platform, created to bring the authentic taste of home straight to your door. Rooted in culture and community, we proudly connect food lovers with the dishes they grew up with, from spicy Jollof to smoky Jerk chicken. Our mission is simple — to celebrate our heritage and make Afro-Caribbean cuisine accessible anytime, anywhere.</p>
                        <div className='flex gap-4 items-center pt-6 relative'>
                            <img src="/arrow-one.svg" className='absolute top-20 max-xl:hidden -left-5' alt="" />
                                <div className='bg-primary rounded-full flex justify-center w-12 h-12 items-center'>
                                 <Phone/>
                                </div>
                            <div>
                                <h1 className='font-ubuntu text-foreground font-semibold'>How to Order?</h1>
                                <span className='text-secondary text-[16px] font-ubuntu'>Call Us: +44 20 7946 0123</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhoWeAre;