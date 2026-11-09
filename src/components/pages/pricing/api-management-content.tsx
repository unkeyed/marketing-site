import { portfolioLogos } from '@/constants/logos';
import { apiManagementPricingPlans, startupsData } from '@/constants/pricing';

import Logos from '@/components/pages/logos';

import Hero from './hero-pricing/hero--pricing';
import PlanBanner from './plan-banner';

const PortfolioLogos = () => {
  return (
    <div className="border border-border">
      <Logos
        logos={portfolioLogos}
        className="mx-0 pt-5 pb-5 md:mx-0 md:pt-5 md:pb-5 lg:px-8 lg:py-5"
      />
    </div>
  );
};

export default function ApiManagementContent() {
  return (
    <Hero
      plans={apiManagementPricingPlans}
      bottomContent={
        <>
          <PortfolioLogos />
          <PlanBanner data={startupsData} buttonVariant="secondary" className="border-t-0" />
        </>
      }
      className="mb-30 lg:mb-40"
    />
  );
}
