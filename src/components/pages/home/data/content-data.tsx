export const homeContentData = {
  hero: {
    title: 'The Developer Platform for Modern APIs',
    description:
      'Unkey unifies your infrastructure. Deploy APIs instantly, route traffic through global gateways, and understand usage in one place.',
    primaryCta: { label: 'Start for free', href: '/placeholder' },
    secondaryCta: { label: 'View on GitHub', href: '/placeholder' },
    background: { src: '/images/home/hero/hero-bg.png' },
    poster: { src: '/images/home/hero/hero-poster.jpg', width: 1920, height: 1080 },
    videos: [
      { src: '/hero-av1.mp4', type: 'video/mp4; codecs="av01.0.05M.08"' },
      { src: '/hero-h265.mp4', type: 'video/mp4; codecs=hvc1' },
      { src: '/hero.webm', type: 'video/webm' },
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
        wrapperClassName: 'h-7 w-[106px]',
      },
      {
        alt: 'Symbolica logo',
        src: '/images/home/hero/logos/symbolica.svg',
        width: 125,
        height: 28,
        wrapperClassName: 'h-7 w-[125px]',
      },
      {
        alt: 'BlindPay logo',
        src: '/images/home/hero/logos/blindpay.svg',
        width: 105,
        height: 28,
        wrapperClassName: 'h-7 w-[105px]',
      },
      {
        alt: 'Magic Patterns logo',
        src: '/images/home/hero/logos/magicpatterns.svg',
        width: 159,
        height: 24,
        wrapperClassName: 'h-6 w-[159px]',
      },
      {
        alt: 'Plain logo',
        src: '/images/home/hero/logos/plain.svg',
        width: 74,
        height: 22,
        wrapperClassName: 'h-[22px] w-[74px]',
      },
    ],
  },
  controlPlane: {
    heading: (
      <>
        {'Unify your fragmented API stack with a single control plane for\n'}
        <mark>access and traffic.</mark>
      </>
    ),
    description:
      'Stop assembling your API stack piece by piece. Running APIs at scale usually means juggling hosting, gateways, rate limits, and monitoring across multiple vendors.',
    cards: [
      {
        id: 'branch',
        title: 'Branch Overview',
        body: 'Faster to ship. Go from code to running API in minutes. Test safely, promote when ready, roll back if needed.',
        graphic: '/images/home/control-plane/branch.png',
        graphicAlt: 'Branch overview graphic',
      },
      {
        id: 'keys',
        title: 'Manage API Keys',
        body: 'Safer by default. Protect every endpoint with keys, rate limits, and instant access revocation out of the box.',
        graphic: '/images/home/control-plane/keys.png',
        graphicAlt: 'API keys graphic',
      },
      {
        id: 'control',
        title: 'Control Plane',
        body: 'Simpler to run. One platform for deployments, gateways, and observability.',
        graphic: '/images/home/control-plane/control.png',
        graphicAlt: 'Control plane graphic',
      },
      {
        id: 'usage',
        title: 'Usage 30 Days',
        body: 'Visible from day one. Every request logged. Every decision tracked. Debug issues before users notice.',
        graphic: '/images/home/control-plane/usage.png',
        graphicAlt: 'Usage analytics graphic',
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
        imageAlt: 'Connect repository interface',
      },
      {
        id: 'deploy',
        tabLabel: 'Deploy',
        title: 'Deploy Docker containers',
        subtitle: 'Any language, any framework',
        body: 'Run real containers that stay online, keeping the serverless feel while avoiding short-lived runtimes.',
        image: '/images/home/build-deploy/deploy.png',
        imageAlt: 'Container runtime configuration',
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
            className: 'h-7 w-[110px]',
          },
          {
            alt: 'Go',
            src: '/images/home/build-deploy/logos/go.svg',
            width: 75,
            height: 28,
            className: 'h-7 w-[75px]',
          },
          {
            alt: 'Java',
            src: '/images/home/build-deploy/logos/java.svg',
            width: 97,
            height: 40,
            className: 'h-10 w-[97px]',
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
        imageAlt: 'Preview deployments list',
      },
      {
        id: 'ship',
        tabLabel: 'Ship',
        title: 'Ship immutable versions',
        subtitle: 'Instant rollbacks, no guesswork',
        body: 'Keep releases safe with fast rollback paths, switch back instantly without redeploying. The previous production instance stays running for 30 minutes.',
        image: '/images/home/build-deploy/ship.png',
        imageAlt: 'Rollback to version interface',
      },
      {
        id: 'validate',
        tabLabel: 'Validate',
        title: 'Validate releases automatically',
        subtitle: 'Branch protection & OpenAPI checks',
        body: 'Make it really hard to ship broken APIs. OpenAPI diffs automatically flag breaking changes before they hit production.',
        image: '/images/home/build-deploy/validate.png',
        imageAlt: 'View changes diff interface',
        textTopClass: 'lg:pt-[126px]',
      },
    ],
  },
  gateway: {
    heading:
      'Protect and control traffic at the edge. Offload access control and rate limiting to global gateways.',
    cards: [
      {
        title: 'Auth + Keys',
        body: 'Manage API keys end to end and control who can call what.',
        graphic: '/images/home/gateway/auth.png',
        graphicAlt: 'Auth and keys graphic',
        fullBleedImage: true,
        useTextBackground: true,
        imageWrapperClassName: 'absolute inset-6 md:inset-8 overflow-hidden',
        imageClassName: 'object-cover object-bottom',
        textWidthClass: 'max-w-88',
        gridClassName:
          'h-[clamp(360px,74vw,500px)] sm:h-[446px] xl:h-auto sm:col-start-1 sm:row-start-1 xl:col-start-1 xl:row-start-1',
      },
      {
        title: 'Global platform',
        body: 'Edge gateway enforces access and routes requests to the closest instance for low latency.',
        graphic: '/images/home/gateway/global.png',
        graphicAlt: 'Global platform graphic',
        fullBleedImage: true,
        imageClassName:
          'max-[425px]:object-contain max-[425px]:object-bottom min-[426px]:object-cover min-[426px]:object-top',
        textWidthClass: 'max-w-90',
        gridClassName:
          'min-h-[540px] aspect-[505/902] sm:aspect-auto sm:h-auto sm:min-h-0 sm:col-start-2 sm:row-start-1 sm:row-span-2 xl:col-start-2 xl:row-span-2',
      },
      {
        title: 'Rate limits',
        body: 'Set limits per IP, user, or key and enforce them close to your users.',
        graphic: '/images/home/gateway/rate.png',
        graphicAlt: 'Rate limits graphic',
        imageWrapperClassName:
          'absolute inset-4 xl:left-7 xl:right-7 xl:top-7 xl:bottom-8 overflow-hidden',
        imageClassName: 'object-cover object-left-top',
        gridClassName:
          'h-[clamp(360px,74vw,500px)] sm:h-[446px] xl:h-auto sm:col-start-1 sm:row-start-2 xl:col-start-1 xl:row-start-2',
      },
      {
        title: 'Validation',
        body: 'Enforce request rules early to catch bad traffic before it hits your API.',
        graphic: '/images/home/gateway/validation.png',
        graphicAlt: 'Validation graphic',
        imageWrapperClassName: 'absolute inset-6 md:inset-8 xl:right-[31px] overflow-hidden',
        imageClassName: 'object-cover object-left-top',
        gridClassName:
          'h-[clamp(360px,74vw,500px)] sm:h-[446px] xl:h-auto sm:col-start-1 sm:row-start-3 xl:col-start-3 xl:row-start-1',
      },
      {
        title: 'Analytics',
        body: 'Access real-time insights into your API usage without adding custom instrumentation.',
        graphic: '/images/home/gateway/analytics.png',
        graphicAlt: 'Analytics graphic',
        fullBleedImage: true,
        textWidthClass: 'max-w-96',
        imageClassName: 'object-cover',
        gridClassName:
          'h-[clamp(360px,74vw,500px)] sm:h-[446px] xl:h-auto sm:col-start-2 sm:row-start-3 xl:col-start-3 xl:row-start-2',
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
    heading: (
      <>
        Start small, scale to global traffic, and <mark>stay protected</mark> without managing
        infrastructure manually.
      </>
    ),
    description:
      'Platform that scales with you. Control, routing, and traffic handling are designed for multi-region from day one.',
    buttonLabel: 'Read the docs',
    buttonHref: '/docs',
    features: [
      {
        title: 'Multi-region routing',
        text: 'Route requests to the nearest region for consistently low latency.',
        icon: '/images/home/scale/multiregion.svg',
      },
      {
        title: 'Automatic scaling',
        text: 'Capacity follows demand, with no knobs to babysit and no manual ops.',
        icon: '/images/home/scale/scaling.svg',
      },
      {
        title: 'Predictable pricing',
        text: "Start free, then scale up when you're ready and keep billing predictable as you grow.",
        icon: '/images/home/scale/pricing.svg',
      },
      {
        title: 'Built-in protection',
        text: 'Lock down access with API keys, edge rate limits, and instant revoke controls.',
        icon: '/images/home/scale/protection.svg',
      },
    ],
  },
  observe: {
    heading: 'Stay in sync with your traffic in real time.',
    subheading: 'Every request is logged. Every decision is visible.',
    dashboardImage: '/images/home/observe/dashboard.png',
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
        graphicAlt: 'Portal zero code graphic',
        textWidthClass: 'max-w-[374px]',
      },
      {
        text: 'Beautiful API docs. OpenAPI-generated documentation, hosted by Unkey and always in sync.',
        graphic: '/images/home/portal/docs.png',
        graphicAlt: 'Portal documentation graphic',
        textWidthClass: 'max-w-[411px]',
      },
      {
        text: 'Keys and usage, self-serve. Users manage their API keys and view usage without support requests.',
        graphic: '/images/home/portal/keys.png',
        graphicAlt: 'Portal keys graphic',
        textWidthClass: 'max-w-[409px]',
      },
    ],
  },
  cta: {
    heading: 'Turn your API stack into one workflow.',
    subheading: 'Start for free, integrate in minutes, and scale when you need to.',
    buttonLabel: 'Start for free',
    buttonHref: '/placeholder',
    backgroundImage: '/images/home/cta/visual.png',
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
