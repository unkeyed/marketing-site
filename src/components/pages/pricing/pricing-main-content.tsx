import { pricingContentData } from '@/constants/pricing';

import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ApiManagementContent from './api-management-content';
import DeployTabContent from './deploy-tab-content';

export default function PricingMainContent({ title }: { title: React.ReactNode }) {
  return (
    <section className="section-container pt-10 sm:pt-27">
      <h1 className="marked-title font-display-secondary text-3xl leading-[1.125] text-foreground [font-feature-settings:'ss01'_1] sm:whitespace-pre-line md:text-[2.5rem] xl:mt-8 xl:text-[3.25rem] [&_mark]:!h-[1.1em]">
        {title}
      </h1>
      <Tabs defaultValue="deploy" className="mt-9">
        <TabsList
          className={cn(
            'h-11.75 w-fit rounded-none border border-gray-30 bg-background p-1 text-gray-70',
          )}
        >
          {pricingContentData.tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'h-full rounded-none px-4 font-mono text-[0.875rem] tracking-[0.03em] uppercase lg:text-[0.9375rem]',
                'data-[state=active]:bg-white data-[state=active]:text-gray-8',
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="deploy">
          <DeployTabContent />
        </TabsContent>
        <TabsContent value="api-management">
          <ApiManagementContent />
        </TabsContent>
      </Tabs>
    </section>
  );
}
