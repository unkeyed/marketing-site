export interface IPlainTrace {
  customerId: string;
  upsertResult: string;
  threadId: string;
  threadStatus: string | null;
  threadStatusDetail: string | null;
  workspaceId: string | null;
}

export type PlainSubmissionResult =
  | { status: 'error'; errors: string[] }
  | { status: 'success'; submitted: true; trace: IPlainTrace };

export interface IPlainSubmission {
  email: string;
  fullName: string;
  threadTitle: string;
  threadBody: string;
}

const PLAIN_GRAPHQL_URL = 'https://core-api.uk.plain.com/graphql/v1';

const UPSERT_CUSTOMER_MUTATION = `
  mutation UpsertCustomer($input: UpsertCustomerInput!) {
    upsertCustomer(input: $input) {
      result
      customer { id }
      error { message code type fields { field message type } }
    }
  }
`;

const CREATE_THREAD_MUTATION = `
  mutation CreateThread($input: CreateThreadInput!) {
    createThread(input: $input) {
      thread {
        id
        status
        statusDetail { __typename }
      }
      error { message code type fields { field message type } }
    }
  }
`;

const MY_WORKSPACE_QUERY = `
  query MyWorkspace {
    myWorkspace { id name }
  }
`;

// Spam is a customer flag. There is no thread unspam mutation and createThread
// has no field that skips the check. Requires customer:edit.
const UNMARK_CUSTOMER_AS_SPAM_MUTATION = `
  mutation UnmarkCustomerAsSpam($input: UnmarkCustomerAsSpamInput!) {
    unmarkCustomerAsSpam(input: $input) {
      customer { id }
      error { message code type fields { field message type } }
    }
  }
`;

// Threads for a spam customer are created and then closed as ignored.
// Requires thread:edit and thread:read.
const MARK_THREAD_AS_TODO_MUTATION = `
  mutation MarkThreadAsTodo($input: MarkThreadAsTodoInput!) {
    markThreadAsTodo(input: $input) {
      thread {
        id
        status
        statusDetail { __typename }
      }
      error { message code type fields { field message type } }
    }
  }
`;

const NOT_SPAM_CODE = 'customer_is_not_marked_as_spam';

interface IPlainFieldError {
  field?: string;
  message?: string;
  type?: string;
}

interface IPlainMutationError {
  message?: string;
  code?: string;
  type?: string;
  fields?: IPlainFieldError[];
}

interface IPlainGraphqlError {
  message?: string;
  extensions?: { code?: string };
}

interface IPlainPayload {
  customer?: { id?: string | null } | null;
  thread?: {
    id?: string | null;
    status?: string | null;
    statusDetail?: { __typename?: string | null } | null;
  } | null;
  error?: IPlainMutationError | null;
  result?: string | null;
  id?: string | null;
  name?: string | null;
}

interface IPlainBody {
  data?: Record<string, IPlainPayload | null> | null;
  errors?: IPlainGraphqlError[];
}

const GENERIC_PLAIN_ERROR = 'An unexpected error occurred while processing your request';

function logPlainFailure(step: string, code: string, message: string) {
  console.error('Plain submission failed', step, code, message);
}

function plainErrorText(code: string, message: string): string {
  return `${code}: ${message}`;
}

async function plainGraphql(
  apiKey: string,
  step: string,
  query: string,
  variables: Record<string, unknown>,
  benignErrorCodes: readonly string[] = [],
): Promise<
  { ok: true; payload: IPlainPayload } | { ok: false; benign: boolean; errors: string[] }
