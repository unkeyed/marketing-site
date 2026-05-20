import { notFound } from 'next/navigation';

import { getAllPosts, getPostDataBySlug } from '@/lib/blog/posts';
import { toAbsoluteSiteUrl } from '@/lib/site-url';

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const post = getPostDataBySlug(slug);

  if (!post || (isProduction && post.isDraft)) {
    notFound();
  }

  const url = toAbsoluteSiteUrl(post.pathname);
  const authorNames = post.authors.map((a) => a.name).join(', ');

  const body = [
    `# ${post.title}`,
    '',
    post.caption,
    '',
    `Source: ${url}`,
    authorNames ? `Author: ${authorNames}` : '',
    `Published: ${post.publishedAt}`,
    '',
    '---',
    '',
    post.content.trim(),
    '',
  ]
    .filter((line) => line !== null && line !== undefined)
    .join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug.current }));
}

export const dynamicParams = false;
