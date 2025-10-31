"use client"
import React from 'react'
import { FeaturedRestaurants } from "@/components/customer-panel-components/featured-restaurants";
import { Footer } from "@/components/customer-panel-components/footer";
import { Header } from "@/components/customer-panel-components/header";
import { HeroSection } from "@/components/customer-panel-components/hero-section";
import { PopularCuisines } from "@/components/customer-panel-components/popular-cuisines";
import MobileSection from '@/components/customer-panel-components/mobile-section';
import Marquee from '@/components/customer-panel-components/marquee';
import ComingSoon from '@/components/customer-panel-components/coming-soon';

const page = () => {
    return (
        <>
            <div className="min-h-screen bg-background">
                {/* <RestaurantRiderNavbar /> */}
                <Header />
                <main>
                    <>
                    <HeroSection />
                    <FeaturedRestaurants />
                    <PopularCuisines />
                    <MobileSection/>
                    <Marquee/>
                    <ComingSoon/>
                    
                    </>
                </main>
                <Footer />
            </div>
        </>
    )
}

export default page
