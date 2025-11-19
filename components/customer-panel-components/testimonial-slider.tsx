'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Isabella Clarke',
    rating: 5,
    message:
      "Finally, a place to order Caribbean dishes in the UK that tastes like my grandma's cooking. The oxtail was pure perfection. I'm hooked!",
  },
  {
    name: 'Ben Adebayo',
    rating: 5,
    message:
      'The jerk chicken in the UK I had from ChopNow was unbelievably good. Perfectly spiced and so tender. It’s the real deal, no doubt!',
  },
  {
    name: 'Chantelle Williams',
    rating: 5,
    message:
      'I was able to order Nigerian jollof rice online in the UK for a party. It was a massive hit! So flavourful and authentic.',
  },
  {
    name: 'David Okoro',
    rating: 5,
    message:
      'As a student far from home, finding proper fufu restaurants in London was hard. ChopNow delivered it right to me, and it tasted just like home. A lifesaver!',
  },
  {
    name: 'Michelle Johnson',
    rating: 5,
    message:
      "This is my go-to African restaurant in London, even though it's delivery! The quality is consistently fantastic, and the delivery is always swift.",
  },
  {
    name: 'Samuel Jones',
    rating: 5,
    message:
      'I never knew there were so many ways to enjoy plantain dishes in the UK! The plantain porridge was a delicious and comforting discovery. Highly recommend!',
  },
];


// Prepare testimonials for two rows
const row1Testimonials = [
  ...testimonials.slice(0, 4),

];
const row2Testimonials = [
  ...testimonials.slice(1, 4),

];

const TestimonialSlider = () => {
  return (
    <div className=" py-20 relative bg-[#F9F3EB]">
      <img src="/patte-left.png" className='absolute w-80 top-0 right-0 opacity-15' alt="" />
      <div>
        <h2 className="font-fredoka-one text-5xl max-sm:text-2xl  font-extrabold text-center mb-6">
    Served with a Side of Smiles
        </h2>
        <p className='text-[16px] font-ubuntu text-center mb-8 max-sm:px-12'>Stories That Celebrate Culture, Food, and Community</p>
         
        {/* Slider for screens 768px and above */}
        <div className="hidden md:block space-y-8">
          {/* Row 1 */}
          <div className="overflow-hidden w-full">
            <motion.div
              className="flex space-x-6"
              animate={{ x: ['0%', '-30%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              {row1Testimonials.map((testimonial, index) => (
                <div
                  key={`row1-${index}`}
                  className="bg-white mt-8 p-6 rounded-lg shadow-md flex-shrink-0 w-[600px] h-full"
                >

                  <div className="flex items-center mb-2">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <span key={i} className="text-secondary">★</span>
                    ))}
                  </div>
                  <p className="font-ubuntu text-gray-600 mb-4 text-[16px]">
                    "{testimonial.message}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-ubuntu font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-ubuntu font-bold">{testimonial.name}</h4>
                      <p className="font-ubuntu text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 2 */}
          <div className="overflow-hidden w-full">
            <motion.div
              className="flex space-x-6"
              animate={{ x: ['-30%', '0%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              {row2Testimonials.map((testimonial, index) => (
                <div
                  key={`row2-${index}`}
                  className="bg-white p-6 rounded-lg shadow-md flex-shrink-0 w-[600px] h-full"
                >
                  <div className="flex items-center mb-2">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <span key={i} className="text-secondary">★</span>
                    ))}
                  </div>
                  <p className=" text-gray-600 mb-4 text-[16px] font-ubuntu">
                    "{testimonial.message}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-ubuntu font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-ubuntu font-bold">{testimonial.name}</h4>
                      <p className="font-ubuntu text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Cards for screens below 768px */}
        <div className="block md:hidden grid grid-cols-1 gap-6 max-sm:px-10 max-md:px-14">
          {testimonials.map((testimonial, index) => (
            <div
              key={`mobile-${index}`}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-2">
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <span key={i} className="text-secondary">★</span>
                ))}
              </div>
              <p className="font-ubuntu text-gray-600 mb-4 text-[16px]">
                "{testimonial.message}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-ubuntu font-bold mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-ubuntu font-bold">{testimonial.name}</h4>
                  <p className="font-ubuntu text-sm text-gray-500">{testimonial.rating}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
