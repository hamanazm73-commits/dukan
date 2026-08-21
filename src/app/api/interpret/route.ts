import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { CATEGORIES } from "@/lib/data";

/**
 * The last resort, when the word list has run out.
 *
 * `data.ts` carries every spelling of every trade anyone is likely to type,
 * and it answers instantly, offline, for free. This route exists only for the
 * queries it does not carry: a brand nobody listed, a thing said a way nobody
 * anticipated, a sentence rather than a word.
 *
 * So it is asked **only after the local search has returned nothing**, and it
 * is asked one narrow question — which of the sixteen trades, if any. It never
 * invents a shop, never sees the database, and cannot put anything on the page
 * that is not already in it: it returns a category key, the client re-runs its
 * own search with that, and the answer is still drawn from Firestore.
 *
 * When it answers well, the right fix is still to add the word to `data.ts`.
 * A term added there is answered instantly by everyone for ever after; a term
 * answered here costs a round trip and a fraction of a cent every time.
 */

const KEYS = CATEGORIES.map((c) => c.key);

const Interpretation = z.object({
  category: z
    .enum(KEYS as [string, ...string[]])
    .nullable()
    .describe("The trade that sells this, or null if no trade here sells it."),
  terms: z
    .array(z.string())
    .max(6)
    .describe(
      "Up to six words a Kurdish shopper might type for this, Sorani first. Empty if category is null.",
    ),
});

const SYSTEM = `You map a shopper's words to one trade in a Kurdish shop directory.

The trades, by key:
${CATEGORIES.map((c) => `- ${c.key}: ${c.label.ku} / ${c.label.en}`).join("\n")}

The shopper writes in Kurdish Sorani, Arabic, or English, often misspelled,
often naming a thing rather than a trade — "ئایفۆن" means the mobile trade,
"گوڵی سوور" means the florist, "دەرمانی سەرئێشە" means the pharmacy.

Pick the trade that would actually sell the thing. If none of these trades
would, return null rather than the closest one — a wrong shop is worse than
an honest empty result.`;

/** One instance per warm lambda; the SDK reads ANTHROPIC_API_KEY itself. */
let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

/**
 * A crude ceiling, per warm instance.
 *
 * The route is public and every call costs money, so a loop pointed at it has
 * to hit something. This resets whenever the instance does and is not shared
 * between them, which makes it a speed bump rather than a wall — enough for
 * the traffic this site has, and worth replacing the day it isn't.
 */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;

function overLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  if (HITS.size > 500) {
    for (const [k, v] of HITS) if (v.every((t) => now - t >= WINDOW_MS)) HITS.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const anthropic = getClient();
  // Nothing configured is not an error. The site worked before this route
  // existed and has to keep working without it.
  if (!anthropic) {
    return NextResponse.json({ category: null, terms: [], reason: "not-configured" });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (overLimit(ip)) {
    return NextResponse.json({ error: "too-many" }, { status: 429 });
  }

  let q: unknown;
  try {
    ({ q } = (await req.json()) as { q?: unknown });
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  if (typeof q !== "string") {
    return NextResponse.json({ error: "bad-query" }, { status: 400 });
  }
  const query = q.trim().slice(0, 120);
  if (query.length < 2) {
    return NextResponse.json({ category: null, terms: [] });
  }

  try {
    const response = await anthropic.messages.parse({
      model: "claude-opus-5",
      max_tokens: 1024,
      // Low effort on purpose: this is a one-word classification against a
      // list of sixteen, and the shopper is waiting with the keyboard open.
      output_config: {
        effort: "low",
        format: zodOutputFormat(Interpretation),
      },
      system: SYSTEM,
      messages: [{ role: "user", content: query }],
    });

    const parsed = response.parsed_output;
    if (!parsed) {
      // "No structured answer came back" and "the model looked and found no
      // trade that sells this" are the same empty result to whoever is
      // searching, and they were the same silence here too — which made the
      // first impossible to tell from the second while it was happening.
      // Only the reason is added; the answer itself is unchanged.
      console.error("[interpret] no parsed output, stop:", response.stop_reason);
      return NextResponse.json({
        category: null,
        terms: [],
        reason: "unparsed",
      });
    }
    return NextResponse.json({
      category: parsed.category,
      terms: parsed.terms ?? [],
    });
  } catch (err) {
    // A failure here must read as "found nothing", never as a broken site.
    console.error("[interpret] failed:", err);
    return NextResponse.json({ category: null, terms: [], reason: "failed" });
  }
}
