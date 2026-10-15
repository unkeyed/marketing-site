import type { Metadata } from 'next';
import { homeContentData } from '@/constants/home';
import { pricingContentData } from '@/constants/pricing';

import { getMetadata } from '@/lib/get-metadata';
import Cta from '@/components/pages/home/cta';
import FaqSection from '@/components/pages/pricing/faq/faq';
import PricingMainContent from '@/components/pages/pricing/pricing-main-content';

const pricingMetadata = getMetadata({
  title: 'Pricing',
  description: 'Pricing for Unkey Deploy and Api Management',
  pathname: '/pricing',
});

export const metadata: Metadata = {
  ...pricingMetadata,
  alternates: {
    ...pricingMetadata.alternates,
    types: {
      'text/markdown': '/pricing.md',
    },
  },
};

export default function PricingPage() {
  return (
    <main>
      <PricingMainContent title={pricingContentData.title} />
      <FaqSection />
      <Cta {...homeContentData.cta} />
    </main>
  );
}
