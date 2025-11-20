'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const latestNews = [
  {
    title: 'The Rise of African & Caribbean Food in the UK',
    badge: '4 Oct',
    summary: 'Caribbean flavours are taking the UK storm discover they’re more popular than ever.',
    image: '/blog-3.jpeg',
  },
  {
    title: 'Top 10 Must-Try African & Caribbean Dishes',
    badge: '28 Sep',
    summary: 'From jollof to jerk chicken, here are the dishes you simply can’t miss.',
    image: '/blog-2.jpeg',
  },
  {
    title: 'Healthy Eating with Afro-Caribbean Flavours',
    badge: '20 Sep',
    summary: 'Fresh vegetables and fruits used in African/Caribbean cooking (plantain, callaloo, okra).',
    image: '/blog-1.jpeg',
  },
 
];

const ReadOurLatestNews = () => {
  return (
    <div className="pt-20 pb-40 relative  bg-[url('/featured-bg.jpeg')] bg-cover max-sm:bg-contain bg-center">
      <img src="/patte.png" className='absolute w-80 bottom-0 left-0 opacity-15' alt="" />
      <div>
        <h2 className="font-fredoka-one text-5xl max-sm:text-2xl font-extrabold text-center mb-6 px-44 max-sm:px-4">
       Stories That Celebrate Culture, Food, and Community
        </h2>
        <div className="bg-primary h-1 w-24 mx-auto mb-4"></div>
        <p className='text-[16px] font-ubuntu text-center mb-8'>Discover chef journeys, cultural events, festive flavours, and inspiring traditions.
</p>
      <div className='mx-auto px-36 max-2xl:px-6 max-sm:px-10 max-lg:px-36 '>
        <div className="grid grid-cols-3  max-lg:grid-cols-1 max-lg:gap-34  gap-6">
          {latestNews.map((news, index) => (
            <motion.div
              key={index}
              className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300  h-64"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img src={news.image} alt={news.title} className="w-full h-full object-cover rounded-lg" />
              <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-sm font-ubuntu font-medium">
                {news.badge}
              </div>
              <div className="absolute top-40 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-space-grotesk max-2xl:text-lg text-xl font-bold mb-4">{news.title}</h3>
                <p className="font-ubuntu text-gray-600 text-[14px] max-2xl:scale-[8px]">{news.summary}</p>
               <div className='mt-4'>
                <Link href="" className='text-primary font-ubuntu text-[18px]'>Read More</Link>
               </div>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOurLatestNews;