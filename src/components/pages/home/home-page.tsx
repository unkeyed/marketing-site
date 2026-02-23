"use client";

import { useEffect, useState } from "react";

import {
  BuildDeploySection,
  ControlPlaneSection,
  CtaSection,
  FooterSection,
  GatewaySection,
  HeroSection,
  ObserveSection,
  PortalSection,
  ProductionSection,
  ScaleSection,
  buildRows,
} from "@/components/pages/home/sections";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(buildRows[0]?.id ?? "connect");

  useEffect(() => {
    const sections = buildRows
      .map((row) => document.getElementById(row.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) {
      return;
    }

    const getActiveId = () => {
      const viewportProbe = Math.round(window.innerHeight * 0.42);
      const matching = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= viewportProbe && rect.bottom > viewportProbe;
      });

      if (matching) {
        return matching.id;
      }

      const nearest = sections.reduce(
        (best, section) => {
          const distance = Math.abs(
            section.getBoundingClientRect().top - viewportProbe,
          );
          return distance < best.distance ? { id: section.id, distance } : best;
        },
        { id: sections[0].id, distance: Number.POSITIVE_INFINITY },
      );

      return nearest.id;
    };

    let ticking = false;
    const updateActiveTab = () => {
      const id = getActiveId();
      setActiveTab((current) => (current === id ? current : id));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(updateActiveTab);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleTabClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="relative w-full overflow-x-clip bg-ink text-white">
      <HeroSection />
      <ControlPlaneSection />
      <BuildDeploySection activeTab={activeTab} onTabClick={handleTabClick} />
      <GatewaySection />
      <ProductionSection />
      <ScaleSection />
      <ObserveSection />
      <PortalSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
