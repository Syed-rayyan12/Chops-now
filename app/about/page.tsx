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
        title="Bringing the Taste of 
Home to Every Table"
        description="At Chop Now, we’re more than just a delivery platform — we’re a celebration of Afro-Caribbean food, culture, and community. Our journey began with one simple belief: that the rich, soulful flavors of our heritage deserve to be shared, enjoyed, and celebrated everywhere.
From the spicy stews of West Africa to the smoky jerk grills of the Caribbean, our mission is to bring the heart of home cooking to your doorstep — connecting people through the joy of authentic food."

      />

      {/* Featured Section with Background */}
      <FeaturedSection
        title="Our Journey"
        description="A journey inspired by heritage, powered by flavor."
        features={[
          {
            imageSrc: "/journey-1.png",
            title: "Origin",
            description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum content here, content here', making it look like readable English."
          },
          {
            imageSrc: "/journey-2.png",
            title: "Growth",
            description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum content here, content here', making it look like readable English."
          },
          {
            imageSrc: "/journey-3.png",
            title: "Now & Future",
            description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum content here, content here', making it look like readable English."
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
