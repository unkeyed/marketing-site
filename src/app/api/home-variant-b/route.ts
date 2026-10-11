import { homeContentData } from '@/constants/home';

import { homeMarkdownResponse, renderHomeMarkdown } from '@/lib/home-markdown';
import { homepageHeroVariantB } from '@/lib/homepage-hero';

export const dynamic = 'force-static';

export function GET() {
  return homeMarkdownResponse(
    renderHomeMarkdown({
      title: homeContentData.hero.title,
      description: homepageHeroVariantB.subhead,
    }),
  );
}
