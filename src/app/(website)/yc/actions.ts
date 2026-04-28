'use server';

import { submitToPlain, type PlainSubmissionResult } from '@/lib/plain';

export interface IYcFormPayload {
  fullName: string;
  email: string;
  ycBatch: string;
  workspaceId?: string;
  migratingFrom?: string;
  moreInfo?: string;
}

export async function submitYcApplication(
  payload: IYcFormPayload,
): Promise<PlainSubmissionResult> {
  if (!payload.fullName || !payload.email || !payload.ycBatch) {
    return { status: 'error', errors: ['All required fields must be filled in'] };
  }

  return submitToPlain({
    email: payload.email,
    fullName: payload.fullName,
    threadTitle: 'Contact form',
    threadBody: [
      `YC Batch: ${payload.ycBatch}`,
      `Workspace ID: ${payload.workspaceId ?? ''}`,
      `Migrating From: ${payload.migratingFrom ?? ''}`,
      `More Info: ${payload.moreInfo ?? ''}`,
    ].join('\n'),
  });
}
