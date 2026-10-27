import { z } from 'zod';

/**
 * Unambiguous alphabet from @unkey/id (no 0, O, I, or l).
 * Current dashboard IDs: `newId("workspace")` in
 * unkeyed/unkey `web/internal/id/src/generate.ts` returns `ws_` + nanoid(12).
 * Workspace create calls it from
 * `web/apps/dashboard/lib/trpc/routers/workspace/create.ts`.
 * 16 characters is the earlier generator documented in
 * `src/content/blog/uuid-ux.mdx`. Those workspace IDs are still valid.
 */
const WORKSPACE_ID_BODY = '[1-9A-HJ-NP-Za-km-z]';

export const WORKSPACE_ID_PATTERN = new RegExp(
  `^ws_${WORKSPACE_ID_BODY}{12}$|^ws_${WORKSPACE_ID_BODY}{16}$`,
);

export const DESCRIPTION_MIN = 20;
export const DESCRIPTION_MAX = 500;

/** Ignore submits that happen faster than this after the form mounts. */
export const MIN_SUBMIT_MS = 3_000;

export const WORKSPACE_ID_MESSAGE = "That doesn't look like a workspace ID.";
export const TOO_FAST_MESSAGE = 'Give it a second, then try again.';
export const SUBMISSION_ERROR_MESSAGE = 'Could not submit that. Please try again.';

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const giveawayFieldsSchema = z.object({
  projectUrl: z
    .string({ error: 'Enter the URL of your deployed project.' })
    .trim()
    .min(1, 'Enter the URL of your deployed project.')
    .max(2_000, 'That URL is too long.')
    .refine(isHttpUrl, 'Enter a valid http or https URL.'),
  workspaceId: z
    .string({ error: WORKSPACE_ID_MESSAGE })
    .trim()
    .regex(WORKSPACE_ID_PATTERN, WORKSPACE_ID_MESSAGE),
  description: z
    .string({ error: `Say what it does in at least ${DESCRIPTION_MIN} characters.` })
    .trim()
    .min(DESCRIPTION_MIN, `Say what it does in at least ${DESCRIPTION_MIN} characters.`)
    .max(DESCRIPTION_MAX, `Keep it to ${DESCRIPTION_MAX} characters.`),
  name: z
    .string({ error: 'Enter your name.' })
    .trim()
    .min(2, 'Enter your name.')
    .max(80, 'That name is too long.'),
  email: z
    .string({ error: 'Enter a valid email.' })
    .trim()
    .min(1, 'Enter a valid email.')
    .email('Enter a valid email.')
    .max(254, 'That email is too long.'),
});

export const giveawaySubmissionSchema = giveawayFieldsSchema.extend({
  companyWebsite: z.string().optional().default(''),
  startedAt: z.number({ error: SUBMISSION_ERROR_MESSAGE }),
});

export type TGiveawayFormValues = z.infer<typeof giveawayFieldsSchema>;
export type TGiveawaySubmission = z.infer<typeof giveawaySubmissionSchema>;
