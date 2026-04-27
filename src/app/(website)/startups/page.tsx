import { startupsContentData } from '@/constants/startups';

import { getMetadata } from '@/lib/get-metadata';
import { StartupsApplicationForm } from '@/components/pages/startups/application-form';
import ProgramSection from '@/components/pages/program/program-section';

export const metadata = getMetadata({
  title: 'Startups Program',
  description:
    'Get $1,000 in credits every month for your startup, plus priority support, concierge onboarding, and hands-on migration help. Everyone else gets 50% off their bill.',
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
