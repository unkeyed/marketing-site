import Link from 'next/link';
import { APP_URL, ENTERPRISE_CONTACT_URL } from '@/configs/website-config';

import type { IPricingPlan, IPricingTableFeatures } from '@/types/pricing';

export const pricingContentData = {
  title: (
    <>
      <mark>Start for free, scale&nbsp;</mark>
      <mark>as you go</mark>
      {' with'}
      {'\n'}
      predictable usage-based pricing.
    </>
  ),
  tabs: [
    {
      value: 'deploy',
      label: 'unkey deploy',
    },
    {
      value: 'api-management',
      label: 'Api management',
    },
  ],
  faq: {
    mainTitle: 'FAQ',
    title: 'Have questions?',
    description: 'We’ve got answers.',
  },
  usageCalculator: {
    title: (
      <>
        Pay for usage.
        {'\n'}
        Scale <mark>on demand.</mark>
      </>
    ),
    subtitle: `Your spend follows real usage, not plan
    jumps. Pay only for the CPU, memory, and egress
    you actually use. Available on every plan.`,
    actionText: 'Read the docs',
    actionHref: 'https://unkey.com/docs/platform/workspaces/billing',
  },
  calculator: {
    title: 'Calculator',
    subtitle: 'Estimate monthly costs based on your infrastructure needs.',
    fieldLabels: {
      cpu: 'Active CPU / instance',
      memory: 'Memory / instance',
      instances: 'Number of instances',
      egress: 'Egress / month',
    },
    fieldTooltips: {
      cpu: 'Number of active virtual CPU cores per running instance',
      memory: 'Amount of RAM allocated per running instance',
      instances: 'Total number of instances running simultaneously',
      egress: 'Total outbound network data transfer per month',
    },
    memoryOptions: [
      { value: '0.25', label: '1/4 GB' },
      { value: '0.5', label: '1/2 GB' },
      { value: '1', label: '1 GB' },
      { value: '2', label: '2 GB' },
      { value: '4', label: '4 GB' },
      { value: '8', label: '8 GB' },
      { value: '16', label: '16 GB' },
    ],
    cpuPlaceholder: '0.5',
    estimate: {
      heading: 'Estimate',
      usageBased: 'Usage-based',
      total: 'Total',
      perMonth: '/ mo',
    },
    rateLabels: {
      vcpu: 'vCPU/sec',
      memory: 'Memory/GB/sec',
      egress: 'Egress/GB',
    },
  },
};

