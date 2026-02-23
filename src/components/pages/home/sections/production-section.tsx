import { Container } from "@/components/ui";
import Section from "./section";

const items = [
  {
    title: "High availability",
    text: "Unkey deploys multiple replicas in different availability zones so your app survives during outages.",
  },
  {
    title: "Proactive protection",
    text: "Take immediate control over your system's security with the ability to instantly revoke access, providing swift response to potential threats.",
  },
];

export default function ProductionSection() {
  return (
    <Section className="pt-12 md:pt-[80px]">
      <Container className="grid gap-8 lg:grid-cols-[1fr_3fr] lg:gap-0">
        <div className="flex items-start pt-[7px]">
          <div className="flex items-center gap-2.5">
            <div className="relative h-[10px] w-[10px]">
              <span className="absolute inset-0 rounded-[2px] bg-blue-glow blur-[5px]" />
              <span className="absolute inset-0 rounded-[2px] bg-cyan blur-[2px]" />
              <span className="absolute inset-0 rounded-[2px] bg-cyan" />
            </div>
            <span className="font-mono text-sm uppercase tracking-[0.42px] text-white">
              Built for production
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-8 md:gap-12 lg:flex-row lg:gap-24">
          {items.map((item) => (
            <div className="flex flex-1 gap-5" key={item.title}>
              <div className="flex w-px flex-col self-stretch">
                <div className="h-[30px] w-px shrink-0 bg-white" />
                <div className="w-px flex-1 bg-border" />
              </div>
              <div className="flex flex-col gap-2 text-lg md:text-xl">
                <p className="font-medium leading-normal text-white">
                  {item.title}
                </p>
                <p className="leading-snug text-muted-2">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
