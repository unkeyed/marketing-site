import { homeContentData } from '@/constants/home';

import { homeMarkdownResponse, renderHomeMarkdown } from '@/lib/home-markdown';

export const dynamic = 'force-static';

const CONTROL_INTRO =
  'Unkey unifies API deployment, gateways, key management, and observability in one control plane. Stop stitching together hosting, gateways, rate limiting, and monitoring from separate vendors — ship, protect, and understand your APIs from a single platform.';

export function GET() {
  const { hero } = homeContentData;

  return homeMarkdownResponse(
    renderHomeMarkdown({
      title: hero.title,
      description: hero.description,
      intro: CONTROL_INTRO,
    }),
  );
}
