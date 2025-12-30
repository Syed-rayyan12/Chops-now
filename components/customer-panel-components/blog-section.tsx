'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../ui/button';

const blogPosts = [
  {
    slug: 'how-jollof-rice-unites-west-africa-with-the-world',
    title: 'How Jollof Rice Unites West Africa with The World',
    badge: '4 Oct',
    summary: 'Discover how this iconic dish bridges cultures and continents.',
    image: '/blog-3.jpeg',
  },
  {
    slug: 'top-10-must-try-caribbean-dishes-in-london',
    title: 'Top 10 Must-Try Caribbean Dishes in London',
    badge: '28 Sep',
    summary: 'Explore the best Caribbean flavors available in the UK capital.',
    image: '/blog-2.jpeg',
  },
  {
    slug: 'why-niche-delivery-platforms-are-changing-uk-food-culture',
    title: 'Why Niche Delivery Platforms Are Changing UK Food Culture',
    badge: '20 Sep',
    summary: 'How specialized food delivery is transforming dining habits.',
    image: '/blog-1.jpeg',
  },
  {
    slug: 'celebrating-carnival-on-a-plate-the-colourful-food-traditions-of-notting-hill',
    title: 'Celebrating Carnival on a Plate: The Colourful Food Traditions of Notting Hill',
    badge: '15 Sep',
    summary: 'Vibrant foods that capture the spirit of Notting Hill Carnival.',
    image: '/blog-0.png',
  },
  {
    slug: 'which-african-soups-in-uk-you-must-try-in-2026',
    title: 'Which African Soups in UK You Must Try in 2026',
    badge: '10 Sep',
    summary: 'A guide to must-try African soups available in the UK.',
    image: '/blogpost-1.png',
  },
  {
    slug: 'secret-ingredient-authentic-jerk-marinade',
    title: 'What’s the Secret Ingredient in Authentic Jerk Marinade? (It’s Not What You Think)',
    badge: '5 Sep',
    summary: 'Uncover the surprising key to perfect jerk marinade.',
    image: '/blogpost-2.png',
  },
  
  {
    slug: 'why-coconut-milk-is-crucial-ingredient-in-caribbean-cooking',
    title: 'Why Coconut Milk Is Crucial Ingredient in Caribbean Cooking?',
    badge: '25 Aug',
    summary: 'Challenge your taste buds with these adventurous dishes.',
    image: '/blogpost-4.png',
  },
  {
    slug: 'would-you-try-it-5-bold-afro-caribbean-dishes-that-dare-you',
    title: 'Would You Try It? 5 Bold Afro-Caribbean Dishes That Dare You',
    badge: '20 Aug',
    summary: 'The rising popularity of pounded yam in British cuisine.',
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
        Celebrate African and Caribbean Flavours Through Inspiring Stories
          </h2>
          <div className="bg-secondary h-1 w-24 mb-4"></div>
          <p className="text-lg text-foreground max-w-3xl  font-ubuntu leading-relaxed">
            Read chef journeys, cultural events, and authentic recipes celebrating African and Caribbean cuisine
across the UK
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-28 gap-4 max-w-7xl mx-auto">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-64 group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/blog/${post.slug}`} className="block w-full h-full">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover rounded-lg cursor-pointer" 
                />
              </Link>
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
                  href={`/blog/${post.slug}`} 
                  className="text-secondary font-ubuntu text-base hover:underline font-semibold"
                >
                  Read More →
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
