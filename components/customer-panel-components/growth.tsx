import { Database, Rocket, Truck, Users } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

const growth = () => {
  return (
    <div>
      <div className='py-16'>
        <div className='container mx-auto flex  max-2xl:px-8 max-md:px-12 max-sm:px-8'>
          <div>
            <h2 className='font-fredoka-one font-extrabold  text-5xl max-sm:text-2xl max-lg:text-4xl leading-14 text-foreground mb-6 max-w-2xl'>Grow Your Kitchen with Chop Now</h2>
            <div className="bg-secondary h-1 w-24  mb-6"></div>

            <div className='space-y-6 '>
              <div className='flex items-center gap-4'> 
                <div className='flex justify-center items-center bg-[#FFEDDF] rounded-full w-12 h-12'>
                  <Users className='text-secondary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Reach New Customers</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>Let us bring your Afro-Caribbean flavors to more tables.  </span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex justify-center items-center bg-[#FFEDDF] rounded-full w-12 h-12'>
                  <Rocket className='text-secondary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Seamless Onboarding</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>Quick setup, zero technical hassle.</span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex justify-center items-center bg-[#FFEDDF] rounded-full w-12 h-12'>
                  <Database className='text-secondary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Marketing Support</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>We promote your restaurant through the app and campaigns.</span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex justify-center items-center bg-[#FFEDDF] rounded-full w-12 h-12'>
                  <Truck className='text-secondary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Reliable Logistics</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>We handle delivery, so you can focus on cooking.</span>
                </div>
              </div>
               <div>
                <Button variant="part1" className='px-4 py-5'>Sign Up Your Restaurant Now</Button>
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
