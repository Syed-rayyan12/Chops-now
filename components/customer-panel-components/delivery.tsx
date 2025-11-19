import { Users } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

const growth = () => {
  return (
    <div>
      <div className='py-16'>
        <div className='container mx-auto flex gap-10 max-2xl:px-8 max-md:px-12 max-sm:px-8'>
          <div>
            <img src="/deliver.png" className='w-full h-full object-cover rounded-lg' alt="" />
          </div>
           <div>
            <h2 className='font-fredoka-one font-extrabold  text-5xl max-sm:text-2xl max-lg:text-4xl text-foreground mb-6 max-w-2xl'>Turn Your Miles into Meals</h2>
            <div className="bg-primary h-1 w-24  mb-6"></div>

            <div className='space-y-6 '>
              <div className='flex items-center gap-4'>
                <div className='flex justify-center items-center bg-[#DBEAE2] rounded-full w-12 h-12'>
                  <Users className='text-primary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Flexible Earning Opportunities</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>Choose your own hours and work on your schedule</span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex justify-center items-center bg-[#DBEAE2] rounded-full w-12 h-12'>
                  <Users className='text-primary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Reliable Weekly Payouts</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>Get paid promptly every week with no unnecessary delays</span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex justify-center items-center bg-[#DBEAE2] rounded-full w-12 h-12'>
                  <Users className='text-primary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Simple Web App Technology</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>Use our intuitive driver app for a seamless experience.</span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex justify-center items-center bg-[#DBEAE2] rounded-full w-12 h-12'>
                  <Users className='text-primary w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold font-ubuntu text-[17px]'>Join a Community</span>
                  <span className='text-[15px] font-ubuntu text-gray-600'>Become part of a vibrant, supportive network of couriers.</span>
                </div>
              </div>
               <div className='pt-6'>
                <Button variant="part1" className='px-4 py-5 bg-primary'>Start Delivering Now</Button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  )
}

export default growth
