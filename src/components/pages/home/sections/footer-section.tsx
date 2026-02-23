import { Container } from "@/components/ui";
import UnkeyLogoWhite from "@/images/pages/home/shared/unkey-logo-white.inline.svg";
import Section from "./section";

type FooterColumn = {
  title: string;
  items: string[];
};

const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    items: ["About", "Roadmap", "Careers", "Source Code", "Status Page"],
  },
  {
    title: "Resources",
    items: ["Blog", "Changelog", "Templates", "Docs", "Glossary"],
  },
  {
    title: "Connect",
    items: ["X (Twitter)", "Discord", "OSS Friends", "Book a Call"],
  },
  {
    title: "Legal",
    items: ["Terms of Service", "Privacy Policy"],
  },
];

export default function FooterSection() {
  return (
    <Section className="border-t border-border">
      <Container className="grid gap-10 py-10 md:py-[47px] lg:grid-cols-[52fr_48fr] lg:gap-0">
        <div className="flex flex-col gap-5 pt-[21px] lg:pt-0">
          <UnkeyLogoWhite
            aria-label="Unkey"
            role="img"
            className="h-[28px] w-[78px]"
          />
          <div className="text-sm leading-none tracking-[-0.35px] text-muted-3">
            Build better APIs faster
          </div>
          <div className="text-sm font-medium leading-none tracking-[-0.35px] text-muted-5">
            (c) 2026 Unkey Inc. All rights reserved.
          </div>
        </div>
        <div className="text-[15px] leading-snug tracking-[-0.375px]">
          <div className="grid max-w-[832px] grid-cols-2 gap-8 sm:grid-cols-3 lg:flex lg:justify-between">
            {footerColumns.map((column) => (
              <div className="flex flex-col gap-3" key={column.title}>
                <span className="mb-2 font-medium text-white">
                  {column.title}
                </span>
                {column.items.map((item) => (
                  <span key={item} className="font-medium text-muted">
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