export const deployPricingPlans: IPricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    // lucideIcon: "gem",
    description: 'Deploy your first API fast. Great for quick prototypes.',
    currency: 'USD',
    monthlyPrice: 0,
    annualPrice: 0,
    priceMonthlyLabel: ' / mo',
    priceAnnualLabel: ' / mo',
    priceType: 'number',
    features: {
      title: 'What’s included',
      items: [
        {
          label: 'Up to 0.25 vCPU / 0.25 GB per Instance',
          lucideIcon: 'check',
        },
        {
          label: '1 concurrent build',
          lucideIcon: 'check',
        },
        {
          label: 'No custom domains',
          lucideIcon: 'check',
        },
        {
          label: 'Community support',
          lucideIcon: 'check',
        },
      ],
    },
    link: {
      label: 'Start for free',
      href: APP_URL,
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    // lucideIcon: "gem",
    description: 'Ship small production workloads with simple usage-based billing.',
    monthlyPrice: 5,
    annualPrice: 5,
    currency: 'USD',
    priceMonthlyLabel: ' / mo',
    priceAnnualLabel: ' / mo',
    priceType: 'number',
    features: {
      title: 'What’s included',
      items: [
        {
          label: 'Up to 2 vCPU / 2 GB per Instance',
          lucideIcon: 'check',
        },
        {
          label: '1 concurrent build',
          lucideIcon: 'check',
        },
        {
          label: 'Custom domains',
          lucideIcon: 'check',
        },
        {
          label: 'Includes $5/mo usage credits',
          lucideIcon: 'check',
        },
        {
          label: 'Email support',
          lucideIcon: 'check',
        },
      ],
    },
    link: {
      label: 'Get started',
      href: APP_URL,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    // lucideIcon: "gem",
    description: 'Run production APIs with more compute and headroom.',
    monthlyPrice: 25,
    annualPrice: 25,
    currency: 'USD',
    priceMonthlyLabel: ' / mo',
    priceAnnualLabel: ' / mo',
    priceType: 'number',
    isMostPopular: true,
    features: {
      title: 'What’s included',
      items: [
        {
          label: 'Up to 8 vCPU / 8 GB per Instance',
          lucideIcon: 'check',
        },
        {
          label: '1 concurrent build',
          lucideIcon: 'check',
        },
        {
          label: 'Custom domains',
          lucideIcon: 'check',
        },
        {
          label: 'Includes $25/mo usage credits',
          lucideIcon: 'check',
        },
        {
          label: 'Email support',
          lucideIcon: 'check',
        },
      ],
    },
    link: {
      label: 'Get started',
      href: APP_URL,
    },
  },
  {
    id: 'business',
    name: 'Business',
    // lucideIcon: "gem",
    description: 'For higher workloads and growing teams at global scale.',
    currency: 'USD',
    // labelBeforePrice: "For pricing",
    monthlyPrice: 50,
    annualPrice: 50,
    priceMonthlyLabel: ' / mo',
    priceAnnualLabel: ' / mo',
    priceType: 'number',
    features: {
      title: 'What’s included',
      items: [
        {
          label: 'Up to 16 vCPU / 32 GB per Instance',
          lucideIcon: 'check',
        },
        {
          label: '1 concurrent build',
          lucideIcon: 'check',
        },
        {
          label: 'Custom domains',
          lucideIcon: 'check',
        },

        {
          label: 'Includes $50/mo usage credits',
          lucideIcon: 'check',
        },
        {
          label: 'Email support',
          lucideIcon: 'check',
        },
      ],
    },
    link: {
      label: 'Get started',
      href: APP_URL,
    },
  },
];

export const apiManagementPricingPlans: IPricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    // lucideIcon: "gem",
    description:
      'Everything you need to start fast, with the core tools to protect and manage your API.',
    currency: 'USD',
    monthlyPrice: 0,
    annualPrice: 0,
    priceMonthlyLabel: ' / mo',
    priceAnnualLabel: ' / mo',
    priceType: 'number',
    features: {
      title: 'What’s included',
      items: [
        {
          label: '1k API keys',
          lucideIcon: 'check',
        },
        {
          label: '150K valid requests / mo',
          lucideIcon: 'check',
        },
        {
          label: '1-day logs retention',
          lucideIcon: 'check',
        },
        {
          label: '3-day audit log retention',
          lucideIcon: 'check',
        },
        {
          label: 'Unlimited APIs',
          lucideIcon: 'check',
        },
      ],
    },
    link: {
      label: 'Start for free',
      href: APP_URL,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    // lucideIcon: "gem",
    description:
      'Predictable pricing without surprises, built for scaling APIs with clear usage-based billing.',
    monthlyPrice: 25,
    annualPrice: 25,
    currency: 'USD',
    priceMonthlyLabel: ' / mo',
    priceAnnualLabel: ' / mo',
    priceType: 'number',
    priceTiers: [
      {
        value: '250k',
        label: '250K Requests',
        monthlyPrice: 25,
        annualPrice: 25,
        featureOverrides: { 'valid-requests': '250K valid requests / mo' },
      },
      {
        value: '500k',
        label: '500K Requests',
        monthlyPrice: 50,
        annualPrice: 50,
        featureOverrides: { 'valid-requests': '500K valid requests / mo' },
      },
      {
        value: '1m',
        label: '1M Requests',
        monthlyPrice: 75,
        annualPrice: 75,
        featureOverrides: { 'valid-requests': '1M valid requests / mo' },
      },
      {
        value: '2m',
        label: '2M Requests',
        monthlyPrice: 100,
        annualPrice: 100,
        featureOverrides: { 'valid-requests': '2M valid requests / mo' },
      },
      {
        value: '10m',
        label: '10M Requests',
        monthlyPrice: 250,
        annualPrice: 250,
        featureOverrides: { 'valid-requests': '10M valid requests / mo' },
      },
      {
        value: '50m',
        label: '50M Requests',
        monthlyPrice: 500,
        annualPrice: 500,
        featureOverrides: { 'valid-requests': '50M valid requests / mo' },
      },
      {
        value: '100m',
        label: '100M Requests',
        monthlyPrice: 1000,
        annualPrice: 1000,
        featureOverrides: { 'valid-requests': '100M valid requests / mo' },
      },
    ],
    features: {
      title: 'What’s included',
      items: [
        {
          label: '1M API keys',
          lucideIcon: 'check',
        },
        {
          id: 'valid-requests',
          label: '250K valid requests / mo',
          lucideIcon: 'check',
        },
        {
          label: '7-day logs retention',
          lucideIcon: 'check',
        },
        {
          label: '14-day audit log retention',
          lucideIcon: 'check',
        },
        {
          label: 'Unlimited APIs',
          lucideIcon: 'check',
        },
        {
          label: 'Workspaces with team members',
          lucideIcon: 'check',
        },
      ],
    },
    link: {
      label: 'Get started',
      href: APP_URL,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    // lucideIcon: "gem",
    description:
      'Need more support, or pricing doesn’t fit? Built for teams running mission-critical APIs at global scale.',
    monthlyPriceDisplay: 'Custom',
    annualPriceDisplay: 'Custom',
    currency: 'USD',
    priceType: 'string',
    features: {
      title: 'What’s included',
      items: [
        {
          label: 'Custom quotas',
          lucideIcon: 'check',
        },
        {
          label: 'IP Whitelisting',
          lucideIcon: 'check',
        },
        {
          label: 'Dedicated Slack channel',
          lucideIcon: 'check',
        },
      ],
    },
    link: {
      label: 'Contact us',
      href: ENTERPRISE_CONTACT_URL,
    },
  },
];

