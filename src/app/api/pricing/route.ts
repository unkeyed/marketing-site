import {
  apiManagementPricingPlans,
  deployPricingPlans,
  enterpriseData,
  tableFeatures,
} from '@/constants/pricing';

import type { IPricingPlan, PricingMatrixValue } from '@/types/pricing';
import { toAbsoluteSiteUrl } from '@/lib/site-url';

const RATE_VCPU_PER_SEC = 0.000006944444;
const RATE_GB_PER_SEC = 0.000003472222;
const RATE_EGRESS_PER_GB = 0.05;

function formatUsd(value: number): string {
  return `$${value.toLocaleString('en-US')}`;
}

function formatPrice(plan: IPricingPlan): string {
  if (plan.priceType === 'string') return plan.monthlyPriceDisplay;
  return `${formatUsd(plan.monthlyPrice)}/mo`;
}

function formatCell(value: PricingMatrixValue): string {
  if (value === false) return '—';
  if (value === true) return 'Yes';
  if (typeof value === 'string') return value;
  return value.title;
}

function findPlanValue(featureName: string, planId: string): string {
  for (const group of tableFeatures) {
    const row = group.features.find((f) => f.name === featureName);
    if (!row) continue;
    const cell = row.plans.find((p) => p.planId === planId);
    if (cell) return formatCell(cell.value);
  }
  return '—';
}

function buildDeployPlansTable(): string {
  const headers = [
    'Plan',
    'Price',
    'Included Usage',
    'Max vCPU / Instance',
    'Max RAM / Instance',
    'Custom Domains',
    'Regions',
  ];
  const rows = deployPricingPlans.map((plan) => [
    plan.name,
    formatPrice(plan),
    findPlanValue('Included usage', plan.id),
    findPlanValue('Max vCPU per Instance', plan.id),
    `${findPlanValue('Max RAM (GB) per Instance', plan.id)} GB`,
    findPlanValue('Custom domains', plan.id),
    findPlanValue('Regions', plan.id),
  ]);
  rows.push(['Enterprise', 'Custom', 'Custom', 'Custom', 'Custom', 'Custom', 'All']);
  return renderTable(headers, rows);
}

function buildDeployLimitsTable(): string {
  const limitRows = [
    'Projects',
    'Concurrent Builds',
    'Team members',
    'Log retention',
    'Audit log retention',
    'Support',
  ];
  const headers = ['Limit', ...deployPricingPlans.map((p) => p.name)];
  const rows = limitRows.map((name) => [
    name,
    ...deployPricingPlans.map((p) => findPlanValue(name, p.id)),
  ]);
  return renderTable(headers, rows);
}

function buildApiManagementTable(): string {
  const headers = ['Plan', 'Price', 'Valid Requests / mo', 'API Keys', 'Log Retention', 'Audit Log'];
  const rows: string[][] = [];

  const free = apiManagementPricingPlans.find((p) => p.id === 'free');
  if (free) {
    rows.push([free.name, formatPrice(free), '150K', '1k', '1 day', '3 days']);
  }

  const pro = apiManagementPricingPlans.find((p) => p.id === 'pro');
  if (pro?.priceTiers) {
    for (const tier of pro.priceTiers) {
      const requests = tier.featureOverrides?.['valid-requests']?.replace(' valid requests / mo', '') ?? tier.label;
      rows.push([pro.name, `${formatUsd(tier.monthlyPrice)}/mo`, requests, '1M', '7 days', '14 days']);
    }
  }

  const ent = apiManagementPricingPlans.find((p) => p.id === 'enterprise');
  if (ent) {
    rows.push([ent.name, formatPrice(ent), 'Custom', 'Custom', 'Custom', 'Custom']);
  }

  return renderTable(headers, rows);
}

function renderTable(headers: string[], rows: string[][]): string {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] ?? '').length)),
  );
  const pad = (cells: string[]) =>
    `| ${cells.map((c, i) => c.padEnd(widths[i])).join(' | ')} |`;
  const sep = `| ${widths.map((w) => '-'.repeat(w)).join(' | ')} |`;
  return [pad(headers), sep, ...rows.map(pad)].join('\n');
}

