import { Metadata } from 'next';
import { homeContentData, homePageData } from '@/constants/home';

import { getMetadata } from '@/lib/get-metadata';
import BuildDeploy from '@/components/pages/home/build-deploy';
import ControlPlane from '@/components/pages/home/control-plane';
import Cta from '@/components/pages/home/cta';
import Gateway from '@/components/pages/home/gateway';
import Hero from '@/components/pages/home/hero';
import Observe from '@/components/pages/home/observe';
import Portal from '@/components/pages/home/portal';
import Production from '@/components/pages/home/production';
import Scale from '@/components/pages/home/scale';

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
      <Hero {...hero} />
      <ControlPlane {...controlPlane} />
      <BuildDeploy {...buildDeploy} />
      <Gateway {...gateway} />
      <Production {...production} />
      <Scale {...scale} />
      <Observe {...observe} />
      <Portal {...portal} />
      <Cta {...cta} />
    </main>
  );
}
