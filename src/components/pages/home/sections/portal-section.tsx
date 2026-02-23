import Image from "next/image";
import type { StaticImageData } from "next/image";

import { Badge, Button, Container } from "@/components/ui";
import docsGraphic from "@/images/pages/home/portal/docs.png";
import keysGraphic from "@/images/pages/home/portal/keys.png";
import zeroGraphic from "@/images/pages/home/portal/zero.png";
import { cn, splitLeadSentence } from "@/lib/utils";

import Section from "./section";

const portalCards = [
  {
    text: "Zero code required. A fully hosted developer portal with nothing to build or maintain.",
    graphic: zeroGraphic,
    graphicAlt: "Portal zero code graphic",
    textWidthClass: "max-w-[374px]",
  },
  {
    text: "Beautiful API docs. OpenAPI-generated documentation, hosted by Unkey and always in sync.",
    graphic: docsGraphic,
    graphicAlt: "Portal documentation graphic",
    textWidthClass: "max-w-[411px]",
  },
  {
    text: "Keys and usage, self-serve. Users manage their API keys and view usage without support requests.",
    graphic: keysGraphic,
    graphicAlt: "Portal keys graphic",
    textWidthClass: "max-w-[409px]",
  },
];

function PortalCard({
  text,
  graphic,
  graphicAlt,
  textWidthClass = "max-w-[374px]",
  className,
}: {
  text: string;
  graphic: StaticImageData;
  graphicAlt: string;
  textWidthClass?: string;
  className?: string;
}) {
  const { lead, rest } = splitLeadSentence(text);

  return (
    <div className={cn("relative flex h-[460px] w-full flex-col overflow-hidden border border-border bg-ink md:h-[500px] xl:h-[528px]", className)}>
      <div className="absolute inset-x-0 top-0 bottom-6 overflow-hidden lg:bottom-0">
        <Image
          alt={graphicAlt}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain object-top"
          src={graphic}
        />
      </div>
      <p className="absolute bottom-8 left-8 right-8 z-10 text-base leading-snug">
        <span className={cn("block", textWidthClass)}>
          <span className="font-medium text-white">{lead}</span>
          {rest ? <span className="text-muted-3"> {rest}</span> : null}
        </span>
      </p>
    </div>
  );
}

export default function PortalSection() {
  return (
    <Section className="pt-20 md:pt-[140px] xl:pt-[229px]">
      <Container className="flex flex-col gap-8">
        <Badge
          className="h-[35px] w-[220px]"
          labelClassName="leading-snug tracking-[0.3px]"
        >
          AIO Developer Portal
        </Badge>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <h2 className="font-display max-w-[960px] text-[30px] leading-[1.125] text-white sm:text-[36px] xl:text-[44px]">
            First-class developer experience for your users.
            <span className="block text-muted">
              API keys, usage, and docs&mdash;ready out of the box.
            </span>
          </h2>
          <Button className="h-[44px] w-[139px] px-5 py-3.5 text-base leading-none tracking-[-0.4px] lg:mt-14">
            Try the Portal
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 xl:mt-[56px] xl:grid-cols-3 xl:gap-0">
          {portalCards.map((item, index) => (
            <PortalCard
              key={item.graphicAlt}
              text={item.text}
              graphic={item.graphic}
              graphicAlt={item.graphicAlt}
              textWidthClass={item.textWidthClass}
              className={index > 0 ? "xl:-ml-px" : undefined}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
