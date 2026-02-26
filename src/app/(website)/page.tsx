import { Metadata } from 'next';

import { getMetadata } from '@/lib/get-metadata';
import BentoGateway from '@/components/pages/home/bento--gateway';
import CardsPortal from '@/components/pages/home/cards--portal';
import CtaFullbleedImage from '@/components/pages/home/cta--fullbleed-image';
import { homeContentData, homePageData } from '@/components/pages/home/data/content-data';
import FeatureProduction from '@/components/pages/home/feature--production';
import FeaturesBuildDeploy from '@/components/pages/home/features--build-deploy';
import FeaturesControlPlane from '@/components/pages/home/features--control-plane';
import HeroVideoFullwidth from '@/components/pages/home/hero--video-fullwidth';
import SectionObserve from '@/components/pages/home/section--observe';
import SectionScale from '@/components/pages/home/section--scale';

export const metadata: Metadata = getMetadata({
  title: homePageData.metadata?.title,
  description: homePageData.metadata?.description,
  pathname: homePageData.pathname,
});

export default function HomePage() {
  const { hero, controlPlane, buildDeploy, gateway, production, scale, observe, portal, cta } =
    homeContentData;

  return (
    <main className="relative w-full overflow-x-clip bg-background text-white">
      <HeroVideoFullwidth {...hero} />
      <FeaturesControlPlane {...controlPlane} />
      <FeaturesBuildDeploy {...buildDeploy} />
      <BentoGateway {...gateway} />
      <FeatureProduction {...production} />
      <SectionScale {...scale} />
      <SectionObserve {...observe} />
      <CardsPortal {...portal} />
      <CtaFullbleedImage {...cta} />
    </main>
  );
}
