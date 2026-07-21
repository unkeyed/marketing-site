import { notFound } from 'next/navigation';

import { getAllGlossaryTerms, getGlossaryDataBySlug } from '@/lib/glossary/posts';
import { toAbsoluteSiteUrl } from '@/lib/site-url';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const term = getGlossaryDataBySlug(slug);

  if (!term) {
    notFound();
  }

  const url = toAbsoluteSiteUrl(term.pathname);
  const { takeaways } = term;

  const takeawayLines: string[] = [];
  if (takeaways.didYouKnow) {
    takeawayLines.push(`- **Did you know:** ${takeaways.didYouKnow}`);
  }
  if (takeaways.usageInAPIs?.description) {
    takeawayLines.push(`- **Usage in APIs:** ${takeaways.usageInAPIs.description}`);
  }
  for (const practice of takeaways.bestPractices ?? []) {
    takeawayLines.push(`- **Best practice:** ${practice}`);
  }

  const faqLines = term.faq.flatMap((item) => [`### ${item.question}`, '', item.answer, '']);

  const body = [
    `# ${term.h1}`,
    '',
    term.tldr,
    '',
    `Source: ${url}`,
    '',
    '---',
    '',
    takeawayLines.length ? '## Key takeaways' : '',
    takeawayLines.length ? '' : '',
    ...takeawayLines,
    takeawayLines.length ? '' : '',
    term.content.trim(),
    '',
    faqLines.length ? '## FAQ' : '',
    faqLines.length ? '' : '',
    ...faqLines,
  ]
    .filter((line) => line !== null && line !== undefined)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

export async function generateStaticParams() {
  const terms = getAllGlossaryTerms();
  return terms.map((term) => ({ slug: term.slug }));
}

export const dynamicParams = false;
