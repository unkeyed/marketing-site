import { aboutBlogFallbackImages, aboutContentData } from '@/constants/about';
import { homeContentData } from '@/constants/home';

import { getAllPosts } from '@/lib/blog/posts';
import { getMetadata } from '@/lib/get-metadata';
import { getFormattedDate } from '@/lib/utils';
import Blog from '@/components/pages/about/blog';
import Hero from '@/components/pages/about/hero';
import Investors from '@/components/pages/about/investors';
import TeamSection from '@/components/pages/about/team';
import Cta from '@/components/pages/home/cta';

export const metadata = getMetadata({
  title: 'About',
  description: 'Learn more about us.',
  pathname: '/about',
});

export default function AboutPage() {
  const blogCards = getAllPosts()
    .slice(0, 3)
    .map((post, index) => ({
      href: post.pathname,
      imageSrc: post.cover || aboutBlogFallbackImages[index] || aboutBlogFallbackImages[0],
      imageAlt: post.title,
      category: post.category?.title || 'General',
      date: getFormattedDate(post.publishedAt),
      title: post.title,
    }));

  return (
    <main>
      <Hero
        title={aboutContentData.title}
        description={aboutContentData.description}
        values={aboutContentData.values}
      />
      <TeamSection {...aboutContentData.team} />
      <Investors {...aboutContentData.investors} />
      <Blog {...aboutContentData.blog} cards={blogCards} />
      <Cta {...homeContentData.cta} />
    </main>
  );
}
