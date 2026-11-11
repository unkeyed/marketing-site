import { ycContentData } from '@/constants/yc';

import { getMetadata } from '@/lib/get-metadata';
import ProgramSection from '@/components/pages/program/program-section';
import { YcApplicationForm } from '@/components/pages/yc/application-form';

export const metadata = getMetadata({
  title: 'Y Combinator Program',
  description:
    '$1,000 in credits every month for 12 months for current YC batch companies. Raised more than $5M? Get 50% off your bill for 12 months. Priority support and concierge onboarding included.',
  pathname: '/yc',
});

export default function YcPage() {
  return (
    <main>
      <ProgramSection
        eyebrow={ycContentData.eyebrow}
        title={ycContentData.title}
        description={ycContentData.description}
        benefits={ycContentData.benefits}
      >
        <YcApplicationForm />
      </ProgramSection>
    </main>
  );
}
