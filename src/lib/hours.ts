/**
 * Whether a shop is open at this moment.
 *
 * Computed in Baghdad time rather than the reader's own. Almost everyone
 * looking at this site is in Iraq, but the few who are not — someone abroad
 * ringing home about a repair — should still be told whether the shop is
 * open *there*, which is the only fact that matters.
 *
 * Iraq keeps UTC+3 all year and has done since 2015, so there is no daylight
 * saving to chase.
 */

/** Minutes since midnight for "HH:MM", or null if it is not that shape. */
function toMinutes(hhmm: string | undefined): number | null {
  if (!hhmm) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** Minutes since midnight, right now, in Baghdad. */
function nowInBaghdad(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Baghdad",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return h * 60 + m;
}

/**
 * `null` when the shop has not said — which must read as "we don't know",
 * never as "closed". A shop wrongly shown as shut loses the visit.
 */
export function isOpenNow(
  opensAt?: string,
  closesAt?: string,
): boolean | null {
  const open = toMinutes(opensAt);
  const close = toMinutes(closesAt);
  if (open === null || close === null) return null;

  const now = nowInBaghdad();
  // A closing time earlier than the opening one runs past midnight: a
  // restaurant open 18:00–02:00 is open at one in the morning.
  return close > open ? now >= open && now < close : now >= open || now < close;
}

/** "٩:٠٠ ← ٢٢:٠٠", or empty when the shop has not said. */
export function hoursLabel(opensAt?: string, closesAt?: string): string {
  if (toMinutes(opensAt) === null || toMinutes(closesAt) === null) return "";
  return `${opensAt} ← ${closesAt}`;
}
