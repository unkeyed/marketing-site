import { createElement, Fragment } from 'react';
import { ArrowRightLeft, CircleDot, Flame, MessageSquare } from 'lucide-react';

import type { IProgramBenefit } from '@/components/pages/program/program-section';

export const ycContentData = {
  eyebrow: 'Y Combinator Program',
  title: createElement(
    Fragment,
    null,
    createElement('mark', null, '$1,000 in credits'),
    '\nevery month for current YC batch',
  ),
  description:
    '$1,000 in credits every month for 12 months for the current YC batch. Raised more than $5 million? You still qualify for 50% off your bill for 12 months.',
  benefits: [
    {
      icon: CircleDot,
      title: '$1,000 in monthly credits',
      description:
        "No catch. Get $1,000 in credits every month for 12 months while you build and ship — we're happy to cover the bill.",
    },
    {
      icon: MessageSquare,
      title: 'Priority support',
      description:
        "We know startup life is about moving fast and we won't block you. We give you a dedicated Slack channel to ask questions and get help.",
    },
    {
      icon: Flame,
      title: 'Concierge onboarding',
      description:
        'If helpful for your startup, we can schedule a 1:1 onboarding session to help you get started with Unkey and decide on what is best for your use case.',
    },
    {
      icon: ArrowRightLeft,
      title: 'Migration support',
      description: 'Hands on support to help you migrate to Unkey from your existing platform.',
    },
  ] satisfies IProgramBenefit[],
};
