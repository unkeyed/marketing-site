/**
 * All Things Open giveaway entry window.
 * Both instants are Eastern Daylight Time (UTC-4):
 * Monday, October 19, 2026 at 12:00am ET through Friday, October 23, 2026 at 11:59pm ET.
 */
export const GIVEAWAY_OPENS_AT = '2026-10-19T04:00:00.000Z';
export const GIVEAWAY_CLOSES_AT = '2026-10-24T03:59:59.000Z';

export const GIVEAWAY_OPENS_AT_MS = Date.parse(GIVEAWAY_OPENS_AT);
export const GIVEAWAY_CLOSES_AT_MS = Date.parse(GIVEAWAY_CLOSES_AT);

export const GIVEAWAY_WINDOW_COPY =
  'Entries open Monday, October 19, 2026 at 12:00am ET and close Friday, October 23, 2026 at 11:59pm ET.';

export const ENTRIES_NOT_YET_OPEN_MESSAGE = 'Entries open Oct 19 at 12:00am ET.';
export const ENTRIES_CLOSED_MESSAGE = 'Entries closed';

/** Dev/test only. Ignored when NODE_ENV is production, including Vercel. */
export const GIVEAWAY_NOW_COOKIE = 'giveaway_now';

export type TGiveawayWindowState = 'before' | 'open' | 'closed';

export function getGiveawayWindowState(nowMs: number): TGiveawayWindowState {
  if (nowMs < GIVEAWAY_OPENS_AT_MS) return 'before';
  if (nowMs > GIVEAWAY_CLOSES_AT_MS) return 'closed';
  return 'open';
}

export function giveawayWindowError(state: TGiveawayWindowState): string | null {
  if (state === 'before') return ENTRIES_NOT_YET_OPEN_MESSAGE;
  if (state === 'closed') return ENTRIES_CLOSED_MESSAGE;
  return null;
}

/**
 * A test clock (cookie or GIVEAWAY_NOW) is honored only outside production.
 * Production always uses the real clock, even if that cookie or env var is set.
 */
export function isGiveawayTestClockEnabled(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export function resolveGiveawayNow(cookieValue: string | undefined | null): number {
  if (isGiveawayTestClockEnabled()) {
    const candidate = cookieValue || process.env.GIVEAWAY_NOW;
    if (candidate) {
      const parsed = Date.parse(candidate);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return Date.now();
}
