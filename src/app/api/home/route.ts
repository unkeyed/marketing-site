import { homeContentData } from '@/constants/home';

import { toAbsoluteSiteUrl } from '@/lib/site-url';

export function GET() {
  const { hero, controlPlane, buildDeploy, gateway, scale, cta } = homeContentData;

  const body = [
    `# ${hero.title}`,
    '',
    hero.description,
    '',
    `Source: ${toAbsoluteSiteUrl('/')}`,
    '',
    '---',
    '',
    '## A single control plane for access and traffic',
    '',
    controlPlane.description,
    '',
    '## Build & deploy',
    '',
    `**${buildDeploy.heading}**`,
    '',
    buildDeploy.description,
    '',
    '## Gateway',
    '',
    gateway.heading,
    '',
    '## Scale',
    '',
    scale.description,
    '',
    '## Get started',
    '',
    `**${cta.heading}** ${cta.subheading}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
