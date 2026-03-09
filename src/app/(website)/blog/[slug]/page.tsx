import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import config from '@/configs/website-config';
import { homeContentData } from '@/constants/home';

import { getAllPosts, getPostBySlug, getPostDataBySlug } from '@/lib/blog/posts';
import { getMetadata } from '@/lib/get-metadata';
import { toAbsoluteSiteUrl } from '@/lib/site-url';
import Post from '@/components/pages/blog/post/post';
import Cta from '@/components/pages/home/cta';

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || (isProduction && post.isDraft)) {
    notFound();
  }

  // Google Structured Data for Blog Post @see {@link https://developers.google.com/search/docs/appearance/structured-data/article#json-ld}
  // Next.js JSON-LD @see {@link https://nextjs.org/docs/app/guides/json-ld}
  const postUrl = toAbsoluteSiteUrl(`/blog/${post.slug.current}`);
  const authors = (post.authors || []).map((author) => ({
    '@type': 'Person',
    name: author.name,
    ...(author.photo ? { image: author.photo } : {}),
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seo?.title || post.title,
    description: post.seo?.description || '',
    datePublished: post.publishedAt,
    // TODO: If possible, it is required to get the last edit data
    // dateModified: post.updatedAt,
    url: postUrl,
    image:
      post.seo?.socialImage ||
      toAbsoluteSiteUrl(`/api/og?template=blog&title=${encodeURIComponent(post.seo?.title)}`),
    author: authors.length > 0 ? authors : [{ '@type': 'Person', name: 'Unknown' }],
  };

  return (
    <main className="pt-8 md:pt-11 lg:pt-21">
      <Post post={post} />
      <Cta {...homeContentData.cta} className="mt-51.75" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
    </main>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostDataBySlug(slug);

  if (!post || (isProduction && post.isDraft)) {
    return {};
  }

  const { seo } = post;

  const metadata = getMetadata({
    title: `${seo.title} | ${config.projectName}`,
    description: seo.description,
    pathname: `/blog/${post.slug.current}`,
    imagePath: seo.socialImage,
    noIndex: seo.noIndex,
  });

  return metadata;
}
