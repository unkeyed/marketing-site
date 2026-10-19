import type { PlainSubmissionResult } from '@/lib/plain';

const RESEND_EMAILS_URL = 'https://api.resend.com/emails';

/** Verified sender on the Unkey Resend account. */
const GIVEAWAY_FROM = 'Unkey <james@updates.unkey.com>';

const DEFAULT_NOTIFY_EMAIL = 'support@unkey.com';

export interface IGiveawayEmailEntry {
  email: string;
  name: string;
  projectUrl: string;
  workspaceId: string;
  description: string;
}

async function sendResendEmail(
  apiKey: string,
  message: { to: string; subject: string; text: string },
): Promise<boolean> {
  const response = await fetch(RESEND_EMAILS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: GIVEAWAY_FROM,
      to: [message.to],
      subject: message.subject,
      text: message.text,
    }),
  });

  if (!response.ok) {
    console.error('Giveaway email failed', response.status);
    return false;
  }

  return true;
}

/**
 * Awaited Resend sends. One goes to the entrant, one to the team inbox.
 * Nothing here is fire-and-forget: the caller waits before it returns success.
 */
export async function sendGiveawayEmails(
  entry: IGiveawayEmailEntry,
): Promise<PlainSubmissionResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Giveaway email skipped: RESEND_API_KEY is not set');
    return { status: 'error', errors: ['Invalid API configuration'] };
  }

  const notify = process.env.GIVEAWAY_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;
  const details = [
    `Name: ${entry.name}`,
    `Email: ${entry.email}`,
    `Project URL: ${entry.projectUrl}`,
    `Workspace ID: ${entry.workspaceId}`,
    `What it does: ${entry.description}`,
  ].join('\n');

  try {
    const sent = await Promise.all([
      sendResendEmail(apiKey, {
        to: notify,
        subject: 'All Things Open giveaway entry',
        text: `New giveaway entry.\n\n${details}\n`,
      }),
      sendResendEmail(apiKey, {
        to: entry.email,
        subject: "You're entered in the All Things Open giveaway",
        text: [
          `Thanks ${entry.name}. We got your project.`,
          '',
          'If you win, we will email this address.',
          'Entries close Friday, October 23, 2026 at 11:59pm ET.',
          '',
        ].join('\n'),
      }),
    ]);

    if (sent.some((ok) => !ok)) {
      return { status: 'error', errors: ['Could not submit that. Please try again.'] };
    }

    return { status: 'success', submitted: true };
  } catch (error) {
    console.error('Giveaway email failed:', error);
    return { status: 'error', errors: ['Could not submit that. Please try again.'] };
  }
}
