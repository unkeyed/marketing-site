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

export async function submitGiveawayEntry(payload: unknown): Promise<PlainSubmissionResult> {
  const jar = await cookies();
  const now = resolveGiveawayNow(jar.get(GIVEAWAY_NOW_COOKIE)?.value);
  const windowError = giveawayWindowError(getGiveawayWindowState(now));
  if (windowError) {
    return { status: 'error', errors: [windowError] };
  }

  const parsed = giveawaySubmissionSchema.safeParse(payload);
  if (!parsed.success) {
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
    return { status: 'error', errors: [SUBMISSION_ERROR_MESSAGE] };
  }

  const elapsed = Date.now() - entry.startedAt;
  if (entry.startedAt > Date.now() + 60_000 || elapsed < MIN_SUBMIT_MS) {
    return { status: 'error', errors: [TOO_FAST_MESSAGE] };
  }

  // Awaited. A floating promise would be killed when this action returns.
  // Email runs before Plain so a missing PLAIN_API_KEY cannot skip Resend.
  const emailed = await sendGiveawayEmails({
    email: entry.email,
    name: entry.name,
    projectUrl: entry.projectUrl,
    workspaceId: entry.workspaceId,
    description: entry.description,
  });

  if (emailed.status !== 'success') {
    return emailed;
  }

  // Threads show up in Plain under this title. Filter on it to read entries.
  return submitToPlain({
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
}
