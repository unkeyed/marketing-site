import { createElement, Fragment } from 'react';
import { APP_URL } from '@/configs/website-config';

import type {
  IAgentClient,
  IAgentControlItem,
  IAgentSessionStep,
  IAgentSetupFallback,
  IAgentSetupOption,
  IAgentsHero,
  IAgentStackPart,
} from '@/types/agents';

const INSTALL_CLI = 'npm install -g unkey && unkey login';
const UNKEY_MCP_URL = 'https://mcp.unkey.com';
const COMPUTE_MCP_URL = 'https://mcp.unkey.com/compute';
const OTHER_CLIENTS_GUIDE = 'https://www.unkey.com/docs/platform/ai-coding/other-clients';
const UNKEY_MCP_DESCRIPTION =
  'The v2 API: keys, keyspaces, identities, permissions, rate limits, analytics, portals, and Compute.';
const VERIFICATIONS_PROMPT =
  'How many verifications did my production keyspace get yesterday, broken down by outcome?';
const MCP_JSON = JSON.stringify({ mcpServers: { unkey: { url: UNKEY_MCP_URL } } }, null, 2);

const option = (title: string, description: string, code: string, fileName?: string) =>
  ({ title, description, snippets: [{ code, fileName }] }) satisfies IAgentSetupOption;

const cliOption = (description: string) => option('CLI', description, INSTALL_CLI);

const hero: IAgentsHero = {
  label: 'Agents',
  title: createElement(
    Fragment,
    null,
    'Ship your API with ',
    createElement('mark', null, 'your coding agent.'),
  ),
  description:
    'Connect Claude Code, Cursor, Codex, or any MCP client to Unkey and sign in with your account. Your agent deploys, issues keys, sets rate limits, and reads the logs, with only the permissions you approve.',
  install: [
    {
      caption: 'Add the MCP server to your agent:',
      code: UNKEY_MCP_URL,
      note: 'No API key. Your agent opens Unkey in the browser and you choose what it can do.',
    },
    { caption: 'Or use the CLI:', code: INSTALL_CLI },
  ],
  primaryCta: { label: 'Start for free', href: APP_URL },
  secondaryCta: {
    label: 'Read the agent docs',
    href: 'https://www.unkey.com/docs/platform/ai-coding/overview',
  },
};

const sessionSteps: IAgentSessionStep[] = [
  {
    id: 'set-up',
    title: 'Set up.',
    prompt: 'Set up Unkey for this project',
    calls: [
      {
        kind: 'shell',
        command: `claude mcp add --transport http unkey ${UNKEY_MCP_URL}`,
        result: 'added',
      },
      { kind: 'shell', command: '/mcp', result: 'signed in with Unkey' },
    ],
    outcome: 'You picked a workspace and permissions in the browser. No root key to copy.',
  },
  {
    id: 'deploy',
    title: 'Deploy.',
    prompt: 'Deploy ghcr.io/acme/payments:1.4.2 to production',
    calls: [
      { kind: 'tool', command: 'unkey_v2_deployments_create_deployment_v3', result: 'queued' },
      { kind: 'tool', command: 'unkey_v2_deployments_get_deployment', result: 'ready' },
    ],
    outcome: 'payments-api is live in production.',
  },
  {
    id: 'issue-key',
    title: 'Issue a key.',
    prompt: 'Create a key for user_123 that allows 100 requests per minute',
    calls: [{ kind: 'tool', command: 'unkey_v2_keys_create_key', result: 'key created' }],
    outcome: 'The key comes back once, with the limit applied on every verification.',
  },
  {
    id: 'find-bug',
    title: 'Find the bug.',
    prompt: 'Why is payments-api returning 500s?',
    calls: [
      {
        kind: 'tool',
        command: 'unkey_v2_analytics_get_gateway_requests',
        result: '212 responses with status 500',
      },
      {
        kind: 'tool',
        command: 'unkey_v2_analytics_get_runtime_logs',
        result: 'STRIPE_SECRET_KEY is not set',
      },
    ],
    outcome: 'The new release is missing an environment variable.',
  },
  {
    id: 'roll-back',
    title: 'Roll back.',
    prompt: 'Roll back production to the previous deployment',
    calls: [
      { kind: 'tool', command: 'unkey_v2_deployments_list_deployments', result: '2 ready' },
      {
        kind: 'tool',
        command: 'unkey_v2_deployments_rollback_deployment',
        result: 'rolling back',
      },
    ],
    outcome: 'Production serves the previous release while you fix the variable.',
  },
];

