import { createElement, Fragment } from 'react';
import flowEditorImage from '@/assets/images/about/blog/flow-editor.png';
import noSignupImage from '@/assets/images/about/blog/no-signup.png';
import serverlessImage from '@/assets/images/about/blog/serverless.png';
import andreasThomasImage from '@/assets/images/about/founders/andreas-thomas.jpg';
import jamesPerkinsImage from '@/assets/images/about/founders/james-perkins.jpg';
import allisonPickensImage from '@/assets/images/about/investors/allison-pickens.jpg';
import andrewMiklasImage from '@/assets/images/about/investors/andrew-miklas.jpg';
import andyMcLoughlinImage from '@/assets/images/about/investors/andy-mc-loughlin.jpg';
import antWilsonImage from '@/assets/images/about/investors/ant-wilson.jpg';
import liuJiangImage from '@/assets/images/about/investors/liu-jiang.jpg';
import paulCopplestoneImage from '@/assets/images/about/investors/paul-copplestone.jpg';
import roryWildingImage from '@/assets/images/about/investors/rory-wilding.jpg';
import theoBrowneImage from '@/assets/images/about/investors/theo-browne.jpg';
import timothyChenImage from '@/assets/images/about/investors/timothy-chen.jpg';
import tomPrestonWernerImage from '@/assets/images/about/investors/tom-preston-werner.jpg';

export const aboutContentData = {
  title: createElement(
    Fragment,
    null,
    'API management ',
    createElement('br', { className: 'inline sm:hidden xl:inline' }),
    createElement(
      'span',
      { className: 'sm:hidden xl:inline' },
      'for ',
      createElement('mark', null, 'fast and'),
      '\n',
      createElement('mark', null, 'scalable'),
      ' software.',
    ),
    createElement(
      'span',
      { className: 'hidden sm:inline xl:hidden' },
      'for ',
      createElement('mark', null, 'fast '),
      '\n',
      createElement('mark', null, 'and scalable'),
      ' software.',
    ),
  ),
  description: createElement(
    Fragment,
    null,
    'Founded in 2023 by ',
    createElement('span', { className: 'font-medium text-foreground' }, 'James Perkins'),
    ' and ',
    createElement('span', { className: 'font-medium text-foreground' }, 'Andreas Thomas,'),
    ' Unkey is building a fast, scalable, and straightforward API management platform.',
  ),
  values: [
    {
      title: 'Quality',
      description: 'We handle the complexity, so your experience stays simple.',
    },
    {
      title: 'Open company',
      description: 'We believe transparency leads to better decisions.',
    },
    {
      title: 'Ownership',
      description: 'We trust our team to build, ship, and own their work.',
    },
    {
      title: 'Sustainability',
      description: 'We protect work-life balance so our team delivers great value.',
    },
    {
      title: 'Security first',
      description: "We take security seriously and won't compromise to move faster.",
    },
    {
      title: 'Customer obsessed',
      description: 'Real user feedback drives what we build and how fast we ship.',
    },
  ],
  team: {
    title: 'Meet the people building Unkey every day.',
    subtitle: 'We love meeting up for offsites sometimes.',
    badgeLabel: 'The Team',
    qaItems: [
      {
        question: "What's your goal with Unkey?",
        answer:
          "Our goal with Unkey is build an open source API management platform that doesn't require the burden or cost of traditional API management platforms like Kong or Azure APM. We want to embrace what developers know today, a global REST API that allows you to deploy and protect your API on the edge in under 5 minutes.",
      },
      {
        question: 'What are you most proud of at Unkey?',
        answer:
          'We are extremely happy with the culture we have built at Unkey, our team is small but powerful. Everyone in our team has input on the next feature or idea we have for Unkey, allowing us to build the best API management platform.',
      },
      {
        question: "What's been the biggest challenge?",
        answer:
          "The hardest part is prioritization. With a small team, we can't build everything at once, so we're careful to ship only what truly helps users.",
      },
    ],
    quote: createElement(
      Fragment,
      null,
      `"We're James and Andreas. We founded Unkey with the vision of creating an API management platform that is both powerful and easy to use. We believe that APIs are the building blocks of the modern web, and we want to make it easier for developers to build and manage them."`,
    ),
    founders: [
      {
        name: 'James Perkins',
        title: 'Founder and CEO',
        imageSrc: jamesPerkinsImage.src,
      },
      {
        name: 'Andreas Thomas',
        title: 'Founder and CTO',
        imageSrc: andreasThomasImage.src,
      },
    ],
  },
  investors: {
    label: 'Investors',
    heading: createElement(
      Fragment,
      null,
      'Backed by ',
      createElement('mark', null, 'the finest minds'),
      ' in modern infrastructure',
    ),
    description:
      "Unkey is supported by leading investors and founders who've built and scaled some of today's most trusted developer platforms.",
    list: [
      {
        name: 'Andy McLoughlin',
        role: 'Managing Partner,\r\nUncork Capital',
        imageSrc: andyMcLoughlinImage.src,
      },
      {
        name: 'Timothy Chen',
        role: 'GP, Essence VC',
        imageSrc: timothyChenImage.src,
      },
      {
        name: 'Liu Jiang',
        role: 'GP, Sunflower Capital',
        imageSrc: liuJiangImage.src,
      },
      {
        name: 'Allison Pickens',
        role: 'GP, The New Normal Fund',
        imageSrc: allisonPickensImage.src,
      },
      {
        name: 'Andrew Miklas',
        role: 'Former CTO, PageDuty',
        imageSrc: andrewMiklasImage.src,
      },
      {
        name: 'Tom Preston-Werner',
        role: 'Former CEO, GitHub',
        imageSrc: tomPrestonWernerImage.src,
      },
      {
        name: 'Theo Browne',
        role: 'CEO, Ping Labs',
        imageSrc: theoBrowneImage.src,
      },
      {
        name: 'Paul Copplestone',
        role: 'CEO, Supabase',
        imageSrc: paulCopplestoneImage.src,
      },
      {
        name: 'Ant Wilson',
        role: 'CTO, Supabase',
        imageSrc: antWilsonImage.src,
      },
      {
        name: 'Rory Wilding',
        role: 'Head of Growth, Supabase',
        imageSrc: roryWildingImage.src,
      },
    ],
  },
  blog: {
    label: 'Blog',
    heading: createElement(
      Fragment,
      null,
      'Explore insights, tips, and updates',
      createElement('br'),
      createElement('span', { className: 'text-gray-60' }, 'directly from our team members.'),
    ),
    ctaLabel: 'Read all stories',
    ctaHref: '/blog',
    cards: [],
  },
};

export const aboutBlogFallbackImages = [
  flowEditorImage.src,
  serverlessImage.src,
  noSignupImage.src,
] as const;
