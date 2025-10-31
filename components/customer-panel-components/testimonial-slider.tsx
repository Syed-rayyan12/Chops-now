'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'John Doe',
    role: 'Food Enthusiast',
    rating: 5,
    message:
      'ChopNow has revolutionized my dining experience. The authentic African and Caribbean flavors delivered right to my door are unbeatable!',
  },
  {
    name: 'Jane Smith',
    role: 'Busy Professional',
    rating: 5,
    message:
      'Fast, fresh, and delicious! I love how ChopNow connects me with local restaurants and home chefs. Highly recommended.',
  },
  {
    name: 'Mike Johnson',
    role: 'Family Man',
    rating: 5,
    message:
      'The best food delivery service for African and Caribbean cuisine. My family enjoys every meal, and the delivery is always on time.',
  },
  {
    name: 'Sarah Williams',
    role: 'Food Blogger',
    rating: 5,
    message:
      'ChopNow brings the taste of home to everyone. The variety and quality of dishes are outstanding. Keep up the great work!',
  },
  {
    name: 'Mike Johnson',
    role: 'Family Man',
    rating: 5,
    message:
      'The best food delivery service for African and Caribbean cuisine. My family enjoys every meal, and the delivery is always on time.',
  },
  {
    name: 'Sarah Williams',
    role: 'Food Blogger',
    rating: 5,
    message:
      'ChopNow brings the taste of home to everyone. The variety and quality of dishes are outstanding. Keep up the great work!',
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
          What Our Customers Say
        </h2>
        <p className='text-[16px] font-ubuntu text-center mb-8 max-sm:px-32'>Real voices, real experiences — hear what our community loves about ChopNow.</p>
         
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
        <div className="block md:hidden grid grid-cols-1 gap-6 max-sm:px-18 max-md:px-14">
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
                  <p className="font-ubuntu text-sm text-gray-500">{testimonial.role}</p>
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