function buildPlanFeatureSections(plans: IPricingPlan[]): string {
  const lines: string[] = [];
  for (const plan of plans) {
    lines.push(`**${plan.name}** — ${plan.description}`, '');
    for (const item of plan.features.items) {
      lines.push(`- ${item.label}`);
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}

function buildBody(): string {
  const sourceUrl = toAbsoluteSiteUrl('/pricing');
  const ratesTable = renderTable(
    ['Resource', 'Rate'],
    [
      ['vCPU / second', `$${RATE_VCPU_PER_SEC.toFixed(9).replace(/0+$/, '').replace(/\.$/, '')}`],
      ['Memory / GB / second', `$${RATE_GB_PER_SEC.toFixed(9).replace(/0+$/, '').replace(/\.$/, '')}`],
      ['Egress / GB', `$${RATE_EGRESS_PER_GB.toFixed(2)}`],
    ],
  );

  return [
    '# Unkey Pricing',
    '',
    'Start for free and scale on demand with predictable usage-based pricing.',
    '',
    'Unkey has two products with independent pricing:',
    '',
    '- **Unkey Deploy** — Run APIs as containers. Pay for the CPU, memory, and egress you actually use.',
    '- **API Management** — Issue, verify, and manage API keys with tiered request volume plans.',
    '',
    `Source: ${sourceUrl}`,
    '',
    '---',
    '',
    '## Unkey Deploy',
    '',
    'Deploy your code as containers across AWS regions. Deploy is a paid product — start on Starter at $5/mo. All plans include monthly usage credits that offset usage-based charges; beyond the included credits, you pay for average actual vCPU seconds and memory GB-seconds (not the ceilings you configured) plus egress GB. Unused credits do not roll over.',
    '',
    '### Plans',
    '',
    buildDeployPlansTable(),
    '',
    '### Usage Rates (Pay-as-you-go)',
    '',
    'Included credits offset usage each month. Beyond credits, additional usage is billed at:',
    '',
    ratesTable,
    '',
    'Both vCPU and memory are billed on average actual usage, not the ceilings you configured. You only pay for CPU time when your code is actually executing, not while idle waiting on I/O. Memory is billed on average GB-seconds actually used by your instance. Egress is billed by the gigabyte. Preview deployments are billed at the same rates as production.',
    '',
    '### Deploy Plan Limits',
    '',
    buildDeployLimitsTable(),
    '',
    '### Deploy Plan Highlights',
    '',
    buildPlanFeatureSections(deployPricingPlans),
    '',
    '---',
    '',
    '## API Management',
    '',
    'Issue and verify API keys for your services. The Pro plan is sold in fixed monthly tiers based on included valid requests per month. Invalid requests (rate-limited, bad keys, etc.) are not counted toward your quota.',
    '',
    '### Plans',
    '',
    buildApiManagementTable(),
    '',
    '### API Management Plan Highlights',
    '',
    buildPlanFeatureSections(apiManagementPricingPlans),
    '',
    '---',
    '',
    '## Enterprise',
    '',
    `${enterpriseData.description}`,
    '',
    'Enterprise includes:',
    '',
    ...enterpriseData.features.map((f) => `- ${f}`),
    '- IP whitelisting',
    '- Annual contracts and SLAs',
    '- SSO, SAML, and audit log exports on request',
    '',
    `Contact sales: ${enterpriseData.buttonUrl}`,
    '',
    '---',
    '',
    '## FAQ',
    '',
    '**How does usage-based billing work with included credits?**',
    '',
    'Each paid plan includes a monthly credit allowance (e.g. $25/mo on Pro) that offsets your usage-based charges for compute and egress. Credits reset at the start of each billing cycle and do not roll over. Once credits are used up, additional usage is billed at the standard per-unit rates.',
    '',
    '**How do I avoid runaway costs?**',
    '',
    'Unlike serverless platforms that autoscale without bounds, Unkey Deploy runs containers with a max replica count you set per region, giving you a predictable compute ceiling. We bill for actual vCPU, memory, and egress, not per request.',
    '',
    '**Can I try a paid plan, and can I downgrade later?**',
    '',
    "There's no trial, but Starter is $5/mo and includes $5 in usage credits — enough to build and test Unkey Deploy end-to-end. You can upgrade anytime, and downgrades take effect at the end of your current billing cycle.",
    '',
    '**How is compute metered?**',
    '',
    "Both vCPU and memory are billed on average actual usage, not the ceilings you configured. You only pay for CPU time when your code is actually executing, not while it's idle waiting on I/O or network calls. Memory is billed by average GB-seconds actually used by your instance, so right-sizing for headroom doesn't penalize you. Egress is billed by the gigabyte. Unkey automatically scales your workload during low activity periods to optimize cost, without introducing cold starts.",
    '',
    "**What happens when I hit my plan's limits?**",
    '',
    'Each plan caps the max size of an Instance, the number of Instances, and total CPU and memory allocated across your workspace. If a new deployment would exceed any of these, it fails with a clear error. Running applications keep serving traffic without interruption, so you can upgrade or free up capacity before redeploying.',
    '',
    '**Do preview deployments count against my usage?**',
    '',
    'Yes, preview deployments are billed the same as production. Their vCPU, memory, and egress count against your included credits and then your usage-based rate. Preview environments do get a smaller Sentinel (1 replica instead of 3) to keep the overhead low.',
    '',
    '**Can I migrate existing API keys from another provider?**',
    '',
    'Yes. You can import pre-hashed keys from your current system into Unkey without requiring your users to generate new ones. Existing keys keep working, and Unkey never sees the plaintext. See https://unkey.com/docs/platform/apis/migrations/introduction for the full flow.',
    '',
    '**Where are my workloads hosted, and can I pick regions?**',
    '',
    'Unkey deploys on AWS across multiple regions. You pick which regions to deploy to and traffic routes to the nearest healthy region automatically. See https://unkey.com/docs/build-and-deploy/regions for the current list.',
    '',
    '**Do you offer SOC 2 compliance?**',
    '',
    'Yes, Unkey is SOC 2 compliant. Contact support@unkey.com if you need a copy of our report or have specific compliance requirements for your Enterprise deployment.',
    '',
    '**How do I get SSO, SAML, or audit log exports?**',
    '',
    "These are available on request. Reach out to support@unkey.com and we'll work with you to get them set up.",
    '',
  ].join('\n');
}

export async function GET() {
  return new Response(buildBody(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
