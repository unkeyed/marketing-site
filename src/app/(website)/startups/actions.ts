'use server';

import { submitToPlain, type PlainSubmissionResult } from '@/lib/plain';

export interface IStartupsFormPayload {
  fullName: string;
  email: string;
  workingWith: string;
  workspaceId?: string;
  migratingFrom?: string;
  moreInfo?: string;
}

export async function submitStartupsApplication(
  payload: IStartupsFormPayload,
): Promise<PlainSubmissionResult> {
  if (!payload.fullName || !payload.email || !payload.workingWith) {
    return { status: 'error', errors: ['All required fields must be filled in'] };
  }

  return submitToPlain({
    email: payload.email,
    fullName: payload.fullName,
    threadTitle: 'Contact form',
    threadBody: [
      `Working with: ${payload.workingWith}`,
      `Workspace ID: ${payload.workspaceId ?? ''}`,
      `Migrating From: ${payload.migratingFrom ?? ''}`,
      `More Info: ${payload.moreInfo ?? ''}`,
    ].join('\n'),
  });
}
