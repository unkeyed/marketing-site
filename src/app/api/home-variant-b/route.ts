import { homeMarkdownResponse, renderHomeMarkdown } from '@/lib/home-markdown';
import { homepageHeroVariantB } from '@/lib/homepage-hero';

export const dynamic = 'force-static';

export function GET() {
  return homeMarkdownResponse(
    renderHomeMarkdown({
      title: homepageHeroVariantB.heading,
      description: homepageHeroVariantB.subhead,
    }),
  );
}
