import type { IAgentsHero } from '@/types/agents';
import { isExternalLink } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';
import CodeSnippet from '@/components/pages/agents/code-snippet';

export default function Hero({
  label,
  title,
  description,
  install,
  primaryCta,
  secondaryCta,
}: IAgentsHero) {
  const secondaryIsExternal = isExternalLink(secondaryCta.href);

  return (
    <section className="border-b border-gray-20">
      <div className="section-container py-12 md:pt-[5.75rem] md:pb-[5.5rem] lg:pb-24 xl:pt-29 xl:pb-32">
        <div className="grid gap-10 md:gap-12 xl:grid-cols-[1fr_1fr] xl:items-end 2xl:gap-24">
          <div className="flex min-w-0 flex-col">
            <Label>{label}</Label>
            <h1 className="mt-6 font-display text-4xl leading-[1.125] font-normal text-foreground md:mt-7 md:text-5xl lg:text-[3.25rem] xl:text-[4rem] [&_mark]:relative [&_mark]:-left-[0.15em] [&_mark]:-mr-[0.15em] [&_mark]:bg-transparent [&_mark]:bg-[linear-gradient(var(--color-yellow),var(--color-yellow))] [&_mark]:box-decoration-clone [&_mark]:[background-size:100%_1.02em] [&_mark]:[background-position:center_calc(50%_+_0.17em)] [&_mark]:bg-no-repeat [&_mark]:px-[0.1em] [&_mark]:text-black">
              {title}
            </h1>
            <p className="mt-6 font-sans text-[1.125rem] leading-[1.375] font-normal tracking-[-0.015em] text-muted-foreground md:mt-7 md:max-w-xl lg:mt-8 xl:max-w-128">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-10">
              <Link href={primaryCta.href} variant="primary" className="max-[360px]:px-3.5">
                {primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.href}
                variant="secondary"
                className="max-[360px]:px-3.5"
                target={secondaryIsExternal ? '_blank' : undefined}
                rel={secondaryIsExternal ? 'noopener noreferrer' : undefined}
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6 border border-gray-20 bg-panel p-5 sm:p-6 xl:p-8">
            {install.map((step) => (
              <div key={step.code} className="flex flex-col gap-3">
                <p className="text-[0.9375rem] leading-snug text-gray-70">{step.caption}</p>
                <CodeSnippet code={step.code} wrap />
                {step.note ? (
                  <p className="text-[0.9375rem] leading-snug text-gray-60">{step.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
