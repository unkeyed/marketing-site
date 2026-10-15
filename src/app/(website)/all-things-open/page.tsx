import { allThingsOpenContentData } from '@/constants/all-things-open';

import { getMetadata } from '@/lib/get-metadata';
import { GiveawayEntryForm } from '@/components/pages/all-things-open/entry-form';
import ProgramSection from '@/components/pages/program/program-section';

export const metadata = getMetadata({
  title: 'All Things Open giveaway',
  description:
    'Deploy a project to Unkey Compute, then submit it. Prizes are a Nintendo Switch 2, NuPhy Air75 V3 keyboards, and NuPhy Kick75 keyboards.',
  pathname: '/all-things-open',
});

export default function AllThingsOpenPage() {
  return (
    <main>
      <ProgramSection
        eyebrow={allThingsOpenContentData.eyebrow}
        title={allThingsOpenContentData.title}
        description={allThingsOpenContentData.description}
        benefits={allThingsOpenContentData.benefits}
      >
        <GiveawayEntryForm />
      </ProgramSection>
    </main>
  );
}
