import Image from "next/image";

import { Badge, Button, Container } from "@/components/ui";
import dashboardGraphic from "@/images/pages/home/observe/dashboard.png";
import Section from "./section";

type ObserveColumn = {
  lead: string;
  rest: string;
};

const observeColumns: ObserveColumn[] = [
  {
    lead: "Automatic logs and metrics collection.",
    rest: "Captures verifications, rate limits, audit logs, HTTP request/response logs, and much more automatically.",
  },
  {
    lead: "Spot spikes and unusual patterns.",
    rest: "Use metrics to flag anomalies, errors, and performance issues \u2014 and feed signals into your alerting stack.",
  },
  {
    lead: "Debug and explore in the dashboard.",
    rest: "Filter by deployment, user, region, custom tags, and status to quickly understand what\u2019s going on.",
  },
  {
    lead: "Query via API, from your own systems.",
    rest: "Run analytics queries over your verification data via the HTTP API from your stack.",
  },
];

export default function ObserveSection() {
  return (
    <Section className="mt-20 md:mt-[140px] xl:mt-[200px]">
      <Container className="flex flex-col">
        <div className="relative h-[420px] max-[351px]:h-[500px] md:h-[520px] xl:h-[610px]">
          <div className="absolute left-0 top-0 z-[1] h-[220px] w-full bg-ink max-[351px]:h-[300px] md:h-[200px] xl:h-[187px] xl:max-w-[960px]" />
          <div className="relative z-10 flex h-[220px] w-full flex-col gap-6 pb-5 max-[351px]:h-[300px] max-[351px]:pb-12 md:h-[200px] xl:h-[187px] xl:max-w-[960px] xl:gap-8">
            <Badge
              className="h-[35px] w-[106px]"
              labelClassName="leading-snug tracking-[0.42px]"
            >
              Observe
            </Badge>
            <h2 className="font-display max-w-[960px] text-[30px] leading-[1.125] text-white sm:text-[36px] xl:text-[44px]">
              Stay in sync with your traffic in real time.
              <span className="block text-muted">
                Every request is logged. Every decision is visible.
              </span>
            </h2>
          </div>
          <Image
            alt="Observability dashboard"
            width={3072}
            height={1202}
            sizes="100vw"
            className="absolute left-0 top-[40px] z-0 h-[380px] w-full object-cover object-[72%_50%] max-[351px]:top-[124px] max-[351px]:h-[360px] lg:object-center md:top-[60px] md:h-[460px] lg:top-[52px] lg:h-[470px] xl:top-[1px] xl:h-[600px]"
            src={dashboardGraphic}
          />
        </div>

        <div className="mt-10 grid gap-8 md:mt-12 xl:mt-[88px] xl:grid-cols-[35fr_65fr] xl:gap-4">
          <div className="order-1 grid max-w-[992px] grid-cols-1 gap-10 text-base leading-snug sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 md:text-lg xl:order-2 xl:grid-cols-[384px_384px] xl:gap-x-56 xl:gap-y-20">
            {observeColumns.map((column) => (
              <p className="max-w-[384px]" key={column.lead}>
                <span className="font-medium text-white">{column.lead} </span>
                <span className="text-muted">{column.rest}</span>
              </p>
            ))}
          </div>
          <div className="order-2 xl:order-1">
            <Button className="h-[44px] w-[145px] px-5 py-3.5 text-base leading-none tracking-[-0.4px]">
              Read the docs
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
