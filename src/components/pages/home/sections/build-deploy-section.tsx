"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

import { Badge, Button, Container } from "@/components/ui";
import connectImage from "@/images/pages/home/build-deploy/connect.png";
import deployImage from "@/images/pages/home/build-deploy/deploy.png";
import goLogo from "@/images/pages/home/build-deploy/logos/go.svg";
import javaLogo from "@/images/pages/home/build-deploy/logos/java.svg";
import pythonLogo from "@/images/pages/home/build-deploy/logos/python.svg";
import typeScriptLogo from "@/images/pages/home/build-deploy/logos/typescript.svg";
import previewImage from "@/images/pages/home/build-deploy/preview.png";
import shipImage from "@/images/pages/home/build-deploy/ship.png";
import validateImage from "@/images/pages/home/build-deploy/validate.png";
import { cn } from "@/lib/utils";

import Section from "./section";

type BuildRow = {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  body: string;
  image: StaticImageData;
  imageAlt: string;
  hasLogos?: boolean;
  textTopClass?: string;
};

export const buildRows: BuildRow[] = [
  {
    id: "connect",
    tabLabel: "Connect",
    title: "Connect a repo and push code",
    subtitle: "Git-based deploys, zero setup",
    body: "Link your Git repository once and deploy automatically on every push. No complex pipelines or manual steps needed.",
    image: connectImage,
    imageAlt: "Connect repository interface",
  },
  {
    id: "deploy",
    tabLabel: "Deploy",
    title: "Deploy Docker containers",
    subtitle: "Any language, any framework",
    body: "Run real containers that stay online, keeping the serverless feel while avoiding short-lived runtimes.",
    image: deployImage,
    imageAlt: "Container runtime configuration",
    hasLogos: true,
  },
  {
    id: "preview",
    tabLabel: "Preview",
    title: "Previews for every commit",
    subtitle: "Test every commit before it ships",
    body: "Test changes in a separate environment, then promote when the results look right.",
    image: previewImage,
    imageAlt: "Preview deployments list",
  },
  {
    id: "ship",
    tabLabel: "Ship",
    title: "Ship immutable versions",
    subtitle: "Instant rollbacks, no guesswork",
    body: "Keep releases safe with fast rollback paths, switch back instantly without redeploying. The previous production instance stays running for 30 minutes.",
    image: shipImage,
    imageAlt: "Rollback to version interface",
  },
  {
    id: "validate",
    tabLabel: "Validate",
    title: "Validate releases automatically",
    subtitle: "Branch protection & OpenAPI checks",
    body: "Make it really hard to ship broken APIs. OpenAPI diffs automatically flag breaking changes before they hit production.",
    image: validateImage,
    imageAlt: "View changes diff interface",
    textTopClass: "lg:pt-[126px]",
  },
];

function DeployLogosRow() {
  return (
    <div className="flex flex-wrap items-end gap-4 sm:gap-6">
      <img
        alt="Python"
        className="h-[28px] w-[112px]"
        src={pythonLogo.src}
      />
      <div className="relative h-[28px] w-[110.25px] overflow-hidden">
        <div className="absolute inset-[9.38%_7.64%_9.38%_6.29%]">
          <img
            alt="TypeScript"
            className="block h-full w-full"
            src={typeScriptLogo.src}
          />
        </div>
      </div>
      <div className="relative h-[28px] w-[74.979px] overflow-hidden">
        <img
          alt="Go"
          className="block h-full w-full"
          src={goLogo.src}
        />
      </div>
      <div className="relative h-[40px] w-[97px] overflow-hidden">
        <div className="absolute inset-[2.01%_4.74%_0.37%_8.44%]">
          <img
            alt="Java"
            className="block h-full w-full"
            src={javaLogo.src}
          />
        </div>
      </div>
    </div>
  );
}

