import React from 'react'

const whyChopnow = () => {
    return (
        <div className='bg-white'>
            <div className='px-36 py-20 max-sm:px-18 max-md:px-22 md:px-22 max-lg:py-10 max-2xl:px-6'>
                <div className='flex items-center max-lg:flex-col max-sm:flex-col'>
                    <div className='pt-12 max-sm:pt-0'>
                        <h2 className='font-fredoka-one text-5xl max-sm:text-2xl font-extrabold'>Why ChopNow?</h2>
                        <div className="bg-secondary h-1 w-24  mt-6 mb-6"></div>
                        <p className='font-ubuntu text-[16px] mb-6 max-sm:pr-0 pr-40'>More than just food delivery — we’re about culture,
                            community, and pride.</p>
                        <ul className='flex flex-col gap-4'>
                            <div className='flex gap-4 items-center'>
                                <img src="/tick.png" alt="" />
                                <li className='font-ubuntu text-[15px] text-gray-400 list-none pr-36 max-sm:pr-0 max-md:pr-0'>Proudly African & Caribbean — the first UK platform dedicated to this cuisine.</li>
                            </div>
                            <div className='flex gap-4 items-center'>

                                <img src="/tick.png" alt="" />
                                <li className='font-ubuntu text-[15px] text-gray-400 list-none pr-36 max-sm:pr-0 max-md:pr-0'>Restaurants & Home Chefs — from popular spots to hidden gems, all brought to your door.</li>
                            </div>
                            <div className='flex gap-4 items-center'>

                                <img src="/tick.png" alt="" />
                                <li className='font-ubuntu text-[15px] text-gray-400 list-none pr-36 max-sm:pr-0 max-md:pr-0'>Fast, Fresh Delivery — hot meals delivered quickly by local riders.</li>
                            </div>
                            <div className='flex gap-4 items-center'>

                                <img src="/tick.png" alt="" />
                                <li className='font-ubuntu text-[15px] text-gray-400 list-none pr-36 max-sm:pr-0 max-md:pr-0'>Taste of Home, Anywhere — reconnect with culture, one meal at a time.</li>
                            </div>
                        </ul>
                    </div>
                    <img src="/plate.png" className='w-1/2 max-sm:w-full max-lg:w-full  pt-8 object-cover' alt="" />
                </div>
            </div>
        </div>
    )
}

export default whyChopnow;
