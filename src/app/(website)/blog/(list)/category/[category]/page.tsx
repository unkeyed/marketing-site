import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ICategory } from '@/types/blog';
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
  }>;
}

export async function generateStaticParams() {
  const categories = getCategories();

  return categories.map((category: ICategory) => ({
    category: category.slug.current,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const currentPage = 1;

  const posts = getPaginatedPostsByCategory(category, currentPage, {
    nonFeaturedOnly: true,
  });
  const totalPages = getTotalPagesByCategory(category);
  const categoryData = getCategoryBySlug(category);

  if (totalPages === 0 || !categoryData) {
    notFound();
  }

  return (
    <div className="flex min-w-0 flex-col">
      <h1 className="sr-only">Blog - {categoryData.title}</h1>
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
  const { category } = await params;
  const categoryData = getCategoryBySlug(category);

  if (!categoryData) {
    return {};
  }

  return getMetadata({
    title: `Blog: ${categoryData.title}`,
    description: `${categoryData.title} Read the latest articles, news, and reviews on our blog`,
    pathname: `/blog/category/${category}`,
  });
}
