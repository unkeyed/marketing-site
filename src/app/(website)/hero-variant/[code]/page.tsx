import type { Metadata } from 'next';
import { homeContentData, homePageData } from '@/constants/home';
import { homepageFlags, homepageHeroFlag } from '@/flags';
import { generatePermutations } from 'flags/next';
import { FlagValues } from 'flags/react';

import { getMetadata } from '@/lib/get-metadata';
import { homepageHeroVariantB } from '@/lib/homepage-hero';
import BuildDeploy from '@/components/pages/home/build-deploy';
import ControlPlane from '@/components/pages/home/control-plane';
import Cta from '@/components/pages/home/cta';
import Gateway from '@/components/pages/home/gateway';
import Hero from '@/components/pages/home/hero';
import { HeroExperimentAnalytics } from '@/components/pages/home/hero-experiment-analytics';
import Observe from '@/components/pages/home/observe';
import Portal from '@/components/pages/home/portal';
import Production from '@/components/pages/home/production';
import Scale from '@/components/pages/home/scale';

export const dynamic = 'force-static';
export const dynamicParams = false;

export const metadata: Metadata = getMetadata({
  tagline: homePageData.metadata?.tagline,
  description: homePageData.metadata?.description,
  pathname: homePageData.pathname,
});

export async function generateStaticParams() {
  const codes = await generatePermutations(homepageFlags);
  return codes.map((code) => ({ code }));
}

export default async function HomePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const variant = await homepageHeroFlag(code, homepageFlags);
  const { hero, controlPlane, buildDeploy, gateway, production, scale, observe, portal, cta } =
    homeContentData;

  return (
    <main
      className="relative w-full overflow-x-clip bg-background text-white"
      data-hero-variant={variant}
    >
      <FlagValues values={{ 'homepage-hero': variant }} />
      <HeroExperimentAnalytics variant={variant} />
      {variant === 'b' ? (
        <Hero
          {...hero}
          title={homepageHeroVariantB.heading}
          description={homepageHeroVariantB.subhead}
          paragraph={homepageHeroVariantB.paragraph}
        />
      ) : (
        <Hero {...hero} />
      )}
      <ControlPlane {...controlPlane} />
      <BuildDeploy {...buildDeploy} />
      <Gateway {...gateway} />
      <Production {...production} />
      <Scale {...scale} />
      <Observe {...observe} />
      <Portal {...portal} />
      <Cta {...cta} trackProperties={{ variant }} />
    </main>
  );
}
