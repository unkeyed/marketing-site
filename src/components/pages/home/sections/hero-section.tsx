"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button, Container } from "@/components/ui";
import blindpayLogo from "@/images/pages/home/hero/logos/blindpay.svg";
import calLogo from "@/images/pages/home/hero/logos/cal.svg";
import fireworksLogo from "@/images/pages/home/hero/logos/fireworks.svg";
import magicPatternsLogo from "@/images/pages/home/hero/logos/magicpatterns.svg";
import mintlifyIconLogo from "@/images/pages/home/hero/logos/mintlify-icon.svg";
import mintlifyMask from "@/images/pages/home/hero/logos/mintlify-mask.svg";
import mintlifyTextLogo from "@/images/pages/home/hero/logos/mintlify-text.svg";
import symbolicaLogo from "@/images/pages/home/hero/logos/symbolica.svg";
import heroBackground from "@/images/pages/home/hero/hero-bg.png";
import heroPoster from "@/images/pages/home/hero/hero-poster.jpg";
import chevronIcon from "@/images/pages/home/shared/chevron.png";
import discordIcon from "@/images/pages/home/shared/discord.png";
import UnkeyLogo from "@/images/pages/home/shared/unkey-logo.inline.svg";
import { cn } from "@/lib/utils";

import Section from "./section";

