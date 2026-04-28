import { ycContentData } from '@/constants/yc';

import { getMetadata } from '@/lib/get-metadata';
import ProgramSection from '@/components/pages/program/program-section';
import { YcApplicationForm } from '@/components/pages/yc/application-form';

export const metadata = getMetadata({
  title: 'Y Combinator Program',
  description:
    '$1,000 in credits every month for current YC batch companies. Everyone else gets 50% off their bill. Priority support and concierge onboarding included.',
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
