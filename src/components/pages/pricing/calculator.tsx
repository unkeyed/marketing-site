'use client';

import * as React from 'react';
import { pricingContentData } from '@/constants/pricing';
import { Info } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import PriceNumber from './hero-pricing/price-number';
import { priceNumberFormat } from './utils';

const content = pricingContentData.calculator;

const calculatorFormat = {
  ...priceNumberFormat.options,
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

const RATE_VCPU_PER_SEC = 0.000006944444;
const RATE_GB_PER_SEC = 0.000003472222;
const RATE_EGRESS_PER_GB = 0.05;

const DAYS_IN_MONTH = 30;
const SECONDS_IN_MONTH = DAYS_IN_MONTH * 24 * 60 * 60;

const LIMITS = {
  cpu: { min: 0.25, max: 96, step: 0.25, default: 0.5 },
  instances: { min: 1, max: 999, step: 1, default: 4 },
  egress: { min: 0, max: 100000, step: 1, default: 120 },
} as const;

function useEstimate(state: {
  cpu: string;
  memory: string;
  instances: number;
  egress: number;
  sentinelTier: string;
}) {
  return React.useMemo(() => {
    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
    const cpuCount = clamp(Number(state.cpu) || 0, 0, LIMITS.cpu.max);
    const memoryGb = Number(state.memory) || 0;
    const vmCount = clamp(state.instances || 0, 0, LIMITS.instances.max);
    const egressGb = clamp(state.egress || 0, 0, LIMITS.egress.max);

    const vcpuCost = vmCount * cpuCount * SECONDS_IN_MONTH * RATE_VCPU_PER_SEC;
    const memoryCost = vmCount * memoryGb * SECONDS_IN_MONTH * RATE_GB_PER_SEC;
    const egressCost = egressGb * RATE_EGRESS_PER_GB;
    const usageBased = vcpuCost + memoryCost + egressCost;

    const sentinelOption = content.sentinelTierOptions.find((t) => t.value === state.sentinelTier);
    const sentinels = sentinelOption?.cost ?? 0;

    const total = Math.round((usageBased + sentinels) * 100) / 100;
    const usageRounded = Math.round(usageBased * 100) / 100;
    const round2 = (n: number) => Math.round(n * 100) / 100;

    return {
      usageBased: usageRounded,
      sentinels,
      total,
      breakdown: {
        vcpu: round2(vcpuCost),
        memory: round2(memoryCost),
        egress: round2(egressCost),
      },
    };
  }, [state.cpu, state.memory, state.instances, state.egress, state.sentinelTier]);
}

const INTEGER_INPUT_BLOCKED_KEYS = ['.', ',', 'e', 'E', '-', '+', 'Decimal'];
const DECIMAL_INPUT_BLOCKED_KEYS = ['e', 'E', '-', '+'];

function blockNonIntegerKey(e: React.KeyboardEvent<HTMLInputElement>) {
  if (INTEGER_INPUT_BLOCKED_KEYS.includes(e.key)) e.preventDefault();
}

function blockNonDecimalKey(e: React.KeyboardEvent<HTMLInputElement>) {
  if (DECIMAL_INPUT_BLOCKED_KEYS.includes(e.key)) e.preventDefault();
}

function FieldLabel({
  children,
  className,
  htmlFor,
  tooltip,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor: string;
  tooltip: string;
}) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <label
        htmlFor={htmlFor}
        className="font-sans text-sm font-medium tracking-tight text-muted-foreground"
      >
        {children}
      </label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex shrink-0 rounded-sm">
            <Info className="size-3.5 text-muted-foreground" />
            <span className="sr-only">{tooltip}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-56 bg-foreground text-background">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

const estimateRowFormat = {
  ...calculatorFormat,
  currency: 'USD' as const,
  notation: 'compact' as const,
};

function EstimateRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="shrink-0 font-sans text-[0.9375rem] leading-snug tracking-tight text-gray-80">
        {label}
      </span>
      <PriceNumber
        value={value}
        title={`$${value.toFixed(2)}`}
        className="font-display text-xl leading-snug font-medium tracking-tight"
        format={estimateRowFormat}
      />
    </div>
  );
}

