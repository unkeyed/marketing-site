import Image from "next/image";
import type { StaticImageData } from "next/image";

import { Card, Container } from "@/components/ui";
import branchGraphic from "@/images/pages/home/control-plane/branch.png";
import controlGraphic from "@/images/pages/home/control-plane/control.png";
import keysGraphic from "@/images/pages/home/control-plane/keys.png";
import usageGraphic from "@/images/pages/home/control-plane/usage.png";
import { cn, splitLeadSentence } from "@/lib/utils";

import Section from "./section";

type FeatureCardConfig = {
  id: string;
  title: string;
  body: string;
  graphic: StaticImageData;
  graphicAlt: string;
};

const featureCards: FeatureCardConfig[] = [
  {
    id: "branch",
    title: "Branch Overview",
    body: "Faster to ship. Go from code to running API in minutes. Test safely, promote when ready, roll back if needed.",
    graphic: branchGraphic,
    graphicAlt: "Branch overview graphic",
  },
  {
    id: "keys",
    title: "Manage API Keys",
    body: "Safer by default. Protect every endpoint with keys, rate limits, and instant access revocation out of the box.",
    graphic: keysGraphic,
    graphicAlt: "API keys graphic",
  },
  {
    id: "control",
    title: "Control Plane",
    body: "Simpler to run. One platform for deployments, gateways, and observability.",
    graphic: controlGraphic,
    graphicAlt: "Control plane graphic",
  },
  {
    id: "usage",
    title: "Usage 30 Days",
    body: "Visible from day one. Every request logged. Every decision tracked. Debug issues before users notice.",
    graphic: usageGraphic,
    graphicAlt: "Usage analytics graphic",
  },
];

function FeatureCard({
  title,
  body,
  graphic,
  graphicAlt,
  className,
}: {
  title: string;
  body: string;
  graphic: StaticImageData;
  graphicAlt: string;
  className?: string;
}) {
  const { lead, rest } = splitLeadSentence(body);

  return (
    <Card
      className={cn(
        "flex h-[429px] flex-col overflow-hidden px-6 pb-6 pt-[26px] xl:px-8 xl:pb-8",
        className,
      )}
      variant="outline"
    >
      <span className="font-mono text-[15px] leading-tight text-muted-5">
        {title}
      </span>
      <div className="relative min-h-0 flex-1">
        <Image
          alt={graphicAlt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 300px, 384px"
          className="object-contain object-left"
          src={graphic}
        />
      </div>
      <p className="text-base leading-snug text-muted-3">
        <span className="font-medium text-white">{lead}</span>
        {rest ? <span> {rest}</span> : null}
      </p>
    </Card>
  );
}

export default function ControlPlaneSection() {
  return (
    <Section className="pt-20 md:pt-[120px] xl:pt-[213px]">
      <Container className="relative flex flex-col">
        <div className="relative sm:pl-8">
          <div
            aria-hidden
            className="-top-20 md:-top-[120px] xl:-top-[213px] absolute bottom-0 left-0 hidden w-px bg-border sm:block"
          />
          <h2 className="font-display max-w-[639px] whitespace-pre-line text-[28px] md:text-[36px] lg:text-[44px] leading-[1.125] text-white">
            {"Unify your fragmented API stack with a single control plane for\n"}
            <span className="inline-flex h-[27px] md:h-[34px] lg:h-[42px] items-center bg-accent px-[4px] text-black box-decoration-clone">
              access and traffic.
            </span>
          </h2>
          <p className="mt-6 lg:mt-[44px] max-w-[576px] text-lg lg:text-xl leading-snug tracking-[-0.2px] text-muted-2">
            Stop assembling your API stack piece by piece. Running APIs at scale
            usually means juggling hosting, gateways, rate limits, and
            monitoring across multiple vendors.
          </p>
          <div className="mt-10 md:mt-16 xl:mt-[142px]" />
        </div>
        {/* Cards — vertical stack ≤639, horizontal scroll sm-xl, 4-across xl+ */}
        <div className="sm:-mx-5 md:-mx-8 xl:mx-0">
          <div className="snap-x snap-mandatory overflow-x-auto scroll-pl-5 md:scroll-pl-8 xl:scroll-pl-0 xl:overflow-visible xl:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col items-center gap-4 sm:w-max sm:flex-row sm:items-stretch sm:gap-0 sm:px-5 md:px-8 xl:w-auto xl:px-0">
              {featureCards.map((card, index) => (
                <FeatureCard
                  key={card.id}
                  title={card.title}
                  body={card.body}
                  graphic={card.graphic}
                  graphicAlt={card.graphicAlt}
                  className={cn(
                    "w-full max-w-[384px] sm:w-[300px] sm:max-w-none md:w-[340px] xl:w-auto xl:flex-1 sm:shrink-0 sm:snap-start",
                    index > 0 && "sm:-ml-px",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
