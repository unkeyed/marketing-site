import Image from "next/image";
import type { StaticImageData } from "next/image";

import { Badge, Card, Container } from "@/components/ui";
import gatewayAnalyticsGraphic from "@/images/pages/home/gateway/analytics.png";
import gatewayAuthGraphic from "@/images/pages/home/gateway/auth.png";
import gatewayGlobalGraphic from "@/images/pages/home/gateway/global.png";
import gatewayRateGraphic from "@/images/pages/home/gateway/rate.png";
import gatewayValidationGraphic from "@/images/pages/home/gateway/validation.png";
import { cn } from "@/lib/utils";

import Section from "./section";

function GatewayCard({
  title,
  body,
  graphic,
  graphicAlt,
  imageClassName = "object-cover",
  imageWrapperClassName,
  textWidthClass = "max-w-[352px]",
  fullBleedImage = false,
  useTextBackground = false,
  className,
}: {
  title: string;
  body: string;
  graphic: StaticImageData;
  graphicAlt: string;
  imageClassName?: string;
  imageWrapperClassName?: string;
  textWidthClass?: string;
  fullBleedImage?: boolean;
  useTextBackground?: boolean;
  className?: string;
}) {
  const textContent = useTextBackground ? (
    <span className="inline box-decoration-clone bg-ink px-1.5 py-2 leading-[1.75]">
      <span className="font-medium text-white">{title}.</span>{" "}
      <span>{body}</span>
    </span>
  ) : (
    <>
      <span className="font-medium text-white">{title}.</span>{" "}
      <span>{body}</span>
    </>
  );

  const textBlock = (
    <p className="relative z-10 px-6 pb-3 pt-6 text-base leading-snug text-muted-3 md:px-8 md:pb-4 md:pt-7 xl:pt-8">
      <span className={`block max-w-full ${textWidthClass}`}>
        {textContent}
      </span>
    </p>
  );

  const imgEl = (
    <Image
      alt={graphicAlt}
      className={imageClassName}
      fill
      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
      src={graphic}
    />
  );

  if (fullBleedImage) {
    return (
      <Card className={cn("relative w-full overflow-hidden", className)}>
        {imageWrapperClassName ? (
          <div className={imageWrapperClassName}>{imgEl}</div>
        ) : (
          imgEl
        )}
        {textBlock}
      </Card>
    );
  }

  return (
    <Card
      className={cn("grid w-full grid-rows-[auto_1fr] overflow-hidden", className)}
    >
      {textBlock}
      <div className="relative z-0 min-h-0 overflow-hidden">
        {imageWrapperClassName ? (
          <div className={imageWrapperClassName}>{imgEl}</div>
        ) : (
          imgEl
        )}
      </div>
    </Card>
  );
}

export default function GatewaySection() {
  return (
    <Section className="pt-20 md:pt-[140px] xl:pt-[260px]">
      <Container className="flex flex-col items-center gap-8">
        <Badge labelClassName="tracking-[0.42px]">Gateway</Badge>
        <h2 className="font-display max-w-[1177px] text-center text-[30px] leading-[1.125] text-white sm:text-[40px] xl:text-[52px]">
          Protect and control traffic at the edge. Offload access control and
          rate limiting to global gateways.
        </h2>

        <div className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:mt-10 xl:mt-[57px] xl:grid-cols-3 xl:grid-rows-[446px_446px] xl:gap-2.5">
          {/* Auth + Keys — top left, image behind text with consistent padding */}
          <GatewayCard
            title="Auth + Keys"
            body="Manage API keys end to end and control who can call what."
            graphic={gatewayAuthGraphic}
            graphicAlt="Auth and keys graphic"
            fullBleedImage
            useTextBackground
            imageWrapperClassName="absolute inset-6 md:inset-8 overflow-hidden"
            imageClassName="object-cover object-bottom"
            textWidthClass="max-w-[352px]"
            className="h-[clamp(360px,74vw,500px)] sm:h-[446px] xl:h-auto sm:col-start-1 sm:row-start-1 xl:col-start-1 xl:row-start-1"
          />

          {/* Global platform — center, spans 2 rows */}
          <GatewayCard
            title="Global platform"
            body="Edge gateway enforces access and routes requests to the closest instance for low latency."
            graphic={gatewayGlobalGraphic}
            graphicAlt="Global platform graphic"
            fullBleedImage
            imageClassName="max-[425px]:object-contain max-[425px]:object-bottom min-[426px]:object-cover min-[426px]:object-top"
            textWidthClass="max-w-[360px]"
            className="min-h-[540px] aspect-[505/902] sm:aspect-auto sm:h-auto sm:min-h-0 sm:col-start-2 sm:row-start-1 sm:row-span-2 xl:col-start-2 xl:row-span-2"
          />

          {/* Rate limits — bottom left, safe zones on all sides, image clips right+bottom */}
          <GatewayCard
            title="Rate limits"
            body="Set limits per IP, user, or key and enforce them close to your users."
            graphic={gatewayRateGraphic}
            graphicAlt="Rate limits graphic"
            imageWrapperClassName="absolute inset-4 xl:left-[28px] xl:right-[28px] xl:top-[28px] xl:bottom-8 overflow-hidden"
            imageClassName="object-cover object-left-top"
            className="h-[clamp(360px,74vw,500px)] sm:h-[446px] xl:h-auto sm:col-start-1 sm:row-start-2 xl:col-start-1 xl:row-start-2"
          />

          {/* Validation — top right, safe zones on all sides, image clips right+bottom */}
          <GatewayCard
            title="Validation"
            body="Enforce request rules early to catch bad traffic before it hits your API."
            graphic={gatewayValidationGraphic}
            graphicAlt="Validation graphic"
            imageWrapperClassName="absolute inset-6 md:inset-8 xl:right-[31px] overflow-hidden"
            imageClassName="object-cover object-left-top"
            className="h-[clamp(360px,74vw,500px)] sm:h-[446px] xl:h-auto sm:col-start-1 sm:row-start-3 xl:col-start-3 xl:row-start-1"
          />

          {/* Analytics — bottom right, full-bleed spotlight */}
          <GatewayCard
            title="Analytics"
            body="Access real-time insights into your API usage without adding custom instrumentation."
            graphic={gatewayAnalyticsGraphic}
            graphicAlt="Analytics graphic"
            fullBleedImage
            textWidthClass="max-w-[384px]"
            imageClassName="object-cover"
            className="h-[clamp(360px,74vw,500px)] sm:h-[446px] xl:h-auto sm:col-start-2 sm:row-start-3 xl:col-start-3 xl:row-start-2"
          />
        </div>
      </Container>
    </Section>
  );
}
