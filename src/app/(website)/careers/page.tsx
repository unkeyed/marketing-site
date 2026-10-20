import NextLink from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getAllCareers } from '@/lib/careers/posts';
import { getMetadata } from '@/lib/get-metadata';
import { Badge } from '@/components/ui/badge';
import Hero from '@/components/pages/blog/hero--blog';

export const metadata = getMetadata({
  title: 'Careers',
  description: 'Build the developer platform for modern APIs with Unkey.',
  pathname: '/careers',
});

export default function CareersPage() {
  const careers = getAllCareers();

  return (
    <main className="pt-10 md:pt-24">
      <Hero
        title={'Build the best\ndeveloper platform.'}
        description="We’re a small, remote team building infrastructure for APIs with high ownership and agency."
        className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end lg:gap-8 2xl:gap-8"
        titleClassName="!leading-[1.125] text-[1.8rem] min-[380px]:text-[2rem] md:text-[2.5rem] lg:text-[3rem]"
        descriptionClassName="text-base !tracking-[-0.01em] md:text-lg"
      />
      <section
        aria-labelledby="roles-heading"
        className="section-container mb-24 pt-12 md:mb-32 xl:pt-21.5"
      >
        {careers.length === 0 ? (
          <div className="border-t border-border pt-8 md:pt-10">
            <h2 id="roles-heading" className="text-xl font-medium tracking-tight md:text-2xl">
              No open roles right now.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Think you’d be a good fit? Tell us what you’d like to work on.
            </p>
            <a
              href="mailto:jobs@unkey.com"
              className="group mt-6 inline-flex items-center gap-1 text-base font-medium text-primary"
            >
              Get in touch
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-3">
              <h2 id="roles-heading" className="text-xl font-medium tracking-tight">
                Open roles
              </h2>
            </div>
            <div className="grid gap-px border border-border bg-border lg:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
              {careers.map((career) => (
                <article
                  key={career.slug}
                  className="flex flex-col items-start bg-background p-6 lg:p-10"
                >
                  <Badge variant="uppercase" size="sm">
                    {career.department}
                  </Badge>
                  <h3 className="mt-8 text-2xl leading-snug font-normal tracking-tight">
                    {career.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {career.description}
                  </p>
                  <p className="mt-6 mb-8 text-sm text-muted-foreground">
                    {career.stats[0]?.content}
                  </p>
                  <NextLink
                    href={career.pathname}
                    aria-label={`View role: ${career.title}`}
                    className="group mt-auto inline-flex items-center gap-1 text-base font-medium text-primary"
                  >
                    View role
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </NextLink>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
