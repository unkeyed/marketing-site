'use server';

import { cookies } from 'next/headers';

import { sendGiveawayEmails } from '@/lib/giveaway-email';
import {
  getGiveawayWindowState,
  GIVEAWAY_NOW_COOKIE,
  giveawayWindowError,
  resolveGiveawayNow,
} from '@/lib/giveaway-window';
import { submitToPlain, type PlainSubmissionResult } from '@/lib/plain';

import {
  giveawaySubmissionSchema,
  MIN_SUBMIT_MS,
  SUBMISSION_ERROR_MESSAGE,
  TOO_FAST_MESSAGE,
} from './schema';

function emailDomain(payload: unknown): string {
  if (typeof payload !== 'object' || payload === null || !('email' in payload)) {
    return 'unknown';
  }
  const email = payload.email;
  if (typeof email !== 'string') {
    return 'unknown';
  }
  const at = email.lastIndexOf('@');
  if (at < 1 || at === email.length - 1) {
    return 'invalid';
  }
  return email.slice(at + 1).toLowerCase();
}

export async function submitGiveawayEntry(payload: unknown): Promise<PlainSubmissionResult> {
  const domain = emailDomain(payload);
  const jar = await cookies();
  const now = resolveGiveawayNow(jar.get(GIVEAWAY_NOW_COOKIE)?.value);
  const windowState = getGiveawayWindowState(now);
  const windowError = giveawayWindowError(windowState);
  if (windowError) {
    console.warn('Giveaway entry rejected', { check: 'window', state: windowState, domain });
    return { status: 'error', errors: [windowError] };
  }

  const parsed = giveawaySubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    console.warn('Giveaway entry rejected', { check: 'schema', domain });
    const errors = [...new Set(parsed.error.issues.map((issue) => issue.message))];
    return {
      status: 'error',
      errors: errors.length > 0 ? errors : [SUBMISSION_ERROR_MESSAGE],
    };
  }

  const entry = parsed.data;

  // Honeypot. Humans never see this field. Same message as a generic failure
  // so the check is not spelled out in the response.
  if (entry.companyWebsite.trim() !== '') {
    console.warn('Giveaway entry rejected', { check: 'honeypot', domain });
    return { status: 'error', errors: [SUBMISSION_ERROR_MESSAGE] };
  }

  const elapsed = Date.now() - entry.startedAt;
  if (entry.startedAt > Date.now() + 60_000 || elapsed < MIN_SUBMIT_MS) {
    console.warn('Giveaway entry rejected', {
      check: entry.startedAt > Date.now() + 60_000 ? 'started_at_future' : 'too_fast',
      domain,
      elapsedMs: elapsed,
    });
    return { status: 'error', errors: [TOO_FAST_MESSAGE] };
  }

  // Threads show up in Plain under this title. Filter on it to read entries.
  const stored = await submitToPlain({
    email: entry.email,
    fullName: entry.name,
    threadTitle: 'All Things Open giveaway',
    threadBody: [
      `Project URL: ${entry.projectUrl}`,
      `Workspace ID: ${entry.workspaceId}`,
      `What it does: ${entry.description}`,
      `Name: ${entry.name}`,
      `Email: ${entry.email}`,
    ].join('\n'),
  });

  if (stored.status !== 'success') {
    return stored;
  }

  // Awaited so the serverless function does not return before the sends finish.
  // A mail failure does not undo the stored entry.
  await sendGiveawayEmails({
    email: entry.email,
    name: entry.name,
    projectUrl: entry.projectUrl,
    workspaceId: entry.workspaceId,
    description: entry.description,
  });

  return stored;
}
