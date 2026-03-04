import { createElement, Fragment } from 'react';
import { Alignment, Fit } from '@rive-app/react-canvas';

export const homeHeaderLinks = {
  social: [
    { id: 'discord', label: 'Discord', href: 'https://unkey.dev/discord' },
    { id: 'github', label: 'GitHub', href: 'https://github.com/unkeyed/unkey', metric: '5.1k' },
  ],
  auth: [
    { id: 'login', label: 'Login', href: '/app/login' },
    { id: 'signUp', label: 'Sign Up', href: '/app/sign-up' },
  ],
} as const;

export const homeContentData = {
  hero: {
    title: 'The Developer Platform for Modern APIs',
    description:
      'Unkey unifies your infrastructure. Deploy APIs instantly, route traffic through global gateways, and understand usage in one place.',
    primaryCta: { label: 'Start for free', href: '/placeholder' },
    secondaryCta: { label: 'View on GitHub', href: '/placeholder' },
    poster: { src: '/images/home/hero/hero-poster.jpg', width: 1920, height: 1080 },
    videos: [
      { src: 'videos/home/hero.mp4', type: 'video/mp4; codecs=hvc1' },
      { src: 'videos/home/hero.webm', type: 'video/webm' },
    ],
    logos: [
      {
        alt: 'Fireworks AI logo',
        src: '/images/home/hero/logos/fireworks.svg',
        width: 160,
        height: 28,
        wrapperClassName: 'h-7 w-40',
      },
      {
        alt: 'Cal.com logo',
        src: '/images/home/hero/logos/cal.svg',
        width: 84,
        height: 28,
        wrapperClassName: 'h-7 w-21',
      },
      {
        alt: 'Mintlify logo',
        src: '/images/home/hero/logos/mintlify.svg',
        width: 106,
        height: 28,
        wrapperClassName: 'h-7 w-[6.625rem]',
      },
      {
        alt: 'Symbolica logo',
        src: '/images/home/hero/logos/symbolica.svg',
        width: 125,
        height: 28,
        wrapperClassName: 'h-7 w-[7.8125rem]',
      },
      {
        alt: 'BlindPay logo',
        src: '/images/home/hero/logos/blindpay.svg',
        width: 105,
        height: 28,
        wrapperClassName: 'h-7 w-[6.5625rem]',
      },
      {
        alt: 'Magic Patterns logo',
        src: '/images/home/hero/logos/magicpatterns.svg',
        width: 159,
        height: 24,
        wrapperClassName: 'h-6 w-[9.9375rem]',
      },
      {
        alt: 'Plain logo',
        src: '/images/home/hero/logos/plain.svg',
        width: 74,
        height: 22,
        wrapperClassName: 'h-[1.375rem] w-[4.625rem]',
      },
    ],
  },
  controlPlane: {
    heading: createElement(
      Fragment,
      null,
      'Unify your fragmented API stack with a single control plane for\n',
      createElement('mark', null, 'access and traffic.'),
    ),
    description:
      'Stop assembling your API stack piece by piece. Running APIs at scale usually means juggling hosting, gateways, rate limits, and monitoring across multiple vendors.',
    riveDefaults: {
      src: '/rive/home/control-plane/control-plane.riv',
      fonts: {
        urls: {
          regular: '/rive/home/GeistMono-Regular.ttf',
          medium: '/rive/home/GeistMono-Medium.ttf',
        },
      },
      alignment: Alignment.Center,
      fit: Fit.Cover,
    },
    cards: [
      {
        id: 'branch',
        title: 'Branch Overview',
        body: 'Faster to ship. Go from code to running API in minutes. Test safely, promote when ready, roll back if needed.',
        rive: {
          artboard: 'branch',
        },
      },
      {
        id: 'keys',
        title: 'Manage API Keys',
        body: 'Safer by default. Protect every endpoint with keys, rate limits, and instant access revocation out of the box.',
        rive: {
          artboard: 'api',
          autoBind: false,
        },
      },
      {
        id: 'control',
        title: 'Control Plane',
        body: 'Simpler to run. One platform for deployments, gateways, and observability.',
        rive: {
          artboard: 'control',
          autoBind: false,
        },
      },
      {
        id: 'usage',
        title: 'Usage 30 Days',
        body: 'Visible from day one. Every request logged. Every decision tracked. Debug issues before users notice.',
        rive: {
          artboard: 'usage',
          autoBind: false,
        },
      },
    ],
  },
  buildDeploy: {
    heading: 'Deploy in minutes. Roll back in seconds. Ship with confidence at any scale.',
    description:
      'Infrastructure that moves with your code. Review changes in preview, then promote the exact version you tested.',
    panels: [
      {
        id: 'connect',
        tabLabel: 'Connect',
        title: 'Connect a repo and push code',
        subtitle: 'Git-based deploys, zero setup',
        body: 'Link your Git repository once and deploy automatically on every push. No complex pipelines or manual steps needed.',
        image: '/images/home/build-deploy/connect.png',
      },
      {
        id: 'deploy',
        tabLabel: 'Deploy',
        title: 'Deploy Docker containers',
        subtitle: 'Any language, any framework',
        body: 'Run real containers that stay online, keeping the serverless feel while avoiding short-lived runtimes.',
        image: '/images/home/build-deploy/deploy.png',
        hasLogos: true,
        logos: [
          {
            alt: 'Python',
            src: '/images/home/build-deploy/logos/python.svg',
            width: 112,
            height: 28,
            className: 'h-7 w-28',
          },
          {
            alt: 'TypeScript',
            src: '/images/home/build-deploy/logos/typescript.svg',
            width: 110,
            height: 28,
            className: 'h-7 w-[6.875rem]',
          },
          {
            alt: 'Go',
            src: '/images/home/build-deploy/logos/go.svg',
            width: 75,
            height: 28,
            className: 'h-7 w-[4.6875rem]',
          },
          {
            alt: 'Java',
            src: '/images/home/build-deploy/logos/java.svg',
            width: 97,
            height: 40,
            className: 'h-10 w-[6.0625rem]',
          },
        ],
      },
      {
        id: 'preview',
        tabLabel: 'Preview',
        title: 'Previews for every commit',
        subtitle: 'Test every commit before it ships',
        body: 'Test changes in a separate environment, then promote when the results look right.',
        image: '/images/home/build-deploy/preview.png',
      },
      {
        id: 'ship',
        tabLabel: 'Ship',
        title: 'Ship immutable versions',
        subtitle: 'Instant rollbacks, no guesswork',
        body: 'Keep releases safe with fast rollback paths, switch back instantly without redeploying. The previous production instance stays running for 30 minutes.',
        image: '/images/home/build-deploy/ship.png',
      },
      {
        id: 'validate',
        tabLabel: 'Validate',
        title: 'Validate releases automatically',
        subtitle: 'Branch protection & OpenAPI checks',
        body: 'Make it really hard to ship broken APIs. OpenAPI diffs automatically flag breaking changes before they hit production.',
        image: '/images/home/build-deploy/validate.png',
        textTopClass: 'lg:pt-[7.875rem]',
      },
    ],
  },
  gateway: {
    heading:
      'Protect and control traffic at the edge. Offload access control and rate limiting to global gateways.',
    riveDefaults: {
      autoBind: true,
      alignment: Alignment.BottomCenter,
    },
    cards: [
      {
        title: 'Auth + Keys',
        body: 'Manage API keys end to end and control who can call what.',
        webgl: {
          imageSrc: '/images/home/gateway/auth-depth.png',
          appearanceEffect: 'natural' as const,
          matrixCharSize: 20,
          backgroundCharSize: 85,
          backgroundColor: '#040406',
          backgroundCharColor: '#878787',
          objectColor1: '#bababa',
          objectColor2: '#bababa',
          objectColor3: '#bababa',
          depthIntensity: 4,
          symbolBalance: 21,
          blackPoint: 8,
        },
        useTextBackground: true,
        textWidthClass: 'max-w-88',
        gridClassName:
          'h-[clamp(20rem,76vw,26.25rem)] sm:h-[21rem] md:h-[24rem] xl:h-auto sm:col-start-1 sm:row-start-1 xl:col-start-1 xl:row-start-1',
      },
      {
        title: 'Global platform',
        body: 'Edge gateway enforces access and routes requests to the closest instance for low latency.',
        rive: {
          src: '/rive/home/gateway/global-platform.riv',
          fonts: { urls: { regular: '/rive/home/GeistMono-Regular.ttf' } },
          fit: Fit.Cover,
          alignment: Alignment.TopCenter,
        },
        textWidthClass: 'max-w-90',
        gridClassName:
          'min-h-[30rem] aspect-[505/902] sm:aspect-auto sm:h-auto sm:min-h-0 sm:col-start-2 sm:row-start-1 sm:row-span-2 xl:col-start-2 xl:row-span-2',
      },
      {
        title: 'Rate limits',
        body: 'Set limits per IP, user, or key and enforce them close to your users.',
        rive: {
          src: '/rive/home/gateway/rate-limits.riv',
          fonts: { urls: { regular: '/rive/home/GeistMono-Regular.ttf' } },
        },
        gridClassName:
          'h-[clamp(20rem,76vw,26.25rem)] sm:h-[21rem] md:h-[24rem] xl:h-auto sm:col-start-1 sm:row-start-2 xl:col-start-1 xl:row-start-2',
      },
      {
        title: 'Validation',
        body: 'Enforce request rules early to catch bad traffic before it hits your API.',
        rive: {
          src: '/rive/home/gateway/validation.riv',
          stateMachines: 'State Machine 1',
        },
        gridClassName:
          'h-[clamp(20rem,76vw,26.25rem)] sm:h-[21rem] md:h-[24rem] xl:h-auto sm:col-start-1 sm:row-start-3 xl:col-start-3 xl:row-start-1',
      },
      {
        title: 'Analytics',
        body: 'Access real-time insights into your API usage without adding custom instrumentation.',
        rive: {
          src: '/rive/home/gateway/analytics.riv',
          autoBind: false,
        },
        textWidthClass: 'max-w-96',
        gridClassName:
          'h-[clamp(20rem,76vw,26.25rem)] sm:h-[21rem] md:h-[24rem] xl:h-auto sm:col-start-2 sm:row-start-3 xl:col-start-3 xl:row-start-2',
      },
    ],
  },
  production: {
    label: 'Built for production',
    items: [
      {
        title: 'High availability',
        text: 'Unkey deploys multiple replicas in different availability zones so your app survives during outages.',
      },
      {
        title: 'Proactive protection',
        text: "Take immediate control over your system's security with the ability to instantly revoke access, providing swift response to potential threats.",
      },
    ],
  },
  scale: {
    heading: createElement(
      Fragment,
      null,
      'Start small, scale to global traffic, and ',
      createElement('mark', null, 'stay protected'),
      ' without managing infrastructure manually.',
    ),
    description:
      'Platform that scales with you. Control, routing, and traffic handling are designed for multi-region from day one.',
    buttonLabel: 'Read the docs',
    buttonHref: '/docs',
    riveDefaults: {
      src: '/rive/home/scale/icons.riv',
      fit: Fit.Cover,
      alignment: Alignment.Center,
    },
    features: [
      {
        title: 'Multi-region routing',
        text: 'Route requests to the nearest region for consistently low latency.',
        rive: {
          artboard: 'main 1',
        },
      },
      {
        title: 'Automatic scaling',
        text: 'Capacity follows demand, with no knobs to babysit and no manual ops.',
        rive: {
          artboard: 'main 2',
        },
      },
      {
        title: 'Predictable pricing',
        text: "Start free, then scale up when you're ready and keep billing predictable as you grow.",
        rive: {
          artboard: 'main 3',
        },
      },
      {
        title: 'Built-in protection',
        text: 'Lock down access with API keys, edge rate limits, and instant revoke controls.',
        rive: {
          src: '/rive/home/gateway/analytics.riv',
          artboard: 'main 4',
        },
      },
    ],
  },
  observe: {
    heading: 'Stay in sync with your traffic in real time.',
    subheading: 'Every request is logged. Every decision is visible.',
    riveDefaults: {
      src: '/rive/home/observe/observe.riv',
      alignment: Alignment.BottomCenter,
    },
    mobileImage: '/images/home/observe/dash.png',
    buttonLabel: 'Read the docs',
    buttonHref: '/docs',
    columns: [
      {
        lead: 'Automatic logs and metrics collection.',
        rest: 'Captures verifications, rate limits, audit logs, HTTP request/response logs, and much more automatically.',
      },
      {
        lead: 'Spot spikes and unusual patterns.',
        rest: 'Use metrics to flag anomalies, errors, and performance issues — and feed signals into your alerting stack.',
      },
      {
        lead: 'Debug and explore in the dashboard.',
        rest: 'Filter by deployment, user, region, custom tags, and status to quickly understand what’s going on.',
      },
      {
        lead: 'Query via API, from your own systems.',
        rest: 'Run analytics queries over your verification data via the HTTP API from your stack.',
      },
    ],
  },
  portal: {
    heading: 'First-class developer experience for your users.',
    subheading: 'API keys, usage, and docs—ready out of the box.',
    buttonLabel: 'Try the Portal',
    buttonHref: '/portal',
    cards: [
      {
        text: 'Zero code required. A fully hosted developer portal with nothing to build or maintain.',
        graphic: '/images/home/portal/zero.png',
        textWidthClass: 'max-w-[23.375rem]',
      },
      {
        text: 'Beautiful API docs. OpenAPI-generated documentation, hosted by Unkey and always in sync.',
        graphic: '/images/home/portal/docs.png',
        textWidthClass: 'max-w-[25.6875rem]',
      },
      {
        text: 'Keys and usage, self-serve. Users manage their API keys and view usage without support requests.',
        graphic: '/images/home/portal/keys.png',
        textWidthClass: 'max-w-[25.5625rem]',
      },
    ],
  },
  cta: {
    heading: 'Turn your API stack into one workflow.',
    subheading: 'Start for free, integrate in minutes, and scale when you need to.',
    buttonLabel: 'Start for free',
    buttonHref: '/placeholder',
    poster: '/images/home/cta/poster.jpg',
    videos: [
      { src: 'videos/home/cta.mp4', type: 'video/mp4; codecs=hvc1' },
      { src: 'videos/home/cta.webm', type: 'video/webm' },
    ],
  },
};

export const homePageData = {
  pathname: '/',
  metadata: {
    title: 'Home',
    description: 'Unkey brings API deployment, gateways, and observability into one platform.',
    pathname: '/',
  },
};
