import { createElement, Fragment } from 'react';
import buildDeployConnectImage from '@/assets/images/home/build-deploy/connect.png';
import buildDeployDeployImage from '@/assets/images/home/build-deploy/deploy.png';
import buildDeployPreviewImage from '@/assets/images/home/build-deploy/preview.png';
import buildDeployShipImage from '@/assets/images/home/build-deploy/ship.png';
import buildDeployValidateImage from '@/assets/images/home/build-deploy/validate.png';
import ctaPosterImage from '@/assets/images/home/cta/poster.jpg';
import gatewayAuthDepthImage from '@/assets/images/home/gateway/auth-depth.png';
import heroPosterImage from '@/assets/images/home/hero/hero-poster.png';
import observeDashImage from '@/assets/images/home/observe/dash.png';
import portalDocsImage from '@/assets/images/home/portal/docs.png';
import portalKeysImage from '@/assets/images/home/portal/keys.png';
import portalZeroImage from '@/assets/images/home/portal/zero.png';
import { APP_URL, DOCS_URL, GITHUB_URL, SIGN_UP_URL } from '@/configs/website-config';
import { buildDeployTechnologyLogos, homePortfolioLogos } from '@/constants/logos';
import { Alignment, Fit } from '@rive-app/react-canvas';

export const homeHeaderLinks = {
  social: [
    { id: 'discord', label: 'Discord', href: 'https://unkey.dev/discord' },
    { id: 'github', label: 'GitHub', href: GITHUB_URL, metric: '5.1k' },
  ],
  auth: [
    { id: 'login', label: 'Login', href: APP_URL },
    { id: 'signUp', label: 'Sign Up', href: SIGN_UP_URL },
  ],
} as const;

export const homeContentData = {
  hero: {
    title: 'The Developer Platform for Modern APIs',
    description:
      'Unkey unifies your infrastructure. Deploy APIs instantly, route traffic through global gateways, and understand usage in one place.',
    primaryCta: { label: 'Start for free', href: APP_URL },
    secondaryCta: { label: 'View on GitHub', href: GITHUB_URL },
    poster: { src: heroPosterImage.src, width: 1533, height: 908 },
    videos: [
      { src: '/videos/home/hero.mp4', type: 'video/mp4; codecs=hvc1' },
      { src: '/videos/home/hero.webm', type: 'video/webm' },
    ],
    logos: homePortfolioLogos,
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
          regular: '/rive/home/JetBrainsMono-Regular.ttf',
          medium: '/rive/home/JetBrainsMono-Medium.ttf',
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
        body: 'Simpler to run. One single unified platform for deployments, gateways, and full observability.',
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
        image: buildDeployConnectImage.src,
      },
      {
        id: 'deploy',
        tabLabel: 'Deploy',
        title: 'Deploy Docker containers',
        subtitle: 'Any language, any framework',
        body: 'Run real containers that stay online, keeping the serverless feel while avoiding short-lived runtimes.',
        image: buildDeployDeployImage.src,
        hasLogos: true,
        logos: buildDeployTechnologyLogos,
      },
      {
        id: 'preview',
        tabLabel: 'Preview',
        title: 'Previews for every commit',
        subtitle: 'Test every commit before it ships',
        body: 'Test changes in a separate environment, then promote when the results look right.',
        image: buildDeployPreviewImage.src,
      },
      {
        id: 'ship',
        tabLabel: 'Ship',
        title: 'Ship immutable versions',
        subtitle: 'Instant rollbacks, no guesswork',
        body: 'Keep releases safe with fast rollback paths, switch back instantly without redeploying. The previous production instance stays running for 30 minutes.',
        image: buildDeployShipImage.src,
      },
      {
        id: 'validate',
        tabLabel: 'Validate',
        title: 'Validate releases automatically',
        subtitle: 'Branch protection & OpenAPI checks',
        body: 'Make it really hard to ship broken APIs. OpenAPI diffs automatically flag breaking changes before they hit production.',
        image: buildDeployValidateImage.src,
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
          imageSrc: gatewayAuthDepthImage.src,
          appearanceEffect: 'natural' as const,
          matrixCharSize: 12,
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
          fonts: { urls: { regular: '/rive/home/JetBrainsMono-Regular.ttf' } },
          fit: Fit.Cover,
          alignment: Alignment.TopCenter,
        },
        textWidthClass: 'max-w-90',
        gridClassName:
          'aspect-[505/902] sm:aspect-auto sm:h-auto sm:min-h-0 sm:col-start-2 sm:row-start-1 sm:row-span-2 xl:col-start-2 xl:row-span-2',
      },
      {
        title: 'Rate limits',
        body: 'Set limits per IP, user, or key and enforce them close to your users.',
        rive: {
          src: '/rive/home/gateway/rate-limits.riv',
          fonts: { urls: { regular: '/rive/home/JetBrainsMono-Regular.ttf' } },
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
    buttonHref: DOCS_URL,
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
    mobileImage: observeDashImage.src,
    buttonLabel: 'Read the docs',
    buttonHref: DOCS_URL,
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
    buttonHref: APP_URL,
    cards: [
      {
        text: 'Zero code required. A fully hosted developer portal with nothing to build or maintain.',
        graphic: portalZeroImage.src,
        textWidthClass: 'max-w-[23.375rem]',
      },
      {
        text: 'Beautiful API docs. OpenAPI-generated documentation, hosted by Unkey and always in sync.',
        graphic: portalDocsImage.src,
        textWidthClass: 'max-w-[25.6875rem]',
      },
      {
        text: 'Keys and usage, self-serve. Users manage their API keys and view usage without support requests.',
        graphic: portalKeysImage.src,
        textWidthClass: 'max-w-[25.5625rem]',
      },
    ],
  },
  cta: {
    heading: 'Turn your API stack into one workflow.',
    subheading: 'Start for free, integrate in minutes, and scale when you need to.',
    buttonLabel: 'Start for free',
    buttonHref: APP_URL,
    poster: ctaPosterImage.src,
    videos: [
      { src: '/videos/home/cta.mp4', type: 'video/mp4; codecs=hvc1' },
      { src: '/videos/home/cta.webm', type: 'video/webm' },
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
