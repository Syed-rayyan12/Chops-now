import React from 'react'
import { Users, Award, TrendingUp, Star } from 'lucide-react'

const Performance = () => {
    const performanceData = [
        {
            icon: Users,
            number: "300+",
            description: "300+ Restaurant partners"
        },
        {
            icon: Award,
            number: "15+",
            description: "15+ Industry awards won"
        },
        {
            icon: TrendingUp,
            number: "1000+",
            description: "1,000+ couriers delivering daily"
        },
        {
            icon: Star,
            number: "01",
            description: "1 mission  to celebrate Afro-Caribbean food culture"
        }
    ]

    return (
        <div className="py-16 bg-white relative">
            {/* Background shape images */}
            <img
                src="/cusine-shape.png"
                alt="Shape decoration"
                className="absolute max-sm:w-30 top-0 right-6 max-2xl:w-30 w-40 pointer-events-none select-none opacity-15 float-shape"
            />
            <img
                src="/cusine-shape-2.png"
                alt="Shape decoration"
                className="absolute max-sm:w-30 bottom-0 max-2xl:w-30 left-0 w-30 pointer-events-none select-none float-shape"
            />

            <div className="container mx-auto px-26 max-md:px-12 max-sm:px-8">
                <div className="text-center mb-12">
                    <h2 className='font-fredoka-one font-extrabold text-5xl max-sm:text-2xl max-lg:text-4xl text-foreground mb-7'>
                        A diverse and high-performing team
                    </h2>
                    <div className="bg-primary h-1 w-24 mx-auto mb-4"></div>
                    <p className='text-[16px] text-foreground font-ubuntu max-w-2xl mx-auto'>
                        Where diversity fuels performance and impact.
                    </p>
                </div>

                {/* Performance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                    {performanceData.map((item, index) => {
                        const IconComponent = item.icon
                        return (
                            <div 
                                key={index}
                                className="bg-white border border-secondary rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                            >
                                {/* Icon with pink background */}
                                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <IconComponent className="w-7 h-7 text-secondary" />
                                </div>
                                
                                {/* Number */}
                                <h3 className="font-space-grotesk text-[20px] font-bold text-secondary mb-3">
                                    {item.number}
                                </h3>
                                
                                {/* Description */}
                                <p className="text-sm text-foreground font-ubuntu leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Performance;
