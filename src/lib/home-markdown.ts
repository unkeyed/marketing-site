import { homeContentData } from '@/constants/home';

import { toAbsoluteSiteUrl } from '@/lib/site-url';

export function renderHomeMarkdown(heroCopy: {
  title: string;
  description: string;
  intro?: string;
}) {
  const { hero, controlPlane, buildDeploy, gateway, production, scale, observe, portal, cta } =
    homeContentData;

  const bullets = <T>(items: readonly T[], title: (item: T) => string, body: (item: T) => string) =>
    items.map((item) => `- **${title(item)}** — ${body(item)}`);

  return [
    `# ${heroCopy.title}`,
    '',
    `> ${heroCopy.description}`,
    '',
    ...(heroCopy.intro ? [heroCopy.intro, ''] : []),
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
      (panel) => panel.title,
      (panel) => panel.body,
    ),
    '',
    '## Protect and control traffic at the edge',
    '',
    gateway.heading,
    '',
    ...bullets(
      gateway.cards,
      (card) => card.title,
      (card) => card.body,
    ),
    '',
    '## Scale without managing infrastructure',
    '',
    scale.description,
    '',
    ...bullets(
      scale.features,
      (feature) => feature.title,
      (feature) => feature.text,
    ),
    '',
    '## Observability, built in',
    '',
    `${observe.heading} ${observe.subheading}`,
    '',
    ...bullets(
      observe.columns,
      (column) => column.lead.replace(/\.$/, ''),
      (column) => column.rest,
    ),
    '',
    '## Built for production',
    '',
    ...bullets(
      production.items,
      (item) => item.title,
      (item) => item.text,
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
    '- **Deployment platform** — Run your APIs as real containers across AWS regions with Git-based deploys, preview environments, immutable versions, and instant rollbacks. Usage charges cover compute, storage, egress, and active keys.',
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
}

export function homeMarkdownResponse(body: string) {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
