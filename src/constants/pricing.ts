import { createElement, Fragment } from 'react';

import { IPricingPlan, IPricingTableFeatures } from '@/types/pricing';
import { APP_URL, DOCS_URL, ENTERPRISE_CONTACT_URL } from '@/configs/website-config';

export const pricingContentData = {
  title: createElement(
    Fragment,
    null,
    createElement('mark', null, 'Start for free, scale\u00a0'),
    createElement('mark', null, 'as you go'),
    ' with',
    '\n',
    'predictable usage-based pricing.',
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
    title: createElement(
      Fragment,
      null,
      'Pay for usage.',
      '\n',
      'Scale ',
      createElement('mark', null, 'on demand.'),
    ),
    subtitle: `Your spend follows real usage, not plan
    jumps. Scale gateway capacity when latency
    spikes. Available on every plan.`,
    actionText: 'Read the docs',
    actionHref: DOCS_URL,
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
      cpu: 'Number of virtual CPU cores allocated per running instance',
      memory: 'Amount of RAM allocated per running instance',
      instances: 'Total number of VM instances running simultaneously',
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
      { value: '32', label: '32 GB' },
      { value: '64', label: '64 GB' },
      { value: '128', label: '128 GB' },
    ],
    sentinelTier: {
      label: 'Sentinel tier',
      placeholder: 'Select tier',
      helperText: '3 Sentinels for production, 1 for preview included by default.',
    },
    sentinelTierOptions: [
      { value: 'free', label: '1/4 vCPU, 1/2 GB – Free (Included)', cost: 0 },
      { value: '0.5-1', label: '1/2 vCPU, 1 GB – $20/mo', cost: 20 },
      { value: '0.5-2', label: '1/2 vCPU, 2 GB – $30/mo', cost: 30 },
      { value: '4-8', label: '4 vCPU, 8 GB – $150/mo', cost: 150 },
      { value: '8-16', label: '8 vCPU, 16 GB – $300/mo', cost: 300 },
    ],
    cpuPlaceholder: '0.5',
    estimate: {
      heading: 'Estimate',
      usageBased: 'Usage-based',
      sentinels: 'Sentinels',
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
          label: 'Up to 0.25 vCPU / 0.25 GB per VM',
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
          label: 'Up to 1,000 managed API keys',
          lucideIcon: 'check',
        },
      ],
    },
    link: {
      label: 'Start for Free',
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
          label: 'Up to 2 vCPU / 2 GB per VM',
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
          label: 'Up to 1M managed API keys',
          lucideIcon: 'check',
        },
        {
          label: 'Includes $5/mo usage credits',
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
          label: 'Up to 8 vCPU / 8 GB per VM',
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
          label: 'Up to 1M managed API keys',
          lucideIcon: 'check',
        },
        {
          label: 'Includes $25/mo usage credits',
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
          label: 'Up to 32 vCPU / 32 GB per VM',
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
          label: 'Up to 1M managed API keys',
          lucideIcon: 'check',
        },
        {
          label: 'Includes $50/mo usage credits',
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
          label: '7-day logs retention',
          lucideIcon: 'check',
        },
        {
          label: '30-day audit log retention',
          lucideIcon: 'check',
        },
        {
          label: 'Unlimited APIs',
          lucideIcon: 'check',
        },
      ],
    },
    link: {
      label: 'Start for Free',
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
          label: '30-day logs retention',
          lucideIcon: 'check',
        },
        {
          label: '90-day audit log retention',
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
          label: 'Dedicated support',
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
          { planId: 'starter', value: 'TBD' },
          { planId: 'pro', value: 'TBD' },
          { planId: 'business', value: 'TBD' },
        ],
      },
      {
        name: 'Max active deployments',
        tooltip: 'The maximum number of active deployments for a single project',
        plans: [
          { planId: 'free', value: '2' },
          { planId: 'starter', value: 'TBD' },
          { planId: 'pro', value: 'TBD' },
          { planId: 'business', value: 'TBD' },
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
        name: 'Max vCPU per VM',
        plans: [
          { planId: 'free', value: '0.25' },
          { planId: 'starter', value: '2' },
          { planId: 'pro', value: '8' },
          { planId: 'business', value: '32' },
        ],
      },
      {
        name: 'Max RAM (GB) per VM',
        plans: [
          { planId: 'free', value: '0.25' },
          { planId: 'starter', value: '2' },
          { planId: 'pro', value: '8' },
          { planId: 'business', value: '32' },
        ],
      },
      {
        name: 'Replicas per project',
        plans: [
          { planId: 'free', value: 'TBD' },
          { planId: 'starter', value: 'TBD' },
          { planId: 'pro', value: 'TBD' },
          { planId: 'business', value: 'TBD' },
        ],
      },
      {
        name: 'Custom domains',
        plans: [
          { planId: 'free', value: false },
          { planId: 'starter', value: true },
          { planId: 'pro', value: true },
          { planId: 'business', value: true },
        ],
      },
      {
        name: 'Sentinel per project',
        plans: [
          { planId: 'free', value: '3 replicas Prod / 1 Preview' },
          { planId: 'starter', value: '3 replicas Prod / 1 Preview' },
          { planId: 'pro', value: '3 replicas Prod / 1 Preview' },
          { planId: 'business', value: '3 replicas Prod / 1 Preview' },
        ],
      },
      {
        name: 'Sentinel Managed API Keys',
        plans: [
          { planId: 'free', value: '1000' },
          { planId: 'starter', value: '1M' },
          { planId: 'pro', value: '1M' },
          { planId: 'business', value: '1M' },
        ],
      },
      {
        name: 'Included usage',
        plans: [
          { planId: 'free', value: '$0' },
          { planId: 'starter', value: '$5' },
          { planId: 'pro', value: '$25' },
          { planId: 'business', value: '$50' },
        ],
      },
    ],
  },
];

export const faqItems = [
  {
    question: 'What counts as valid?',
    answer: `A valid request is a key verification or a ratelimit operation that result in proividng access to your
          service. Requests may be invalid due to exceeding limits, keys being expired or disabled, or other
          factors. To protect your business from abuse, we do not charge for invalid requests. Only key
          verification and ratelimiting requests are billable. All regular API requests are always free.\r\n
          Only key verification and ratelimiting requests are billable. All regular API requests are always free.`,
  },
  {
    question: 'What happens when I go over my plan?',
    answer: `When you go over your plan, you will be charged for the additional requests. You will be charged $0.0001 per request.`,
  },
];

export const enterpriseData = {
  title: 'Enterprise',
  description:
    'Connect with our team for higher resource limits, dedicated requirements, annual contracts, and more.',
  features: [
    'Custom vCPU / RAM limits',
    'Custom Sentinel scaling',
    'Custom domains & gateway setup',
    'Custom managed API keys',
  ],
  buttonText: 'Contact Sales',
  buttonUrl: ENTERPRISE_CONTACT_URL,
};