const clients: IAgentClient[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    maker: 'Anthropic',
    connects: ['MCP', 'CLI'],
    options: [
      option(
        'Unkey MCP',
        UNKEY_MCP_DESCRIPTION,
        `claude mcp add --transport http unkey ${UNKEY_MCP_URL}`,
      ),
      option(
        'Compute MCP',
        'Projects, apps, environments and their variables, deployments, domains, gateway policies, and the GitHub app.',
        `claude mcp add --transport http unkey-compute ${COMPUTE_MCP_URL}`,
      ),
      option(
        'Docs MCP',
        'Search the Unkey docs from inside a session.',
        'claude mcp add --transport http unkey-docs "https://www.unkey.com/docs/mcp"',
      ),
      cliOption('The full API as shell commands.'),
    ],
    tryPrompt:
      'Create a key in my production keyspace for user_123 that allows 100 requests per minute.',
    notes: [
      'Run /mcp in Claude Code and select unkey to sign in.',
      'Run claude mcp list and check that unkey shows Connected.',
      'Add --scope project to save it to .mcp.json. Each teammate signs in with their own Unkey account.',
    ],
    guideHref: 'https://www.unkey.com/docs/platform/ai-coding/claude-code',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    connects: ['MCP', 'CLI'],
    options: [
      option(
        'Unkey MCP',
        'Add it to .cursor/mcp.json for one project, or ~/.cursor/mcp.json for all of them.',
        MCP_JSON,
        '.cursor/mcp.json',
      ),
      cliOption("Run it in Cursor's terminal."),
    ],
    tryPrompt: VERIFICATIONS_PROMPT,
    notes: [
      'Cursor opens Unkey in your browser when it asks you to sign in.',
      'The install page at mcp.unkey.com/install has an Add to Cursor button.',
      'Connection errors show in the Output panel under MCP Logs.',
    ],
    guideHref: 'https://www.unkey.com/docs/platform/ai-coding/cursor',
  },
  {
    id: 'codex',
    name: 'Codex',
    maker: 'OpenAI',
    connects: ['MCP', 'CLI'],
    options: [
      option(
        'Unkey MCP',
        'Add the server, then sign in.',
        [`codex mcp add unkey --url ${UNKEY_MCP_URL}`, 'codex mcp login unkey'].join('\n'),
      ),
      cliOption('The full API as shell commands.'),
    ],
    tryPrompt:
      "Show the latest deployment for my api app's production environment, then roll back to the one before it.",
    notes: ['codex mcp login unkey opens Unkey in your browser.'],
    guideHref: OTHER_CLIENTS_GUIDE,
  },
  {
    id: 'vscode',
    name: 'VS Code',
    maker: 'GitHub Copilot',
    connects: ['MCP'],
    options: [
      option(
        'Unkey MCP',
        'Add the server from your terminal.',
        `code --add-mcp '{"name":"unkey","type":"http","url":"${UNKEY_MCP_URL}"}'`,
      ),
    ],
    tryPrompt:
      'Add the domain api.example.com to production and tell me which DNS records to create.',
    notes: [
      'VS Code asks you to sign in to Unkey when the server starts.',
      'The install page at mcp.unkey.com/install has an Add to VS Code button.',
    ],
    guideHref: OTHER_CLIENTS_GUIDE,
  },
  {
    id: 'claude-desktop',
    name: 'Claude Desktop',
    maker: 'Anthropic',
    connects: ['MCP'],
    options: [
      option(
        'Custom connector',
        'Open Customize, then Connectors, click + Add, choose Add custom connector, and paste this URL.',
        UNKEY_MCP_URL,
      ),
    ],
    tryPrompt: VERIFICATIONS_PROMPT,
    notes: [
      'Claude opens Unkey in your browser so you can authorize it.',
      'On Team and Enterprise plans, an Owner adds the connector under Organization settings. Each member signs in with their own Unkey account.',
    ],
    guideHref: OTHER_CLIENTS_GUIDE,
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    maker: 'Google',
    connects: ['MCP'],
    options: [
      option(
        'Unkey MCP',
        UNKEY_MCP_DESCRIPTION,
        `gemini mcp add --transport http unkey ${UNKEY_MCP_URL}`,
      ),
    ],
    tryPrompt: 'List my Unkey projects and the latest deployment for each.',
    notes: ['Run /mcp auth unkey in Gemini CLI to sign in.'],
    guideHref: OTHER_CLIENTS_GUIDE,
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    connects: ['MCP'],
    options: [
      option(
        'Unkey MCP',
        'Add it to ~/.config/devin/mcp_config.json.',
        MCP_JSON,
        'mcp_config.json',
      ),
    ],
    tryPrompt: 'List my Unkey keyspaces.',
    notes: ['Sign in to Unkey when Windsurf prompts you.'],
    guideHref: OTHER_CLIENTS_GUIDE,
  },
  {
    id: 'terminal',
    name: 'Any terminal agent',
    connects: ['CLI'],
    options: [
      {
        title: 'CLI',
        description: 'Every command takes JSON flags and returns JSON, so agents can script it.',
        snippets: [
          { code: INSTALL_CLI },
          {
            code: [
              'unkey projects create --name=Demo --slug=demo \\',
              '  --no-input --json --error-format=json',
            ].join('\n'),
          },
        ],
      },
    ],
    tryPrompt:
      'List my Unkey projects as JSON and tell me which ones have no production deployment.',
    notes: [
      'Set UNKEY_OUTPUT=json so every command prints JSON.',
      '--no-input fails on a missing flag instead of prompting.',
      'The CLI runs on macOS and Linux.',
    ],
    guideHref: 'https://www.unkey.com/docs/platform/cli/overview',
  },
];