export default function Calculator() {
  const [cpu, setCpu] = React.useState('0.5');
  const [memory, setMemory] = React.useState('4');
  const [instances, setInstances] = React.useState('4');
  const [egress, setEgress] = React.useState('120');
  const [sentinelTier, setSentinelTier] = React.useState('free');

  const estimate = useEstimate({
    cpu,
    memory,
    instances: Number(instances) || 0,
    egress: Number(egress) || 0,
    sentinelTier,
  });

  return (
    <div className="flex w-full flex-col border border-border lg:flex-row" data-slot="calculator">
      <div className="flex min-w-0 flex-1 flex-col gap-6 p-5 md:p-8">
        <div className="flex flex-col gap-2">
          <h3 className="font-sans text-2xl leading-tight font-medium text-foreground">
            {content.title}
          </h3>
          <p className="font-sans text-base leading-snug tracking-tight text-muted-foreground">
            {content.subtitle}
          </p>
        </div>

        <form
          aria-label="Usage cost calculator"
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-6"
        >
          <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="calc-cpu" tooltip={content.fieldTooltips.cpu}>
                {content.fieldLabels.cpu}
              </FieldLabel>
              <Input
                id="calc-cpu"
                type="number"
                min={LIMITS.cpu.min}
                max={LIMITS.cpu.max}
                step={LIMITS.cpu.step}
                value={cpu}
                onKeyDown={blockNonDecimalKey}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    setCpu('');
                    return;
                  }
                  const n = Number(raw);
                  if (!Number.isNaN(n) && n >= 0) {
                    setCpu(n > LIMITS.cpu.max ? String(LIMITS.cpu.max) : raw);
                  }
                }}
                onBlur={(e) => {
                  const raw = e.target.value.trim();
                  if (raw === '') {
                    setCpu(String(LIMITS.cpu.default));
                    return;
                  }
                  const n = Number(raw);
                  if (Number.isNaN(n) || n < LIMITS.cpu.min) {
                    setCpu(String(LIMITS.cpu.min));
                  } else if (n > LIMITS.cpu.max) {
                    setCpu(String(LIMITS.cpu.max));
                  }
                }}
                suffix="vCPU"
                className="h-9"
                placeholder={content.cpuPlaceholder}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="calc-memory" tooltip={content.fieldTooltips.memory}>
                {content.fieldLabels.memory}
              </FieldLabel>
              <Select value={memory} onValueChange={setMemory}>
                <SelectTrigger id="calc-memory" className="h-9 rounded-md">
                  <SelectValue placeholder="4 GB" />
                </SelectTrigger>
                <SelectContent>
                  {content.memoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="calc-instances" tooltip={content.fieldTooltips.instances}>
                {content.fieldLabels.instances}
              </FieldLabel>
              <NumberInput
                id="calc-instances"
                min={LIMITS.instances.min}
                max={LIMITS.instances.max}
                step={LIMITS.instances.step}
                value={instances}
                onKeyDown={blockNonIntegerKey}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    setInstances('');
                    return;
                  }
                  const n = Math.floor(Number(raw));
                  if (!Number.isNaN(n)) {
                    setInstances(
                      String(Math.max(LIMITS.instances.min, Math.min(LIMITS.instances.max, n))),
                    );
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.trim() === '') {
                    setInstances(String(LIMITS.instances.default));
                  }
                }}
                className="h-9"
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="calc-egress" tooltip={content.fieldTooltips.egress}>
                {content.fieldLabels.egress}
              </FieldLabel>
              <Input
                id="calc-egress"
                type="number"
                min={LIMITS.egress.min}
                max={LIMITS.egress.max}
                step={LIMITS.egress.step}
                value={egress}
                onKeyDown={blockNonIntegerKey}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    setEgress('');
                    return;
                  }
                  const n = Math.floor(Number(raw));
                  if (!Number.isNaN(n)) {
                    setEgress(String(Math.max(LIMITS.egress.min, Math.min(LIMITS.egress.max, n))));
                  }
                }}
                onBlur={(e) => {
                  const raw = e.target.value.trim();
                  if (raw === '') {
                    setEgress(String(LIMITS.egress.default));
                    return;
                  }
                  const n = Number(raw);
                  if (Number.isNaN(n) || n < LIMITS.egress.min) {
                    setEgress(String(LIMITS.egress.min));
                  }
                }}
                suffix="GB"
                className="h-9"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="sentinel-tier"
              className="font-sans text-sm font-medium tracking-tight text-muted-foreground"
            >
              {content.sentinelTier.label}
            </label>
            <Select value={sentinelTier} onValueChange={setSentinelTier}>
              <SelectTrigger id="sentinel-tier" className="h-9 rounded-md">
                <SelectValue placeholder={content.sentinelTier.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {content.sentinelTierOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="font-sans text-2xs leading-snug tracking-tight text-muted-foreground">
              {content.sentinelTier.helperText}
            </p>
          </div>
        </form>
      </div>

      <section
        aria-labelledby="estimate-heading"
        aria-live="polite"
        aria-atomic="true"
        className="flex flex-1 flex-col gap-6 border-t border-border bg-gray-5 p-5 md:p-8 lg:max-w-72 lg:border-t-0 lg:border-l"
      >
        <h3
          id="estimate-heading"
          className="font-sans text-xl leading-snug font-medium tracking-tight text-foreground"
        >
          {content.estimate.heading}
        </h3>

        <div className="flex flex-col gap-2">
          <EstimateRow label={content.estimate.usageBased} value={estimate.usageBased} />
          <EstimateRow label={content.estimate.sentinels} value={estimate.sentinels} />

          <div className="mt-2 h-px w-full bg-border" role="separator" />

          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="shrink-0 font-sans text-base leading-snug tracking-tight text-gray-80">
              {content.estimate.total}
            </span>
            <div className="flex min-w-0 items-baseline gap-1.5">
              <PriceNumber
                value={estimate.total}
                title={`$${estimate.total.toFixed(2)}`}
                className="font-display text-3xl leading-snug font-medium tracking-tight"
                format={estimateRowFormat}
              />
              <span className="shrink-0 font-sans text-base leading-snug tracking-tight text-muted-foreground">
                {content.estimate.perMonth}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 font-sans text-2xs leading-snug tracking-tight text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{content.rateLabels.vcpu}</span>
            <span className="text-right">
              ${RATE_VCPU_PER_SEC.toFixed(9).replace(/0+$/, '').replace(/\.$/, '')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>{content.rateLabels.memory}</span>
            <span className="text-right">
              ${RATE_GB_PER_SEC.toFixed(9).replace(/0+$/, '').replace(/\.$/, '')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>{content.rateLabels.egress}</span>
            <span className="text-right">${RATE_EGRESS_PER_GB.toFixed(2)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
