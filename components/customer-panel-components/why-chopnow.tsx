import React from 'react'

const whyChopnow = () => {
    return (
        <div className='bg-white'>
            <div className='px-36 py-20 max-sm:px-10 max-md:px-22 md:px-22 max-lg:py-10 max-2xl:px-6'>
                <div className='flex items-center max-lg:flex-col max-sm:flex-col'>
                    <div className='pt-12 max-sm:pt-0'>
                        <h2 className='font-fredoka-one text-5xl max-sm:text-2xl font-extrabold'>Why ChopNow?</h2>
                        <div className="bg-secondary h-1 w-24  mt-6 mb-6"></div>
                        <p className='font-ubuntu text-[16px] mb-6 max-sm:pr-0 pr-40'>Because we bring homemade African soups in UK straight to you.</p>
                        <ul className='flex flex-col gap-4'>
                            <div className='flex gap-4 items-center'>
                                <img src="/tick.png" alt="" />
                                <li className='font-ubuntu text-[15px] text-gray-400 list-none pr-36 max-sm:pr-0 max-md:pr-0'>We are the first black-owned food delivery platform in UK.</li>
                            </div>
                            <div className='flex gap-4 items-center'>

                                <img src="/tick.png" alt="" />
                                <li className='font-ubuntu text-[15px] text-gray-400 list-none pr-36 max-sm:pr-0 max-md:pr-0'>Discover the top Caribbean dishes to try in London</li>
                            </div>
                            <div className='flex gap-4 items-center'>

                                <img src="/tick.png" alt="" />
                                <li className='font-ubuntu text-[15px] text-gray-400 list-none pr-36 max-sm:pr-0 max-md:pr-0'>We specialise in authentic traditional Nigerian dishes in UK</li>
                            </div>
                            <div className='flex gap-4 items-center'>

                                <img src="/tick.png" alt="" />
                                <li className='font-ubuntu text-[15px] text-gray-400 list-none pr-36 max-sm:pr-0 max-md:pr-0'>From egusi to efo, enjoy genuine African soups in UK</li>
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
