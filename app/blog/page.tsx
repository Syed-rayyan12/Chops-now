import { Header } from '@/components/customer-panel-components/header';
import { Footer } from '@/components/customer-panel-components/footer';
import BlogSection from '@/components/customer-panel-components/blog-section';
import { Newsletter } from '@/components/newsletter';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative w-full flex items-center justify-center h-full py-42 bg-gradient-to-r from-orange-100 to-orange-200">
        <img 
          src="/boo.png" 
          alt="Blog Banner" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <img 
            src="/lines.svg" 
            alt="Lines" 
            className="w-80 mx-auto pointer-events-none mb-10 select-none max-sm:w-50" 
          />
          <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-5 max-sm:text-3xl max-sm:mb-2 text-white">
            <span className='text-secondary font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-5 max-sm:text-3xl max-sm:mb-2'>Our</span> Blogs
          </h1>
          <p className='text-white max-w-3xl mx-auto font-ubuntu leading-relaxed'>
Explore culture, cuisine, and stories through our vibrant blogs.
          </p>
        </div>
      </div>

      <BlogSection />
      <Newsletter/>
      <Footer />
    </div>
  );
}