> {
  let response: Response;
  try {
    response = await fetch(PLAIN_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'fetch failed';
    logPlainFailure(step, 'network', message);
    return { ok: false, benign: false, errors: [GENERIC_PLAIN_ERROR] };
  }

  let body: IPlainBody;
  try {
    body = (await response.json()) as IPlainBody;
  } catch {
    logPlainFailure(step, String(response.status), 'Invalid JSON from Plain');
    return { ok: false, benign: false, errors: [GENERIC_PLAIN_ERROR] };
  }

  if (!response.ok || (body.errors && body.errors.length > 0)) {
    const graphqlErrors =
      body.errors && body.errors.length > 0
        ? body.errors.map((error) => ({
            code: error.extensions?.code ?? String(response.status),
            message: error.message ?? 'Plain request failed',
          }))
        : [{ code: String(response.status), message: 'Plain request failed' }];

    const benign = graphqlErrors.every((error) => benignErrorCodes.includes(error.code));
    if (!benign) {
      for (const error of graphqlErrors) {
        if (!benignErrorCodes.includes(error.code)) {
          logPlainFailure(step, error.code, error.message);
        }
      }
    }

    return {
      ok: false,
      benign,
      errors: graphqlErrors.map((error) => plainErrorText(error.code, error.message)),
    };
  }

  const payload = body.data?.[step];
  const mutationError = payload?.error;
  if (mutationError) {
    const code = mutationError.code || mutationError.type || 'mutation_error';
    const message = mutationError.message || 'Plain mutation failed';
    const fieldNote = mutationError.fields
      ?.map((field) => `${field.field ?? 'field'}: ${field.message ?? ''}`)
      .filter(Boolean)
      .join('; ');
    const fullMessage = fieldNote ? `${message} (${fieldNote})` : message;
    const benign = benignErrorCodes.includes(code);
    if (!benign) {
      logPlainFailure(step, code, fullMessage);
    }
    return { ok: false, benign, errors: [plainErrorText(code, fullMessage)] };
  }

  if (!payload) {
    logPlainFailure(step, 'missing_payload', 'Plain returned no mutation payload');
    return { ok: false, benign: false, errors: [GENERIC_PLAIN_ERROR] };
  }

  return { ok: true, payload };
}

export async function submitToPlain({
  email,
  fullName,
  threadTitle,
  threadBody,
}: IPlainSubmission): Promise<PlainSubmissionResult> {
  const apiKey = process.env.PLAIN_API_KEY;
  if (!apiKey) {
    logPlainFailure('config', 'missing_key', 'PLAIN_API_KEY is not set');
    return { status: 'error', errors: ['Invalid API configuration'] };
  }

  try {
    const upsert = await plainGraphql(apiKey, 'upsertCustomer', UPSERT_CUSTOMER_MUTATION, {
      input: {
        identifier: { emailAddress: email },
        onCreate: {
          fullName,
          email: { email, isVerified: true },
        },
        onUpdate: {},
      },
    });
    if (!upsert.ok) {
      return { status: 'error', errors: upsert.errors };
    }

    const customerId = upsert.payload.customer?.id;
    if (!customerId) {
      logPlainFailure('upsertCustomer', 'missing_customer', 'Plain did not return a customer id');
      return { status: 'error', errors: [GENERIC_PLAIN_ERROR] };
    }

    const created = await plainGraphql(apiKey, 'createThread', CREATE_THREAD_MUTATION, {
      input: {
        customerIdentifier: { customerId },
        title: threadTitle,
        components: [{ componentText: { text: threadBody } }],
      },
    });
    if (!created.ok) {
      return { status: 'error', errors: created.errors };
    }

    const threadId = created.payload.thread?.id;
    if (!threadId) {
      logPlainFailure('createThread', 'missing_thread', 'Plain did not return a thread id');
      return { status: 'error', errors: [GENERIC_PLAIN_ERROR] };
    }

    let threadStatus = created.payload.thread?.status ?? null;
    let threadStatusDetail = created.payload.thread?.statusDetail?.__typename ?? null;

    // Clearing the flag does not fail the entry: the thread already exists.
    // customer_is_not_marked_as_spam means the customer was never flagged.
    const unmarked = await plainGraphql(
      apiKey,
      'unmarkCustomerAsSpam',
      UNMARK_CUSTOMER_AS_SPAM_MUTATION,
      { input: { customerId } },
      [NOT_SPAM_CODE],
    );

    const wasSpam = unmarked.ok;
    const hiddenAsIgnored =
      threadStatus === 'DONE' || threadStatusDetail === 'ThreadStatusDetailIgnored';
    if (wasSpam && hiddenAsIgnored) {
      const reopened = await plainGraphql(
        apiKey,
        'markThreadAsTodo',
        MARK_THREAD_AS_TODO_MUTATION,
        {
          input: { threadId },
        },
      );
      if (reopened.ok) {
        threadStatus = reopened.payload.thread?.status ?? threadStatus;
        threadStatusDetail =
          reopened.payload.thread?.statusDetail?.__typename ?? threadStatusDetail;
      }
    }

    const workspace = await plainGraphql(apiKey, 'myWorkspace', MY_WORKSPACE_QUERY, {});
    const workspaceId = workspace.ok ? (workspace.payload.id ?? null) : null;

    return {
      status: 'success',
      submitted: true,
      trace: {
        customerId,
        upsertResult: upsert.payload.result ?? 'unknown',
        threadId,
        threadStatus,
        threadStatusDetail,
        workspaceId,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logPlainFailure('unexpected', 'unknown', message);
    return { status: 'error', errors: [GENERIC_PLAIN_ERROR] };
  }
}
