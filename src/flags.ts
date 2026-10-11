import { flag } from 'flags/next';

import {
  decideHomepageHeroVariant,
  HOMEPAGE_HERO_FLAG_KEY,
  HOMEPAGE_HERO_PREVIEW_COOKIE,
  HOMEPAGE_HERO_VISITOR_COOKIE,
  HOMEPAGE_HERO_VISITOR_HEADER,
  type HomepageHeroVariant,
} from '@/lib/homepage-hero';

export const homepageHeroFlag = flag<HomepageHeroVariant>({
  key: HOMEPAGE_HERO_FLAG_KEY,
  description:
    'Homepage hero copy. A is the current hero. B changes only the subhead. Crawlers get B while the test is running.',
  options: [
    { label: 'Control', value: 'a' },
    { label: 'New hero copy', value: 'b' },
  ],
  defaultValue: 'a',
  identify({ cookies, headers }) {
    const visitorId =
      cookies.get(HOMEPAGE_HERO_VISITOR_COOKIE)?.value ||
      headers.get(HOMEPAGE_HERO_VISITOR_HEADER) ||
      undefined;
    return { visitorId };
  },
  decide({ cookies, entities, headers }) {
    return decideHomepageHeroVariant({
      userAgent: headers.get('user-agent'),
      previewCookie: cookies.get(HOMEPAGE_HERO_PREVIEW_COOKIE)?.value,
      visitorId: entities?.visitorId,
    });
  },
});

export const homepageFlags = [homepageHeroFlag] as const;
