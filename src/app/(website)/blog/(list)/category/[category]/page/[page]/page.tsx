import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getCategories,
  getCategoryBySlug,
  getPaginatedPostsByCategory,
  getTotalPagesByCategory,
} from '@/lib/blog/posts';
import { getMetadata } from '@/lib/get-metadata';
import Pagination from '@/components/pages/blog/pagination';
import PostsList from '@/components/pages/blog/posts-lists--grid';

interface CategoryPageProps {
  params: Promise<{
    category: string;
    page: string;
  }>;
}

export async function generateStaticParams() {
  const cats = getCategories();

  const counts = cats.map((c) => getTotalPagesByCategory(c.slug.current));

  const params: { category: string; page: string }[] = [];
  cats.forEach((c, i) => {
    const total = counts[i];
    for (let page = 2; page <= total; page++) {
      params.push({ category: c.slug.current, page: String(page) });
    }
  });

  return params;
}

export default async function CategoryPagePagination({ params }: CategoryPageProps) {
  const { category, page } = await params;
  const currentPage = parseInt(page, 10);

  if (isNaN(currentPage) || currentPage < 2) {
    notFound();
  }

  const posts = getPaginatedPostsByCategory(category, currentPage, {
    nonFeaturedOnly: true,
  });
  const totalPages = getTotalPagesByCategory(category);
  const categoryData = getCategoryBySlug(category);

  if (totalPages === 0 || totalPages < currentPage || !categoryData) {
    notFound();
  }

  return (
    <div className="flex min-w-0 flex-col">
      <h1 className="sr-only">
        Blog - {categoryData.title} - page {page}
      </h1>
      <PostsList posts={posts} />
      {totalPages > 1 && (
        <div className="mt-14 flex justify-center md:mt-20">
          <Pagination
            className="w-fit"
            currentPage={currentPage}
            pageCount={totalPages}
            path={category}
          />
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category, page } = await params;
  const categoryData = getCategoryBySlug(category);

  if (!categoryData) {
    return {};
  }

  return getMetadata({
    title: `Blog: ${categoryData.title}`,
    description: `${categoryData.title} Read the latest articles, news, and reviews on our blog`,
    pathname: `/blog/category/${category}/page/${page}`,
  });
}
