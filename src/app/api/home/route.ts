import { homeContentData } from '@/constants/home';

import { toAbsoluteSiteUrl } from '@/lib/site-url';

export function GET() {
  const {
    hero,
    controlPlane,
    buildDeploy,
    gateway,
    production,
    scale,
    observe,
    portal,
    cta,
  } = homeContentData;

  const bullets = <T,>(items: readonly T[], title: (item: T) => string, body: (item: T) => string) =>
    items.map((item) => `- **${title(item)}** — ${body(item)}`);

  const body = [
    `# ${hero.title}`,
    '',
    `> ${hero.description}`,
    '',
    'Unkey unifies API deployment, gateways, key management, and observability in one control plane. Stop stitching together hosting, gateways, rate limiting, and monitoring from separate vendors — ship, protect, and understand your APIs from a single platform.',
    '',
    `Source: ${toAbsoluteSiteUrl('/')}`,
    `Start for free: ${hero.primaryCta.href}`,
    `Docs: ${toAbsoluteSiteUrl('/docs')}`,
    `Pricing: ${toAbsoluteSiteUrl('/pricing')} ([Markdown](${toAbsoluteSiteUrl('/pricing.md')}))`,
    '',
    '---',
    '',
    '## One control plane for access and traffic',
    '',
    controlPlane.description,
    '',
    ...controlPlane.cards.map((card) => {
      const [lead, ...rest] = card.body.split('. ');
      return `- **${lead}** — ${rest.join('. ')}`;
    }),
    '',
    '## Deploy in minutes. Roll back in seconds.',
    '',
    buildDeploy.description,
    '',
    ...bullets(
      buildDeploy.panels,
      (p) => p.title,
      (p) => p.body,
    ),
    '',
    '## Protect and control traffic at the edge',
    '',
    gateway.heading,
    '',
    ...bullets(
      gateway.cards,
      (c) => c.title,
      (c) => c.body,
    ),
    '',
    '## Scale without managing infrastructure',
    '',
    scale.description,
    '',
    ...bullets(
      scale.features,
      (f) => f.title,
      (f) => f.text,
    ),
    '',
    '## Observability, built in',
    '',
    `${observe.heading} ${observe.subheading}`,
    '',
    ...bullets(
      observe.columns,
      (col) => col.lead.replace(/\.$/, ''),
      (col) => col.rest,
    ),
    '',
    '## Built for production',
    '',
    ...bullets(
      production.items,
      (p) => p.title,
      (p) => p.text,
    ),
    '',
    '## A developer portal for your users',
    '',
    `${portal.heading} ${portal.subheading}`,
    '',
    ...portal.cards.map((card) => `- ${card.text}`),
    '',
    '## Two products, one platform',
    '',
    '- **Deployment platform** — Run your APIs as real containers across AWS regions with Git-based deploys, preview environments, immutable versions, and instant rollbacks. Pay only for the vCPU, memory, and egress you actually use.',
    '- **API Management** — Issue, verify, and manage API keys with globally enforced rate limits, permissions, analytics, and instant revocation. Tiered plans by monthly request volume, with a free tier to start.',
    '',
    '## Get started',
    '',
    `${cta.heading} ${cta.subheading}`,
    '',
    `- Start for free: ${hero.primaryCta.href}`,
    `- View on GitHub: ${hero.secondaryCta.href}`,
    `- Read the docs: ${toAbsoluteSiteUrl('/docs')}`,
    `- See pricing: ${toAbsoluteSiteUrl('/pricing')}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
