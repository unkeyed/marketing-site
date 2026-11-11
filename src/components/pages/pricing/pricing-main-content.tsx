import { pricingContentData } from '@/constants/pricing';

import ApiManagementContent from './api-management-content';
import DeployTabContent from './deploy-tab-content';
import PricingTabs from './pricing-tabs';

export default function PricingMainContent({ title }: { title: React.ReactNode }) {
  return (
    <section className="section-container pt-10 sm:pt-27">
      <h1 className="marked-title font-display text-3xl leading-[1.125] text-foreground sm:whitespace-pre-line md:text-[2.5rem] xl:mt-8 xl:text-[3.25rem] [&_mark]:!h-[1.1em]">
        {title}
      </h1>
      <PricingTabs
        tabs={pricingContentData.tabs}
        deployContent={<DeployTabContent />}
        apiManagementContent={<ApiManagementContent />}
      />
    </section>
  );
}
