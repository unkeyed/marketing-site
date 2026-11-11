import { startupsContentData } from '@/constants/startups';

import { getMetadata } from '@/lib/get-metadata';
import ProgramSection from '@/components/pages/program/program-section';
import { StartupsApplicationForm } from '@/components/pages/startups/application-form';

export const metadata = getMetadata({
  title: 'Startups Program',
  description:
    'Get $1,000 in credits every month for 12 months for your startup, plus priority support, concierge onboarding, and hands-on migration help. Raised more than $5M? Get 50% off your bill for 12 months.',
  pathname: '/startups',
});

export default function StartupsPage() {
  return (
    <main>
      <ProgramSection
        eyebrow={startupsContentData.eyebrow}
        title={startupsContentData.title}
        description={startupsContentData.description}
        benefits={startupsContentData.benefits}
      >
        <StartupsApplicationForm />
      </ProgramSection>
    </main>
  );
}
