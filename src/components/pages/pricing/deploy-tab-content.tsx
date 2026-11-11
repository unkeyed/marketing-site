import {
  computeIntroOffer,
  computePlanIncludes,
  deployPricingPlans,
  enterpriseData,
  startupsData,
  tableFeatures,
} from '@/constants/pricing';

import ComparisonTable from './comparison-table';
import Hero from './hero-pricing/hero--pricing';
import PlanBanner from './plan-banner';
import UsageCalculator from './usage-calculator';

export default function DeployTabContent() {
  return (
    <>
      <Hero
        plans={deployPricingPlans}
        title="Compute plans"
        notice={computeIntroOffer.notice}
        noticeNote={computeIntroOffer.starterCarryoverNote}
        planIncludes={computePlanIncludes}
        bottomContent={
          <>
            <PlanBanner data={enterpriseData} withBackground />
            <PlanBanner data={startupsData} buttonVariant="secondary" className="border-t-0" />
          </>
        }
      />
      <ComparisonTable plans={deployPricingPlans} featureCategories={tableFeatures} />
      <UsageCalculator />
    </>
  );
}
