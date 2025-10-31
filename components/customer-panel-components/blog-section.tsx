'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../ui/button';

const blogPosts = [
  {
    title: 'The Rise of African & Caribbean Food in the UK',
    badge: '4 Oct',
    summary: 'Caribbean flavours are taking the UK storm discover they are more popular than ever.',
    image: '/blog-3.jpeg',
  },
  {
    title: 'Top 10 Must-Try African & Caribbean Dishes',
    badge: '28 Sep',
    summary: 'From jollof to jerk chicken, here are the dishes you simply cannot miss.',
    image: '/blog-2.jpeg',
  },
  {
    title: 'Healthy Eating with Afro-Caribbean Flavours',
    badge: '20 Sep',
    summary: 'Fresh vegetables and fruits used in African/Caribbean cooking (plantain, callaloo, okra).',
    image: '/blog-1.jpeg',
  },
  {
    title: 'The History of Jollof Rice',
    badge: '15 Sep',
    summary: 'Discover the origins and cultural significance of West Africa most beloved dish.',
    image: '/blog-0.png',
  },
  {
    title: 'Caribbean Street Food Guide',
    badge: '10 Sep',
    summary: 'Explore the vibrant world of Caribbean street food from doubles to patties.',
    image: '/blogpost-1.png',
  },
  {
    title: 'Cooking with Plantains',
    badge: '5 Sep',
    summary: 'Learn different ways to prepare this versatile ingredient in your kitchen.',
    image: '/blogpost-2.png',
  },
  {
    title: 'Spice Blends of the Caribbean',
    badge: '1 Sep',
    summary: 'A deep dive into the aromatic spice mixes that define Caribbean cuisine.',
    image: '/blogpost-3.png',
  },
  {
    title: 'African Soups and Stews',
    badge: '25 Aug',
    summary: 'Warm, hearty, and full of flavor - explore traditional African comfort food.',
    image: '/blogpost-4.png',
  },
  {
    title: 'The Art of Grilling Suya',
    badge: '20 Aug',
    summary: 'Master the technique of making this spicy Nigerian street food favorite.',
    image: '/blogpost-5.png',
  },
];

const BlogSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className=" mb-12">
          <h2 className="font-fredoka-one text-5xl max-sm:text-2xl max-lg:text-4xl font-extrabold text-foreground mb-6">
         Chop Stories or From Our Kitchen to Yours
          </h2>
          <div className="bg-secondary h-1 w-24 mb-4"></div>
          <p className="text-lg text-foreground max-w-3xl  font-ubuntu leading-relaxed">
            Fresh flavours, fresh stories — straight from ChopNow.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-28 gap-4 max-w-7xl mx-auto">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-64"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover rounded-lg" 
              />
              <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-lg text-sm font-ubuntu font-medium">
                {post.badge}
              </div>
              <div className="absolute top-40 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-space-grotesk text-lg font-bold mb-2 text-foreground">
                  {post.title}
                </h3>
                <p className="font-ubuntu text-gray-600 text-sm mb-3">
                  {post.summary}
                </p>
                <Link 
                  href="/blog" 
                  className="text-secondary font-ubuntu text-base hover:underline"
                >
                  Read More
                </Link>
              </div>
            </motion.div>
          ))}
        
        </div>
          <div className='flex justify-center items-center'>
            <Button className='rounded-lg bg-transprent border border-secondary hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out text-secondary px-8 py-4'>
                Load More Stories
            </Button>
          </div>
      </div>
    </div>
  );
};

export default BlogSection;
