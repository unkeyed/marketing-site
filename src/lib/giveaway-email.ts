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

interface IResendMessage {
  to: string;
  subject: string;
  text: string;
}

async function sendResendEmail(apiKey: string, message: IResendMessage): Promise<void> {
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
    const detail = await response.text();
    throw new Error(detail || `HTTP ${response.status}`);
  }
}

/**
 * Team notice and entrant confirmation. Failures are logged and do not
 * affect the stored entry. The caller awaits this before it returns.
 */
export async function sendGiveawayEmails(entry: IGiveawayEmailEntry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Giveaway email skipped: RESEND_API_KEY is not set');
    return;
  }

  const notify = process.env.GIVEAWAY_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;
  const details = [
    `Name: ${entry.name}`,
    `Email: ${entry.email}`,
    `Project URL: ${entry.projectUrl}`,
    `Workspace ID: ${entry.workspaceId}`,
    `What it does: ${entry.description}`,
  ].join('\n');

  const messages: IResendMessage[] = [
    {
      to: notify,
      subject: 'All Things Open giveaway entry',
      text: `New giveaway entry.\n\n${details}\n`,
    },
    {
      to: entry.email,
      subject: "You're entered in the All Things Open giveaway",
      text: [
        `Thanks ${entry.name}. We got your project.`,
        '',
        'If you win, we will email this address.',
        'Entries close Friday, October 23, 2026 at 11:59pm ET.',
        '',
      ].join('\n'),
    },
  ];

  const results = await Promise.allSettled(
    messages.map((message) => sendResendEmail(apiKey, message)),
  );

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error('Giveaway email failed', messages[index].to, result.reason);
    }
  });
}
