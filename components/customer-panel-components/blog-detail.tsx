'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BlogDetailProps {
  blog: {
    title: string;
    date: string;
    image: string;
    content: string;
  };
}

export function BlogDetail({ blog }: BlogDetailProps) {
  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/blog" className="flex items-center gap-2 text-secondary hover:text-secondary/80 font-ubuntu font-medium">
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>
      </div>

      {/* Hero Section with Image */}
      <div className="w-full h-96 relative overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
          <div className="container mx-auto">
            <div className="bg-secondary text-white px-3 py-1 rounded-lg text-sm font-ubuntu font-medium inline-block mb-4">
              {blog.date}
            </div>
            <h1 className="font-fredoka-one text-white text-4xl md:text-5xl font-bold">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <div 
            className="font-ubuntu text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: blog.content
                .replace(/<h2>/g, '<h2 class="font-fredoka-one text-4xl font-bold mt-8 mb-4 text-foreground">')
                .replace(/<h3>/g, '<h3 class="font-space-grotesk text-2xl font-bold mt-6 mb-3 text-foreground">')
                .replace(/<p>/g, '<p class="text-gray-700 mb-4 leading-relaxed">')
                .replace(/<strong>/g, '<strong class="font-bold">')
                .replace(/<em>/g, '<em class="italic">')
            }}
          />
        </div>

        {/* Related Articles Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="font-fredoka-one text-2xl font-bold mb-6 text-foreground">More Blog Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
          </div>
        </div>
      </div>
    </div>
  );
}