const setupFallback: IAgentSetupFallback = {
  text: 'Running headless or in CI? Send a root key in the Authorization: Bearer header instead.',
  link: {
    label: 'Use a root key',
    href: 'https://www.unkey.com/docs/platform/ai-coding/mcp-servers#use-a-root-key-instead',
  },
};

const stackParts: IAgentStackPart[] = [
  {
    id: 'cli',
    title: 'CLI',
    heading: 'The CLI gives it every command.',
    body: 'The whole Unkey API as unkey <resource> <action>, from keys and rate limits to projects and deployments. JSON in, JSON out, and no prompts when an agent runs it.',
    code: 'unkey keys verify --key=sk_1234abcdef --json',
    link: { label: 'CLI docs', href: 'https://www.unkey.com/docs/platform/cli/overview' },
  },
  {
    id: 'mcp',
    title: 'MCP',
    heading: 'MCP gives it the tools.',
    body: 'Two hosted servers whose tools are generated from the OpenAPI spec, so they always match the API. Unkey covers the v2 API. Compute covers projects, deployments, domains, and gateway policies. Sign in once in the browser.',
    code: [UNKEY_MCP_URL, COMPUTE_MCP_URL].join('\n'),
    link: { label: 'MCP docs', href: 'https://www.unkey.com/docs/platform/ai-coding/mcp-servers' },
  },
  {
    id: 'docs',
    title: 'Docs',
    heading: 'The docs are written for it to read.',
    body: 'llms.txt indexes every page. Add .md to any docs URL for the raw markdown. The API spec is served as OpenAPI JSON, and the docs have their own MCP server.',
    code: [
      'https://www.unkey.com/llms.txt',
      'https://www.unkey.com/docs/llms-full.txt',
      'https://api.unkey.com/openapi.json',
    ].join('\n'),
    link: { label: 'llms.txt', href: '/llms.txt' },
  },
  {
    id: 'unkey',
    title: 'Unkey',
    heading: 'Unkey is where it runs.',
    body: 'Deployments, the gateway, API keys, rate limits, and logs share one workspace, so your agent never stitches vendors together.',
    link: { label: 'See the platform', href: '/' },
  },
];

const controlItems: IAgentControlItem[] = [
  {
    title: 'It gets the permissions you pick',
    text: 'Sign-in opens Unkey in your browser. You choose the workspace and permissions, and you can only grant what your own role has.',
  },
  {
    title: 'Scope it to one project',
    text: 'Permissions can stop at a single project instead of the whole workspace.',
  },
  {
    title: 'Sessions expire on their own',
    text: 'Access tokens last 15 minutes and renew in the background. A session ends after 7 days unused, or 30 days after sign-in.',
  },
  {
    title: 'Revoke it any time',
    text: 'Every MCP and CLI session is listed under Settings > Sessions. Revoke one and that client loses access right away.',
  },
  {
    title: 'Risky actions ask first',
    text: 'Most MCP clients ask you to approve each tool call, and CLI delete commands confirm before they run.',
  },
  {
    title: 'Denied calls say what to do',
    text: 'When a call lacks a permission, the error names the permission and how to get it for that credential.',
  },
];

export const agentsContentData = {
  metadata: {
    title: 'Unkey for AI Coding Agents',
    description:
      "Connect Claude Code, Cursor, Codex, and other coding agents to Unkey's hosted MCP servers and CLI. Sign in with your Unkey account and choose exactly what your agent can do.",
  },
  hero,
  session: {
    label: 'In practice',
    heading: 'What a session looks like.',
    subheading: 'One conversation, from install to rollback.',
    steps: sessionSteps,
  },
  setup: {
    label: 'Setup',
    heading: 'Set up Unkey in your agent.',
    subheading: 'Pick your tool. Each one connects in a minute.',
    clients,
    fallback: setupFallback,
  },
  stack: {
    label: 'How it fits',
    heading: 'One platform, everything your agent needs.',
    parts: stackParts,
  },
  production: {
    label: 'To production',
    items: [
      {
        title: 'Every commit gets a preview',
        text: 'Your agent tests a change in its own environment, then promotes the exact version it tested.',
      },
      {
        title: 'Rollbacks are instant',
        text: 'The previous production instance stays running for 30 minutes, so a rollback switches back without redeploying.',
      },
      {
        title: 'Failures come with a reason',
        text: 'Build logs, runtime logs, and gateway requests are one query away, and crashes show a plain English reason.',
      },
    ],
  },
  control: {
    label: 'Control',
    heading: 'You decide what it can touch.',
    items: controlItems,
  },
  cta: {
    heading: 'Give your agent the keys.',
    subheading: 'Start for free and connect it in one command.',
  },
};
