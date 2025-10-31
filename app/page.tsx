// Server component (no client-only back navigation logic)
import { RestaurantRiderNavbar } from "@/components/customer-panel-components/admin-rider-navbar";
import ComingSoon from "@/components/customer-panel-components/coming-soon";
import { FeaturedRestaurants } from "@/components/customer-panel-components/featured-restaurants";
import { Footer } from "@/components/customer-panel-components/footer";
import { Header } from "@/components/customer-panel-components/header";

import { HeroSection } from "@/components/customer-panel-components/hero-section";
import ImageBgSection from "@/components/customer-panel-components/image-bg-section";
import LittleNav from "@/components/customer-panel-components/little-nav";
import Marquee from "@/components/customer-panel-components/marquee";
import MobileSection from "@/components/customer-panel-components/mobile-section";
import { PopularCuisines } from "@/components/customer-panel-components/popular-cuisines";
import ReadOurLatestNews from "@/components/customer-panel-components/read-our-latest-news";
import TestimonialSlider from "@/components/customer-panel-components/testimonial-slider";
import WhoWeAre from "@/components/customer-panel-components/who-we-are";
import WhyChopnow from "@/components/customer-panel-components/why-chopnow";
import { Newsletter } from "@/components/newsletter";


export default function Page() {

  return (
    <div className="min-h-screen bg-background">
     
      {/* <RestaurantRiderNavbar/> */}
      <LittleNav/>
      <Header />
      <main>
        <HeroSection />
        <FeaturedRestaurants />
        <PopularCuisines />
        <WhoWeAre/>
        <ImageBgSection/>
        <WhyChopnow/>
        <TestimonialSlider/>
        <ReadOurLatestNews/>
        <Newsletter/>
      </main>
      <Footer />
    </div>
  )
}
