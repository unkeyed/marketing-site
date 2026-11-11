import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAllCareers, getCareerBySlug } from '@/lib/careers/posts';
import { getMetadata } from '@/lib/get-metadata';
import { compileMdx } from '@/lib/markdown';
import { Badge } from '@/components/ui/badge';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import ArticleWithSidebar from '@/components/pages/article-with-sidebar';
import BackToTop from '@/components/pages/back-to-top';
import RoleDetails from '@/components/pages/careers/role-details';
import TableOfContents from '@/components/pages/table-of-contents';

interface ICareerPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CareerPage({ params }: ICareerPageProps) {
  const { slug } = await params;
  const career = getCareerBySlug(slug);
  if (!career) notFound();

  const { content, toc } = await compileMdx(career.content);

  return (
    <main className="pt-8 pb-24 md:pt-11 md:pb-32 lg:pt-21">
      <ArticleWithSidebar
        header={
          <>
            <Breadcrumbs
              items={[{ label: 'Careers', href: '/careers' }, { label: career.title }]}
              showBackIconOnFirst
            />
            <Badge variant="uppercase" size="sm" className="mt-8">
              {career.department}
            </Badge>
            <h1 className="mt-4 font-display text-4xl leading-[1.125] font-normal md:text-5xl xl:text-[3.5rem]">
              {career.title}
            </h1>
            <p className="mt-5 text-lg leading-snug tracking-tight text-gray-60 md:text-xl lg:text-2xl">
              {career.description}
            </p>
            <Button asChild size="sm" className="mt-6">
              <a href={career.applicationUrl}>Apply for this role</a>
            </Button>
            <RoleDetails
              stats={career.stats}
              className="mt-8 border-y border-border py-6 lg:hidden"
            />
          </>
        }
        content={content}
        contentClassName="prose-clear-first-child prose-lg"
        sidebar={
          <>
            <RoleDetails stats={career.stats} />
            <span className="my-5 h-px w-full bg-border" aria-hidden />
            <TableOfContents className="mt-0" title="On this page" items={toc} />
            <BackToTop withSeparator />
          </>
        }
      />
    </main>
  );
}

export function generateStaticParams() {
  return getAllCareers().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ICareerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = getCareerBySlug(slug);
  if (!career) return {};

  return getMetadata({
    title: career.title,
    description: career.description,
    pathname: career.pathname,
  });
}
