import { Database, Rocket, Truck, Users } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const growth = () => {
  return (
    <div>
      <div className='py-16'>
        <div className='container mx-auto flex max-lg:flex-col gap-8 max-2xl:px-8 max-md:px-12 max-sm:px-8 justify-between'>
          <div>
            <h2 className='font-fredoka-one font-extrabold  text-5xl max-sm:text-2xl max-lg:text-4xl leading-14 text-foreground mb-6 max-w-2xl'>Take Your Culinary Journey to The Next Level</h2>
            <div className="bg-secondary h-1 w-24  mb-6"></div>

            <div className='space-y-6'>
              <div className='flex items-center gap-4'> 
                <div className='flex justify-center items-center bg-[#FFEDDF] rounded-full w-12 h-12'>
                  <Users className='text-secondary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Reach New Customers</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>Connect with a community actively craving your authentic flavours.</span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex justify-center items-center bg-[#FFEDDF] rounded-full w-12 h-12'>
                  <Rocket className='text-secondary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Streamline Your Operations</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>Use our simple tools to manage orders and track earnings</span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex justify-center items-center bg-[#FFEDDF] rounded-full w-12 h-12'>
                  <Database className='text-secondary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Boost Your Brand</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>Gain visibility through our targeted marketing and promotional campaigns</span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex justify-center items-center bg-[#FFEDDF] rounded-full w-12 h-12'>
                  <Truck className='text-secondary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Join a Community</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>Become part of a supportive network of food entrepreneurs.</span>
                </div>
              </div>
               <div>
                <Link href="/restaurant-signup" className='px-4 py-5 bg-secondary text-white rounded-lg'>Start Earning More Today</Link>
               </div>
            </div>
          </div>
          <div>
            <img src="/chef.png" className='w-full h-full object-cover' alt="" />
          </div>
        </div>

      </div>
    </div>

  )
}

export default growth
