import type { Metadata } from 'next';
import { homeContentData } from '@/constants/home';
import { pricingContentData } from '@/constants/pricing';

import { getMetadata } from '@/lib/get-metadata';
import Cta from '@/components/pages/home/cta';
import FaqSection from '@/components/pages/pricing/faq/faq';
import PricingMainContent from '@/components/pages/pricing/pricing-main-content';

const pricingMetadata = getMetadata({
  title: 'Unkey Pricing: Free to Start, Usage-Based Plans',
  description:
    'Start for free and pay as you grow, with usage-based pricing for Unkey Deploy and API keys.',
  pathname: '/pricing',
  absoluteTitle: true,
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
