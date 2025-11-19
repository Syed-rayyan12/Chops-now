import { AboutHero } from '@/components/customer-panel-components/about-hero';
import WhoWeAre from '@/components/customer-panel-components/who-we-are';
import { Header } from '@/components/customer-panel-components/header';
import { Footer } from '@/components/customer-panel-components/footer';
import { ImageContentSection } from '@/components/customer-panel-components/image-content-section';
import { FeaturedSection } from '@/components/customer-panel-components/featured-section';
import OurValues from '@/components/customer-panel-components/our values';
import TestimonialSlider from '@/components/customer-panel-components/testimonial-slider';
import ReadOurLatestNews from '@/components/customer-panel-components/read-our-latest-news';
import { Newsletter } from '@/components/newsletter';
import { BeYourselfSection } from '@/components/customer-panel-components/be-yourself-section';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AboutHero />

      {/* Image on Left, Content on Right */}
      <ImageContentSection
        imageSrc="/about-1.svg"
        imageAlt="Our Mission"
        title="A Taste of Nigerian Food in UK with Authenticity"
        description="Our journey began with a simple, powerful craving: for the true, soul-warming taste of home. ChopNow
African food delivery was born to bridge that gap, connecting you with the finest food delivery from
African restaurants in UK.
We proudly partner with dedicated ChopNow restaurant partners to bring the rich, authentic flavours
of West African cuisine in UK directly to your table, satisfying hearts and homesick souls.
"

      />

      {/* Featured Section with Background */}
      <FeaturedSection
        title="Our Journey"
        description="A journey inspired by heritage, powered by flavor."
      features={[
  {
    imageSrc: "/journey-1.png",
    title: "Origin",
    description:
      "It all started with a shared vision to create the first black-owned food delivery platform in the UK. We saw the gap in the market, where finding a truly great Caribbean & African restaurant in London was a challenge. Our mission was clear: bringing vibrant tastes of home to your home!"
  },
  {
    imageSrc: "/journey-2.png",
    title: "Growth",
    description:
      "We expanded our network of talented chefs, bringing the most sought-after authentic African meals in the UK to food lovers nationwide. Our commitment to quality and culture soon made us a leading name in Caribbean food delivery across the UK, uniting two rich culinary heritages!"
  },
  {
    imageSrc: "/journey-3.png",
    title: "Future & Beyond",
    description:
      "Our appetite for growth is as big as yours. We're excited to introduce beloved popular Ghanaian meals in the UK and explore new services like African grocery delivery in the UK, bringing all the essential ingredients for a true taste of home directly to your door."
  }
]}

      />

      <OurValues />
      <TestimonialSlider />
      <ReadOurLatestNews />
      <Newsletter />

      <Footer />
    </div>
  );
}
