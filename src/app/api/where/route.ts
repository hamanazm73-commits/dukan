import { NextResponse } from "next/server";
import { nearestCity } from "@/lib/nearest-city";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Which of the twelve cities the visitor is nearest, without asking them.
 *
 * The browser's own location needs a permission, and a browser asks for that
 * permission exactly once: refuse it and it never asks that site again. For a
 * shop directory, spending that on a first visit is a poor trade.
 *
 * The network already knows roughly where a request came from, and Vercel
 * passes it along on every request — no permission, no prompt, nothing for
 * the visitor to decide. It is not precise: it locates the connection, not
 * the person, and on mobile data the connection can surface a city away. So
 * this is a starting guess and the city stays changeable; it is never
 * presented as a fact.
 */
export function GET(request: Request): NextResponse {
  const h = request.headers;
  const lat = Number(h.get("x-vercel-ip-latitude"));
  const lng = Number(h.get("x-vercel-ip-longitude"));

  // Outside Iraq the nearest of twelve Kurdish cities is meaningless — the
  // answer would be "Zakho" for someone in Berlin. Better to say nothing.
  const country = h.get("x-vercel-ip-country");
  if (country && country !== "IQ") {
    return NextResponse.json({ city: null, reason: "outside" });
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    // Running locally, or the header is absent.
    return NextResponse.json({ city: null, reason: "unknown" });
  }

  return NextResponse.json({
    city: nearestCity(lat, lng),
    // Named so the caller can say where the guess came from if it ever needs
    // to. The city itself is what matters.
    from: "network",
  });
}