export const tableFeatures: IPricingTableFeatures[] = [
  {
    features: [
      {
        name: 'Projects',
        plans: [
          { planId: 'free', value: '1' },
          { planId: 'starter', value: 'Unlimited' },
          { planId: 'pro', value: 'Unlimited' },
          { planId: 'business', value: 'Unlimited' },
        ],
      },
      {
        name: 'Concurrent Builds',
        plans: [
          { planId: 'free', value: '1' },
          { planId: 'starter', value: '1' },
          { planId: 'pro', value: '1' },
          { planId: 'business', value: '1' },
        ],
      },
      {
        name: 'Max vCPU per Instance',
        plans: [
          { planId: 'free', value: '0.25' },
          { planId: 'starter', value: '2' },
          { planId: 'pro', value: '8' },
          { planId: 'business', value: '32' },
        ],
      },
      {
        name: 'Max RAM (GB) per Instance',
        plans: [
          { planId: 'free', value: '0.25' },
          { planId: 'starter', value: '2' },
          { planId: 'pro', value: '8' },
          { planId: 'business', value: '32' },
        ],
      },
      {
        name: 'Custom domains',
        plans: [
          { planId: 'free', value: false },
          { planId: 'starter', value: '1' },
          { planId: 'pro', value: '10' },
          { planId: 'business', value: '100' },
        ],
      },
      {
        name: 'Included usage',
        plans: [
          { planId: 'free', value: false },
          { planId: 'starter', value: '$5' },
          { planId: 'pro', value: '$25' },
          { planId: 'business', value: '$50' },
        ],
      },
      {
        name: 'Regions',
        plans: [
          { planId: 'free', value: '1' },
          { planId: 'starter', value: '3' },
          { planId: 'pro', value: 'All' },
          { planId: 'business', value: 'All' },
        ],
      },
      {
        name: 'Team members',
        plans: [
          { planId: 'free', value: '1' },
          { planId: 'starter', value: '1' },
          { planId: 'pro', value: 'Unlimited' },
          { planId: 'business', value: 'Unlimited' },
        ],
      },
      {
        name: 'Log retention',
        plans: [
          { planId: 'free', value: '1 day' },
          { planId: 'starter', value: '3 days' },
          { planId: 'pro', value: '7 days' },
          { planId: 'business', value: '14 days' },
        ],
      },
      {
        name: 'Audit log retention',
        plans: [
          { planId: 'free', value: '3 days' },
          { planId: 'starter', value: '7 days' },
          { planId: 'pro', value: '14 days' },
          { planId: 'business', value: '30 days' },
        ],
      },
      {
        name: 'Support',
        plans: [
          { planId: 'free', value: 'Community' },
          { planId: 'starter', value: 'Email' },
          { planId: 'pro', value: 'Email' },
          { planId: 'business', value: 'Email' },
        ],
      },
    ],
  },
];

