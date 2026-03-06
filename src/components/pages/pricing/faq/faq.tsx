import { faqItems, pricingContentData } from '@/constants/pricing';

import { Label } from '@/components/ui/label';

import Faq from './faq--column-narrow';

export default function FaqSection() {
  return (
    <section className="section-container">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-28.25">
        <Label size="plain" className="pt-3">
          {pricingContentData.faq.mainTitle}
        </Label>
        <div className="flex-1">
          <div>
            <h2 className="font-display text-3xl leading-[1.125] font-medium text-foreground md:text-4xl">
              {pricingContentData.faq.title}
              <br />
              <span className="text-gray-60">{pricingContentData.faq.description}</span>
            </h2>
          </div>
          <Faq items={faqItems} className="mt-14 mb-30 lg:mb-50" />
        </div>
      </div>
    </section>
  );
}
