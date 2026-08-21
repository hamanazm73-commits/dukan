import { NextResponse } from "next/server";
import { listShops } from "@/lib/shops-server";

/**
 * The shop list, read once and given to everyone.
 *
 * Every visitor used to read the whole collection out of Firestore from their
 * own browser. Firestore's free tier allows 50,000 document reads a day and
 * one visitor costs one read per shop, so the site's capacity fell as its
 * content grew: 100 shops meant 500 visitors a day, 500 shops meant 100. The
 * busier it got, the sooner it stopped answering.
 *
 * `listShops` is already cached for an hour, so the collection is read once
 * an hour however many people are searching. What each visitor now costs is
 * one request to this site, which is free.
 *
 * The dashboard still reads Firestore directly. Somebody who has just saved
 * a shop needs to see it, and there are two of them, not two thousand.
 */
export const revalidate = 3600;

export async function GET(): Promise<NextResponse> {
  const shops = await listShops();
  return NextResponse.json(
    { shops },
    {
      headers: {
        // A minute at the edge, and a day of serving the old list while the
        // new one is fetched behind it — nobody waits for a revalidation.
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=86400",
      },
    },
  );
}
