import { homeContentData } from '@/constants/home';

import { getMetadata } from '@/lib/get-metadata';
import Blog from '@/components/pages/about/blog';
import Hero from '@/components/pages/about/hero';
import Investors from '@/components/pages/about/investors';
import TeamSection from '@/components/pages/about/team';
import Cta from '@/components/pages/home/cta';

export const metadata = getMetadata({
  title: 'About',
  description: 'Learn more about us.',
  pathname: '/about',
});

const contentData = {
  title: (
    <>
      {'API management\nfor '}
      <mark>fast and</mark>
      {'\n'}
      <mark>scalable</mark>
      {' software.'}
    </>
  ),
  description: (
    <>
      {'Founded in 2023 by '}
      <span className="font-medium text-foreground">James Perkins</span>
      {' and '}
      <span className="font-medium text-foreground">Andreas Thomas,</span>
      {' Unkey is building a fast, scalable, and straightforward API management platform.'}
    </>
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
    quote: (
      <>
        &ldquo;We&apos;re James and Andreas. We founded Unkey with the vision of creating an API
        management platform that is both powerful and easy to use. We believe that APIs are the
        building blocks of the modern web, and we want to make it easier for developers to build and
        manage them.&rdquo;
      </>
    ),
    founders: [
      {
        name: 'James Perkins',
        title: 'Founder and CEO',
        imageSrc: '/images/about/founders/James_Perkins.png',
      },
      {
        name: 'Andreas Thomas',
        title: 'Founder and CTO',
        imageSrc: '/images/about/founders/Andreas_Thomas.png',
      },
    ],
  },
  investors: {
    label: 'Investors',
    heading: (
      <>
        {'Backed by '}
        <mark>the finest minds</mark>
        {' in modern infrastructure'}
      </>
    ),
    description:
      "Unkey is supported by leading investors and founders who've built and scaled some of today's most trusted developer platforms.",
    list: [
      {
        name: 'Timothy Chen',
        role: 'GP, Essence VC',
        imageSrc: '/images/about/investors/Timothy_Chen.png',
      },
      {
        name: 'Liu Jiang',
        role: 'GP, Sunflower Capital',
        imageSrc: '/images/about/investors/Liu_Jiang.png',
      },
      {
        name: 'Allison Pickens',
        role: 'GP, The New Normal Fund',
        imageSrc: '/images/about/investors/Allison_Pickens.png',
      },
      {
        name: 'Andrew Miklas',
        role: 'Former CTO, PageDuty',
        imageSrc: '/images/about/investors/Andrew_Miklas.png',
      },
      {
        name: 'Tom Preston-Werner',
        role: 'Former CEO, GitHub',
        imageSrc: '/images/about/investors/Tom_Preston-Werner.png',
      },
      {
        name: 'Theo Browne',
        role: 'CEO, Ping Labs',
        imageSrc: '/images/about/investors/Theo_Browne.png',
      },
      {
        name: 'Paul Copplestone',
        role: 'CEO, Supabase',
        imageSrc: '/images/about/investors/Paul_Copplestone.png',
      },
      {
        name: 'Ant Wilson',
        role: 'CTO, Supabase',
        imageSrc: '/images/about/investors/Ant_Wilson.png',
      },
      {
        name: 'Rory Wilding',
        role: 'Head of Growth, Supabase',
        imageSrc: '/images/about/investors/Rory_Wilding.png',
      },
      {
        name: 'Zain Allarakhia',
        role: 'Former CTO, Pipe',
        imageSrc: '/images/about/investors/Zain_Allarakhia.png',
      },
    ],
  },
  blog: {
    label: 'Blog',
    heading: (
      <>
        Explore insights, tips, and updates
        <br />
        <span className="text-gray-60">directly from our team members.</span>
      </>
    ),
    ctaLabel: 'Read all stories',
    ctaHref: '/blog',
    cards: [
      {
        href: '#',
        imageSrc: '/images/about/blog/flow_editor.jpg',
        imageAlt: 'Building a flow editor',
        category: 'Product Updates',
        date: 'MAY 9, 2024',
        title: 'Building a flow editor',
      },
      {
        href: '#',
        imageSrc: '/images/about/blog/serverless.jpg',
        imageAlt: "Why we're leaving serverless",
        category: 'Product Updates',
        date: 'MAY 9, 2024',
        title: "Why we're leaving serverless",
      },
      {
        href: '#',
        imageSrc: '/images/about/blog/no_signup.jpg',
        imageAlt: 'No Signup Required',
        category: 'Product Updates',
        date: 'MAY 9, 2024',
        title: 'No Signup Required',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <main>
      <Hero
        title={contentData.title}
        description={contentData.description}
        values={contentData.values}
      />
      <TeamSection {...contentData.team} />
      <Investors {...contentData.investors} />
      <Blog {...contentData.blog} />
      <Cta {...homeContentData.cta} />
    </main>
  );
}
