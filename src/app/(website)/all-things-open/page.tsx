import { cookies } from 'next/headers';
import { allThingsOpenContentData } from '@/constants/all-things-open';

import { getMetadata } from '@/lib/get-metadata';
import {
  getGiveawayWindowState,
  GIVEAWAY_NOW_COOKIE,
  GIVEAWAY_WINDOW_COPY,
  resolveGiveawayNow,
} from '@/lib/giveaway-window';
import { GiveawayEntryForm } from '@/components/pages/all-things-open/entry-form';
import ProgramSection from '@/components/pages/program/program-section';

export const dynamic = 'force-dynamic';

export const metadata = getMetadata({
  title: 'All Things Open giveaway',
  description: `Deploy a project to Unkey Compute, then submit it. ${GIVEAWAY_WINDOW_COPY} Prizes are a Nintendo Switch 2, NuPhy Air75 V3 keyboards, and NuPhy Kick75 keyboards.`,
  pathname: '/all-things-open',
});

export default async function AllThingsOpenPage() {
  const jar = await cookies();
  const windowState = getGiveawayWindowState(
    resolveGiveawayNow(jar.get(GIVEAWAY_NOW_COOKIE)?.value),
  );

  return (
    <main>
      <ProgramSection
        eyebrow={allThingsOpenContentData.eyebrow}
        title={allThingsOpenContentData.title}
        description={allThingsOpenContentData.description}
        benefits={allThingsOpenContentData.benefits}
      >
        <GiveawayEntryForm windowState={windowState} />
      </ProgramSection>
    </main>
  );
}
