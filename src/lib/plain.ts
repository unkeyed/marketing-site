import { PlainClient } from '@team-plain/typescript-sdk';

export type PlainSubmissionResult =
  | { status: 'error'; errors: string[] }
  | { status: 'success'; submitted: true };

export interface IPlainSubmission {
  email: string;
  fullName: string;
  threadTitle: string;
  threadBody: string;
  labelTypeIds?: string[];
}

export async function submitToPlain({
  email,
  fullName,
  threadTitle,
  threadBody,
  labelTypeIds,
}: IPlainSubmission): Promise<PlainSubmissionResult> {
  const apiKey = process.env.PLAIN_API_KEY;
  if (!apiKey) {
    return { status: 'error', errors: ['Invalid API configuration'] };
  }

  const client = new PlainClient({ apiKey });

  try {
    const upsertCustomerRes = await client.upsertCustomer({
      identifier: { emailAddress: email },
      onCreate: {
        fullName,
        email: { email, isVerified: true },
      },
      onUpdate: {},
    });

    if (upsertCustomerRes.error) {
      return { status: 'error', errors: [upsertCustomerRes.error.message] };
    }

    const threadInput = {
      customerIdentifier: { customerId: upsertCustomerRes.data.customer.id },
      title: threadTitle,
      components: [{ componentText: { text: threadBody } }],
    };
    const hasLabels = labelTypeIds !== undefined && labelTypeIds.length > 0;
    let createThreadRes = await client.createThread(
      hasLabels ? { ...threadInput, labelTypeIds } : threadInput,
    );

    // A bad or archived label id fails the whole mutation. Save the thread anyway.
    if (createThreadRes.error && hasLabels) {
      const code =
        createThreadRes.error.type === 'mutation_error'
          ? createThreadRes.error.errorDetails.code
          : createThreadRes.error.type;
      console.warn('Plain createThread label failed', code);
      createThreadRes = await client.createThread(threadInput);
    }

    if (createThreadRes.error) {
      return { status: 'error', errors: [createThreadRes.error.message] };
    }

    return { status: 'success', submitted: true };
  } catch (error) {
    console.error('Plain submission failed:', error);
    return {
      status: 'error',
      errors: ['An unexpected error occurred while processing your request'],
    };
  }
}