function ContentPanel({
  row,
  isLast,
}: {
  row: BuildRow;
  isLast: boolean;
}) {
  return (
    <>
      <div
        id={row.id}
        className="grid min-h-[628px] grid-cols-1 scroll-mt-[220px] lg:min-h-[clamp(540px,41vw,628px)] lg:grid-cols-2 lg:scroll-mt-[410px]"
      >
        <div
          className={cn(
            "flex flex-col border border-border px-5 py-10 md:px-10 lg:border-r-0 lg:px-16 lg:py-0 xl:px-24",
            row.textTopClass ?? "lg:pt-[137px]",
          )}
        >
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex flex-col text-[24px] leading-[1.125] tracking-[-0.56px] sm:text-[28px]">
              <p className="text-white">{row.title}</p>
              <p className="text-muted">{row.subtitle}</p>
            </div>
            <p className="max-w-[448px] text-base leading-snug text-muted-4">
              {row.body}
            </p>
          </div>
          {row.hasLogos && (
            <div className="mt-8 lg:mb-[140px]">
              <DeployLogosRow />
            </div>
          )}
        </div>
        <div className="border-x border-b border-border lg:border">
          <Image
            alt={row.imageAlt}
            width={1536}
            height={1256}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full object-cover"
            src={row.image}
          />
        </div>
      </div>
      {!isLast && (
        <div
          className="h-16 border-l border-r border-border"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(46,48,56,0.45) 0 1px, rgba(0,0,0,0) 1px 8px)",
          }}
        />
      )}
    </>
  );
}

export default function BuildDeploySection({
  activeTab,
  onTabClick,
}: {
  activeTab: string;
  onTabClick: (id: string) => void;
}) {
  const tabsViewportRef = useRef<HTMLDivElement | null>(null);
  const stickyRows = buildRows.slice(0, -1);
  const lastRow = buildRows[buildRows.length - 1];

  useEffect(() => {
    const tabsViewport = tabsViewportRef.current;
    if (!tabsViewport) {
      return;
    }

    const activeButton = tabsViewport.querySelector<HTMLButtonElement>(
      `button[data-build-tab="${activeTab}"]`,
    );
    if (!activeButton) {
      return;
    }

    const targetLeft =
      activeButton.offsetLeft -
      (tabsViewport.clientWidth - activeButton.offsetWidth) / 2;
    const maxLeft = tabsViewport.scrollWidth - tabsViewport.clientWidth;
    const clampedLeft = Math.max(0, Math.min(targetLeft, maxLeft));
    const needsScroll = Math.abs(tabsViewport.scrollLeft - clampedLeft) > 2;

    if (needsScroll) {
      tabsViewport.scrollTo({ left: clampedLeft, behavior: "smooth" });
    }
  }, [activeTab]);

  return (
    <Section className="pt-20 md:pt-[120px] xl:pt-[180px]">
      <Container className="flex flex-col">
        {/* Sticky scope: header + first 4 panels + separator after "Ship" */}
        <div>
          <div className="sticky top-0 z-20 bg-ink pt-8 md:pt-12 xl:pt-[80px]">
            <Badge className="w-fit" labelClassName="tracking-[0.42px]">
              Build & Deploy
            </Badge>

            <div className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[60fr_40fr] lg:gap-8">
              <h2 className="font-display text-[30px] leading-[1.125] text-white sm:text-[40px] xl:text-[52px]">
                Deploy in minutes. Roll back in seconds. Ship with confidence at
                any scale.
              </h2>
              <p className="max-w-[416px] text-lg leading-snug tracking-[-0.2px] text-muted-2 md:text-xl lg:mt-[31px] lg:ml-auto">
                Infrastructure that moves with your code. Review changes in
                preview, then promote the exact version you tested.
              </p>
            </div>

            <div
              className="mt-8 h-16 overflow-x-auto border-b border-border md:mt-12 xl:mt-[80px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              ref={tabsViewportRef}
            >
              <div className="grid h-full min-w-[660px] grid-cols-5 md:min-w-0 md:w-full">
                {buildRows.map((row, index) => (
                  <Button
                    key={row.id}
                    variant="unstyled"
                    className={cn(
                      "flex h-full w-full items-center justify-center border-l border-t border-border px-4 text-base font-normal leading-[1.125] sm:text-lg md:text-xl",
                      index === buildRows.length - 1 && "border-r",
                      activeTab === row.id && "bg-panel",
                    )}
                    data-build-tab={row.id}
                    onClick={() => onTabClick(row.id)}
                    type="button"
                  >
                    <span
                      className={cn(
                        activeTab === row.id ? "text-white" : "text-muted",
                      )}
                    >
                      {row.tabLabel}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="-mt-px">
            {stickyRows.map((row) => (
              <ContentPanel key={row.id} row={row} isLast={false} />
            ))}
          </div>
        </div>

        {/* Last panel outside sticky scope — header unsticks at separator above */}
        <div className="-mt-px">
          <ContentPanel key={lastRow.id} row={lastRow} isLast />
        </div>
      </Container>
    </Section>
  );
}
