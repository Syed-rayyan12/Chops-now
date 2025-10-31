import Link from 'next/link';
import React from 'react';

const ImageBgSection: React.FC = () => {
  return (
    <section className="bg-[url('/niga.jpeg')] bg-cover bg-center h-[518px] max-sm:h-full max-sm:py-10 mt-[80px] flex items-center justify-start">
      <div className='px-36 max-2xl:px-8 max-sm:px-18 max-md:px-14 md:px-14 mx-auto w-full'>
      <div className=''>
        <h2 className='font-fredoka-one font-extrabold text-5xl max-sm:text-2xl mb-4 text-white text-left'>Ready to Chop Now?</h2>
        <div className="bg-secondary h-1 w-24 mt-8"></div>
        <p className='font-ubuntu text-white mt-8 max-w-lg'>Join thousands celebrating African & Caribbean flavours. Place your first order today.</p>
        <div className='mt-10'>
          <Link href="" className='bg-white text-secondary px-10 py-4 text-[16px] border border-transparent hover:bg-transparent ease-in duration-300 hover:border-secondary rounded-[10px]'>
            Start Your Order
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
};

export default ImageBgSection;