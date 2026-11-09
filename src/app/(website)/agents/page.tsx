import { agentsContentData } from '@/constants/agents';
import { homeContentData } from '@/constants/home';

import { getMetadata } from '@/lib/get-metadata';
import Control from '@/components/pages/agents/control';
import Hero from '@/components/pages/agents/hero';
import Session from '@/components/pages/agents/session';
import Setup from '@/components/pages/agents/setup';
import Stack from '@/components/pages/agents/stack';
import Cta from '@/components/pages/home/cta';
import Production from '@/components/pages/home/production';

export const metadata = getMetadata({
  ...agentsContentData.metadata,
  pathname: '/agents',
  absoluteTitle: true,
});

export default function AgentsPage() {
  return (
    <main>
      <Hero {...agentsContentData.hero} />
      <Session {...agentsContentData.session} />
      <Setup {...agentsContentData.setup} />
      <Stack {...agentsContentData.stack} />
      <Production {...agentsContentData.production} />
      <Control {...agentsContentData.control} />
      <Cta {...homeContentData.cta} {...agentsContentData.cta} />
    </main>
  );
}