function HeroHeading({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h1
      className={[
        "font-display font-normal leading-[1.125] text-white whitespace-pre-wrap",
        "text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] xl:text-[64px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </h1>
  );
}

function HeroDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-[16px] font-normal leading-[1.375] tracking-[-0.16px] text-muted whitespace-pre-wrap",
        className,
      )}
    >
      {children}
    </p>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        !open && "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-[min(320px,85vw)] border-l border-border bg-ink shadow-xl transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex justify-end p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-white"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-6 px-6">
          <nav className="flex flex-col gap-1 text-sm font-medium leading-none tracking-[-0.35px] text-white">
            <div className="flex min-h-[44px] items-center gap-0.5 py-3">
              <span>Resources</span>
              <Image
                alt=""
                width={14}
                height={14}
                className="brightness-0 invert"
                src={chevronIcon}
              />
            </div>
            <span className="flex min-h-[44px] items-center py-3">
              Pricing
            </span>
            <span className="flex min-h-[44px] items-center py-3">Docs</span>
          </nav>
          <div className="h-px bg-border" />
          <div className="flex flex-col gap-3 text-sm font-medium leading-none tracking-[-0.35px]">
            <div className="flex min-h-[44px] items-center gap-2 py-3 text-white">
              <span>Discord</span>
              <Image
                alt=""
                width={18}
                height={18}
                src={discordIcon}
              />
              <span className="text-muted">5.1k</span>
            </div>
            <Button
              variant="outline"
              className="h-[44px] w-full px-6 py-[15px] text-sm leading-none tracking-[-0.35px]"
              onClick={onClose}
            >
              Login
            </Button>
            <Button
              className="h-[44px] w-full px-6 py-[15px] text-sm leading-none tracking-[-0.35px]"
              onClick={onClose}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <Section className="relative w-full border-b border-border">
      {/* Full-width hero visual area */}
      <div
        className="relative h-[600px] w-full overflow-hidden md:h-[min(800px,100svh)] xl:h-[min(1136px,100svh)]"
        style={{
          backgroundImage: `url('${heroBackground.src}')`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        {/* Poster image — instant placeholder */}
        <Image
          src={heroPoster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none scale-[1.02] object-cover object-top origin-top"
        />

        {/* Background video — multi-codec; pauses when scrolled out of view */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="pointer-events-none absolute inset-0 hidden h-full w-full scale-[1.02] object-cover object-top origin-top sm:block"
        >
          <source
            src="/hero-av1.mp4"
            type='video/mp4; codecs="av01.0.05M.08"'
          />
          <source src="/hero-h265.mp4" type="video/mp4; codecs=hvc1" />
          <source src="/hero.webm" type="video/webm" />
        </video>

        {/* Bottom gradient for text readability */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[366px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,4,6,0) 19%, rgba(4,4,6,0.17) 45%, rgba(4,4,6,1) 89%)",
          }}
          aria-hidden
        />

        {/* Content overlay: navbar at top, title+CTAs at bottom */}
        <Container className="relative z-10 flex h-full flex-col">
          {/* Navbar */}
          <div className="pt-[9px]">
            {/* Desktop nav (lg+) */}
            <div className="hidden h-[46px] gap-[4px] lg:grid lg:grid-cols-[1fr_auto]">
              <div className="my-[1px] flex h-[44px] items-center justify-between bg-white px-6">
                <UnkeyLogo
                  aria-label="Unkey"
                  role="img"
                  className="h-[28px] w-[78px]"
                />
                <div className="flex items-center gap-10 text-sm font-medium leading-none tracking-[-0.35px] text-black">
                  <div className="flex items-center gap-0.5">
                    <span>Resources</span>
                    <Image
                      alt=""
                      width={14}
                      height={14}
                      src={chevronIcon}
                    />
                  </div>
                  <span>Pricing</span>
                  <span>Docs</span>
                </div>
              </div>
              <div className="my-[1px] flex h-[44px] items-center justify-end gap-8 xl:gap-16">
                <div className="flex items-center gap-1 text-sm font-medium leading-none tracking-[-0.35px] text-black">
                  <div className="flex h-[44px] items-center bg-white px-6 py-[15px]">
                    Discord
                  </div>
                  <div className="flex h-[44px] items-center gap-1 bg-white px-6 py-[13px]">
                    <Image
                      alt=""
                      width={18}
                      height={18}
                      src={discordIcon}
                    />
                    <span>5.1k</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    className="h-[44px] px-6 py-[15px] text-sm leading-none tracking-[-0.35px]"
                  >
                    Login
                  </Button>
                  <Button className="h-[44px] px-6 py-[15px] text-sm leading-none tracking-[-0.35px]">
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile nav (< lg) */}
            <div className="flex h-[46px] items-center gap-[4px] lg:hidden">
              <div className="my-[1px] flex h-[44px] flex-1 items-center bg-white px-4 sm:px-6">
                <UnkeyLogo
                  aria-label="Unkey"
                  role="img"
                  className="h-[28px] w-[78px]"
                />
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="my-[1px] flex h-[44px] w-[44px] shrink-0 items-center justify-center bg-white"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="#040406"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <line x1="3" y1="5" x2="17" y2="5" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="15" x2="17" y2="15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Push title + CTAs to bottom of visual area */}
          <div className="mt-auto pb-8 md:pb-12 xl:pb-[64px]">
            <HeroHeading className="max-w-[704px]">
              {"The Developer Platform\nfor Modern APIs"}
            </HeroHeading>

            <div className="mt-4 flex flex-col gap-5 md:mt-5 md:flex-row md:items-end md:justify-between">
              <HeroDescription className="max-w-[531px]">
                Unkey unifies your infrastructure. Deploy APIs instantly, route
                traffic through global gateways, and understand usage in one
                place.
              </HeroDescription>
              <div className="flex shrink-0 items-center gap-3">
                <Button className="h-[44px] px-5 py-3.5 text-base leading-none tracking-[-0.4px] max-[768px]:text-sm max-[768px]:tracking-[-0.35px]">
                  Start for free
                </Button>
                <Button
                  variant="outline"
                  className="h-[44px] px-5 py-3.5 text-base leading-none tracking-[-0.4px] max-[768px]:text-sm max-[768px]:tracking-[-0.35px]"
                >
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile menu overlay */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Logos */}
      <Container>
        <div className="flex items-center gap-6 overflow-x-auto pt-8 pb-6 lg:pt-[48px] lg:pb-[42px] min-[1025px]:gap-0 min-[1025px]:justify-between min-[1025px]:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative h-[28px] w-[160px] shrink-0 overflow-hidden">
            <div className="absolute left-[1.07%] right-[1.54%] top-[18.92%] bottom-[20.92%]">
              <img
                alt="Fireworks AI logo"
                className="h-full w-full"
                src={fireworksLogo.src}
              />
            </div>
          </div>
          <div className="relative h-[28px] w-[84px] shrink-0 overflow-hidden">
            <div className="absolute left-[0.19%] right-[2.46%] top-[18.44%] bottom-[21.31%]">
              <img
                alt="Cal.com logo"
                className="h-full w-full"
                src={calLogo.src}
              />
            </div>
          </div>
          <div className="relative h-[28px] w-[106px] shrink-0 overflow-hidden">
            <div className="absolute left-[30.86%] right-[-0.12%] top-[14.69%] bottom-[13.59%]">
              <img
                alt="Mintlify logo"
                className="h-full w-full"
                src={mintlifyTextLogo.src}
              />
            </div>
            <div
              className="absolute left-[0.66%] right-[78.72%] top-[4.66%] bottom-[17.28%]"
              style={{
                WebkitMaskImage: `url('${mintlifyMask.src}')`,
                maskImage: `url('${mintlifyMask.src}')`,
                WebkitMaskSize: "21.851px 21.851px",
                maskSize: "21.851px 21.851px",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "0 0",
                maskPosition: "0 0",
              }}
            >
              <img
                alt=""
                className="h-full w-full"
                src={mintlifyIconLogo.src}
              />
            </div>
          </div>
          <div className="relative h-[28px] w-[125px] shrink-0 overflow-hidden">
            <div className="absolute left-0 top-[2px] h-[24px] w-[124.548px]">
              <img
                alt="Symbolica logo"
                className="h-full w-full"
                src={symbolicaLogo.src}
              />
            </div>
          </div>
          <div className="relative h-[28px] w-[105px] shrink-0 overflow-hidden">
            <div className="absolute left-0 top-[4px] h-[20px] w-[104.993px]">
              <img
                alt="BlindPay logo"
                className="h-full w-full"
                src={blindpayLogo.src}
              />
            </div>
          </div>
          <div className="relative h-[24px] w-[159px] shrink-0">
            <img
              alt="Magic Patterns logo"
              className="h-full w-full"
              src={magicPatternsLogo.src}
            />
          </div>
          <a
            className="shrink-0 text-base font-normal leading-[1.375] tracking-[-0.16px] text-muted"
            href="/customers"
          >
            See customer stories
          </a>
        </div>
      </Container>
    </Section>
  );
}
