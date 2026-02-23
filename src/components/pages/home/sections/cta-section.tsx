import Image from "next/image";

import { Button, Container } from "@/components/ui";
import ctaVisual from "@/images/pages/home/cta/visual.png";
import Section from "./section";

export default function CtaSection() {
  return (
    <Section className="relative mt-20 h-[460px] bg-panel md:mt-[140px] md:h-[520px] xl:mt-[200px] xl:h-[546px]">
      <Image
        alt=""
        fill
        sizes="100vw"
        className="z-0 object-cover"
        src={ctaVisual}
      />
      <Container className="relative z-10 flex h-full flex-col pt-12 pb-10 md:pt-[64px] md:pb-[51px]">
        <div className="font-display max-w-[576px] text-[28px] leading-[1.125] text-white md:text-[32px]">
          <span className="block">Turn your API stack into one workflow.</span>
          <span className="block text-muted">
            Start for free, integrate in minutes, and scale when you need to.
          </span>
        </div>
        <Button className="mt-auto h-[44px] w-[134px] px-5 py-3.5 text-base leading-none tracking-[-0.4px]">
          Start for free
        </Button>
      </Container>
    </Section>
  );
}
