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
        title="Ready to Reshape the Future of Flavour?"
        highlightedWord="Hungry"
        description="From perfecting the nation's favourite jollof rice in UK to serving authentic jerk chicken in UK, your
career here feeds a movement. Join us!"
      />

      <ContentWithImage
        heading="We’re Always Searching for Passionate Afro-Caribbean Chefs"
        paragraph="The appetite for authentic, professionally-made Afro-Caribbean cuisine has never been greater. With
more people searching for how to order African food online in UK and seeking the best Caribbean food
delivery in UK, your talent is the missing ingredient"
        paragraph2="We connect chefs specialising in traditional Nigerian dishes in UK with a community eager to order
African food online in UK and experience true culinary heritage. Join us and meet the demand."
        imageSrc="/blog-0.png"
        imageAlt="Career at Chop Now"
      />

      <Performance />
      <OurPeople />
      <BeYourselfSection />
      <ReadOurLatestNews />
      <Newsletter />
      <Footer />
    </div>
  );
}
