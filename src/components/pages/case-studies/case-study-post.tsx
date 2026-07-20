import { ICaseStudy } from '@/types/case-study';
import { RelatedPostCard, RelatedPosts } from '@/components/content/related-posts';
import ArticleWithSidebar from '@/components/pages/article-with-sidebar';
import BackToTop from '@/components/pages/back-to-top';
import CaseStudyCompanyOverview from '@/components/pages/case-studies/case-study-company-overview';
import PostHeader from '@/components/pages/post-header';
import TableOfContents from '@/components/pages/table-of-contents';

interface ICaseStudyPostProps {
  className?: string;
  caseStudy: ICaseStudy;
}

function CaseStudyPost({ className, caseStudy }: ICaseStudyPostProps) {
  const breadcrumbItems = [
    { label: 'Case Studies', href: '/case-studies' },
    { label: caseStudy.title },
  ];

  return (
    <ArticleWithSidebar
      className={className}
      header={<PostHeader post={caseStudy} breadcrumbItems={breadcrumbItems} />}
      content={
        <>
          {caseStudy.content}
          {caseStudy.readMore.length > 0 ? (
            <RelatedPosts className="mt-11 md:mt-14" title="Read more">
              {caseStudy.readMore.map((item) => (
                <RelatedPostCard
                  key={item.pathname}
                  authors={item.authors}
                  categoryTitle={item.categoryTitle}
                  title={item.title}
                  pathname={item.pathname}
                />
              ))}
            </RelatedPosts>
          ) : null}
        </>
      }
      contentClassName="prose-clear-first-child prose-lg"
      sidebar={
        <>
          {caseStudy.companyOverview ? (
            <>
              <CaseStudyCompanyOverview
                logoSrc={caseStudy.companyOverview.logoSrc}
                logoAlt={caseStudy.companyOverview.logoAlt}
                logoWidth={caseStudy.companyOverview.logoWidth}
                logoHeight={caseStudy.companyOverview.logoHeight}
                items={caseStudy.companyOverview.items}
              />
              <span className="my-5 h-px w-full bg-border" aria-hidden role="none" />
            </>
          ) : null}
          <TableOfContents
            className="mt-0"
            title="On this page"
            items={caseStudy.tableOfContents}
          />
          <BackToTop withSeparator />
        </>
      }
    />
  );
}

export default CaseStudyPost;
