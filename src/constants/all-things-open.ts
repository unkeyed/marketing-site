import { createElement, Fragment } from 'react';
import { Gamepad2, Keyboard } from 'lucide-react';

import { GIVEAWAY_WINDOW_COPY } from '@/lib/giveaway-window';
import type { IProgramBenefit } from '@/components/pages/program/program-section';

export const allThingsOpenContentData = {
  eyebrow: 'All Things Open',
  title: createElement(
    Fragment,
    null,
    'Win a ',
    createElement('mark', null, 'Switch 2'),
    '\nor a NuPhy keyboard',
  ),
  description: `Deploy a project to Unkey Compute, then submit it with the form. ${GIVEAWAY_WINDOW_COPY}`,
  benefits: [
    {
      icon: Gamepad2,
      title: '1x Nintendo Switch 2',
      description: 'One console.',
    },
    {
      icon: Keyboard,
      title: '5x NuPhy Air75 V3',
      description: 'Five NuPhy Air75 V3 keyboards.',
    },
    {
      icon: Keyboard,
      title: '5x NuPhy Kick75',
      description: 'Five NuPhy Kick75 keyboards.',
    },
  ] satisfies IProgramBenefit[],
};