export const faqItems = [
  {
    question: 'How does usage-based billing work with included credits?',
    answer: `Each paid plan includes a monthly credit allowance (e.g. $25/mo on Pro) that offsets your usage-based charges for compute and egress. Credits reset at the start of each billing cycle and do not roll over. Once credits are used up, additional usage is billed at the standard per-unit rates shown in the calculator.`,
  },
  {
    question: 'How do I avoid runaway costs?',
    answer: `Unlike serverless platforms that autoscale without bounds, Unkey Deploy runs containers with a max replica count you set per region, giving you a predictable compute ceiling. We bill for actual vCPU, memory, and egress, not per request.`,
  },
  {
    question: 'Can I try a paid plan, and can I downgrade later?',
    answer: `There's no trial, but the Free tier lets you build and test Unkey without a credit card. You can upgrade anytime, and downgrades take effect at the end of your current billing cycle.`,
  },
  {
    question: 'How is compute metered?',
    answer: `You only pay for CPU time when your code is actually executing, not while it's idle waiting on I/O or network calls. An API that spends most of its time waiting on a database or upstream service is billed only for the milliseconds your code was on-CPU. Memory is billed for the time an instance is running, and egress by the gigabyte. Unkey automatically scales your workload during low activity periods to optimize cost, without introducing cold starts.`,
  },
  {
    question: "What happens when I hit my plan's limits?",
    answer: `Each plan caps the max size of an Instance, the number of Instances, and total CPU and memory allocated across your workspace. If a new deployment would exceed any of these, it fails with a clear error. Running applications keep serving traffic without interruption, so you can upgrade or free up capacity before redeploying.`,
  },
  {
    question: 'Do preview deployments count against my usage?',
    answer: `Yes, preview deployments are billed the same as production. Their vCPU, memory, and egress count against your included credits and then your usage-based rate. Preview environments do get a smaller Sentinel (1 replica instead of 3) to keep the overhead low.`,
  },
  {
    question: 'How long are logs retained?',
    answer: `Request logs are retained for 1 day on Free and 7 days on Pro. Audit logs are retained for 3 days on Free and 14 days on Pro. Enterprise plans offer custom retention. Export is not yet available, but it's on the roadmap.`,
  },
  {
    question: 'Can I migrate existing API keys from another provider?',
    answer: (
      <p>
        Yes. You can import pre-hashed keys from your current system into Unkey without requiring
        your users to generate new ones. Existing keys keep working, and Unkey never sees the
        plaintext. See the{' '}
        <Link
          href="https://unkey.com/docs/platform/apis/migrations/introduction"
          className="underline"
        >
          migration docs
        </Link>{' '}
        for the full flow.
      </p>
    ),
  },
  {
    question: 'Where are my workloads hosted, and can I pick regions?',
    answer: (
      <p>
        We deploy on AWS across multiple regions. You pick which regions to deploy to and traffic
        routes to the nearest healthy region automatically. See the{' '}
        <Link href="https://unkey.com/docs/build-and-deploy/regions" className="underline">
          regions docs
        </Link>{' '}
        for the current list.
      </p>
    ),
  },
  {
    question: 'Do you offer SOC 2 compliance?',
    answer: `Yes, Unkey is SOC 2 compliant. Contact us if you need a copy of our report or have specific compliance requirements for your Enterprise deployment.`,
  },
  {
    question: 'How do I get SSO, SAML, or audit log exports?',
    answer: (
      <p>
        These are available on request. Reach out to{' '}
        <Link href="mailto:support@unkey.com" className="underline">
          support@unkey.com
        </Link>{' '}
        and we&apos;ll work with you to get them set up.
      </p>
    ),
  },
];

export const enterpriseData = {
  title: 'Enterprise',
  description:
    'Connect with our team for higher resource limits, dedicated requirements, annual contracts, and more.',
  features: ['Custom limits', 'Dedicated infrastructure', 'Dedicated Slack channel'],
  buttonText: 'Contact sales',
  buttonUrl: ENTERPRISE_CONTACT_URL,
};
