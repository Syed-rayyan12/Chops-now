"use client";

import { Header } from '@/components/customer-panel-components/header';
import { Footer } from '@/components/customer-panel-components/footer';
import { PageBanner } from '@/components/customer-panel-components/page-banner';
import Growth from '@/components/customer-panel-components/growth';
import Delivery from '@/components/customer-panel-components/delivery';
import { CenteredContentSection } from '@/components/customer-panel-components/centered-content-section';
import TestimonialSlider from '@/components/customer-panel-components/testimonial-slider';
import { Newsletter } from '@/components/newsletter';
import CenteredValuesSection from '@/components/customer-panel-components/centered-values-section';
import { FaqSection } from '@/components/customer-panel-components/faq-section';

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PageBanner
        title="Become a"
        highlightedWord=" Partner"
        highlightedWord2="Chop Now"
        inlineImageSrc="/lines.svg"
        inlineImageAlt="Decorative lines"
        imageOnTop={true}
        description="Grow your restaurant with Chop Now. Reach new customers, boost orders, and join a community celebrating Afro-Caribbean flavors."
      />



      <Growth />
      <Delivery />
      <CenteredContentSection />
      <CenteredValuesSection/>
      <TestimonialSlider />
      <FaqSection/>
      <Newsletter />

      <Footer />
    </div>
  );
}
