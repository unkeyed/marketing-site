import type { ReactNode } from 'react';
import { blogContentData } from '@/constants/blog';
import { homeContentData } from '@/constants/home';

import { getBlogSearchItems, getBlogSearchSuggestions, getCategories } from '@/lib/blog/posts';
import SearchBar from '@/components/ui/search-bar';
import CategoriesList from '@/components/pages/blog/categories-list';
import Hero from '@/components/pages/blog/hero--blog';
import Cta from '@/components/pages/home/cta';

export default async function BlogListLayout({ children }: { children: ReactNode }) {
  const categories = getCategories();
  const searchItems = getBlogSearchItems();
  const suggestions = getBlogSearchSuggestions();

  return (
    <main className="flex-col pt-10 md:pt-24">
      <Hero
        title={blogContentData.hero.title}
        titleTag="h1"
        description={blogContentData.hero.description}
      />
      <section className="section-container mt-10 grid gap-8 md:mt-12 md:gap-12 lg:mt-30 lg:grid-cols-[216px_minmax(0,1fr)] 2xl:gap-50">
        <aside className="flex min-w-0 flex-col gap-8 lg:sticky lg:top-[calc(var(--sticky-header-height)+2.5rem)] lg:items-start lg:self-start">
          <SearchBar
            className="!h-8 w-full justify-between rounded-sm border-gray-20 bg-gray-8 pr-[0.1875rem] pl-2 hover:bg-gray-8 sm:w-4/5 md:max-w-[20rem] lg:w-54 [&_kbd]:h-6 [&_kbd]:rounded-sm [&_kbd]:border-gray-20 [&_kbd]:bg-gray-8 [&_kbd]:text-gray-70 [&_span]:text-gray-70"
            placeholder="Search..."
            searchItems={searchItems}
            suggestions={suggestions}
          />
          <CategoriesList
            className="w-full lg:w-54"
            categories={[
              {
                title: 'All posts',
                url: '/blog',
                slug: { current: '' },
              },
              ...categories,
            ]}
            variant="sidebar"
          />
        </aside>
        {children}
      </section>
      <Cta {...homeContentData.cta} className="mt-45" />
    </main>
  );
}
