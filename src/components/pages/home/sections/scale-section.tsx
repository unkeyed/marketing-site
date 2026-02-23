import Image from "next/image";

import { Badge, Button, Container } from "@/components/ui";
import multiregionIcon from "@/images/pages/home/scale/multiregion.svg";
import pricingIcon from "@/images/pages/home/scale/pricing.svg";
import protectionIcon from "@/images/pages/home/scale/protection.svg";
import scalingIcon from "@/images/pages/home/scale/scaling.svg";
import Section from "./section";

const scaleFeatures = [
  {
    title: "Multi-region routing",
    text: "Route requests to the nearest region for consistently low latency.",
    icon: multiregionIcon,
  },
  {
    title: "Automatic scaling",
    text: "Capacity follows demand, with no knobs to babysit and no manual ops.",
    icon: scalingIcon,
  },
  {
    title: "Predictable pricing",
    text: "Start free, then scale up when you're ready and keep billing predictable as you grow.",
    icon: pricingIcon,
  },
  {
    title: "Built-in protection",
    text: "Lock down access with API keys, edge rate limits, and instant revoke controls.",
    icon: protectionIcon,
  },
];

export default function ScaleSection() {
  return (
    <Section className="relative mt-20 md:mt-[140px] xl:mt-[200px]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#b6cdfb_0%,#ecf2fe_80.629%)]" />
      <Container className="relative py-16 md:py-24 xl:py-[192px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="flex max-w-[704px] flex-col gap-8">
            <Badge
              variant="light"
              className="w-[88px]"
              labelClassName="leading-snug tracking-[0.42px]"
            >
              Scale
            </Badge>
            <h2 className="font-display text-balance text-[30px] leading-[1.2] text-ink sm:text-[36px] lg:text-[44px] lg:leading-[1.25]">
              Start small, scale to global traffic, and{" "}
              <span className="inline-flex h-[34px] items-center bg-accent px-[4px] sm:h-[38px] lg:h-[42px]">
                stay protected
              </span>
              {" "}without managing infrastructure manually.
            </h2>
          </div>
          <div className="flex max-w-[416px] flex-col gap-6 lg:pt-[75px]">
            <p className="text-lg leading-snug tracking-[-0.2px] text-border md:text-xl">
              Platform that scales with you. Control, routing, and traffic
              handling are designed for multi-region from day one.
            </p>
            <Button
              variant="dark"
              className="h-[44px] w-fit px-5 py-3.5 text-base leading-none tracking-[-0.4px]"
            >
              Read the docs
            </Button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 xl:mt-[200px] xl:grid-cols-4 xl:gap-6">
          {scaleFeatures.map((item) => (
            <div
              className="flex max-w-[320px] flex-col gap-8 xl:gap-[44px]"
              key={item.title}
            >
              <Image
                alt={item.title}
                width={148}
                height={148}
                className="h-[120px] w-[120px] md:h-[148px] md:w-[148px]"
                src={item.icon}
              />
              <div className="flex flex-col gap-5">
                <p className="font-display text-[24px] leading-[1.125] text-ink md:text-[28px]">
                  {item.title}
                </p>
                <p className="text-base leading-snug tracking-[-0.16px] text-slate">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
