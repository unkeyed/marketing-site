'use client';

import { useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type PricingTab = {
  value: string;
  label: string;
};

// Keep inactive plans in the server HTML for crawlers. `hidden` removes that
// panel from layout until its tab is selected.
const INACTIVE_PANEL_CLASS = 'data-[state=inactive]:hidden';

export default function PricingTabs({
  tabs,
  deployContent,
  apiManagementContent,
}: {
  tabs: PricingTab[];
  deployContent: ReactNode;
  apiManagementContent: ReactNode;
}) {
  const [value, setValue] = useState('deploy');

  return (
    <Tabs value={value} onValueChange={setValue} className="mt-9">
      <TabsList
        className={cn(
          'h-11.75 w-fit rounded-none border border-gray-30 bg-background p-1 text-gray-70',
        )}
      >
        {tabs.map((tab) => (
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
      <TabsContent
        value="deploy"
        forceMount
        hidden={value !== 'deploy'}
        className={INACTIVE_PANEL_CLASS}
      >
        {deployContent}
      </TabsContent>
      <TabsContent
        value="api-management"
        forceMount
        hidden={value !== 'api-management'}
        className={INACTIVE_PANEL_CLASS}
      >
        {apiManagementContent}
      </TabsContent>
    </Tabs>
  );
}
