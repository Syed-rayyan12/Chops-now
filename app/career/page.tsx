"use client";

import { Header } from '@/components/customer-panel-components/header';
import { Footer } from '@/components/customer-panel-components/footer';
import { PageBanner } from '@/components/customer-panel-components/page-banner';
import { ContentWithImage } from '@/components/customer-panel-components/content-with-image';
import Performance from '@/components/customer-panel-components/performance';
import { OurPeople } from '@/components/customer-panel-components/our-people';
import { BeYourselfSection } from '@/components/customer-panel-components/be-yourself-section';
import ReadOurLatestNews from '@/components/customer-panel-components/read-our-latest-news';
import { Newsletter } from '@/components/newsletter';

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <PageBanner 
        title="Hungry to make an impact?"
        highlightedWord="Hungry"
        description="Join Chop Now, where food, culture, and community come together. Help  us bring Afro-Caribbean flavors to every doorstep — and build a future full of opportunity."
      />

      <ContentWithImage
        heading="There's always room at our table."
        paragraph="At Chop Now, we're not just delivering food — we're delivering culture. We connect people with the authentic taste of Africa and the Caribbean, while empowering local chefs, couriers, and communities to grow."
        paragraph2="We're blending technology with tradition, making soulful, flavorful dishes easier to enjoy, and ensuring every meal tells a story." 
       imageSrc="/blog-0.png"
        imageAlt="Career at Chop Now"
      />

      <Performance />
      <OurPeople  />
      <BeYourselfSection />
        <ReadOurLatestNews/>
        <Newsletter/>
      <Footer />
    </div>
  );
}
