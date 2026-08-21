import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";
import { listShops } from "@/lib/shops-server";

/**
 * The search page, and a page for every shop.
 *
 * This used to be one line with a note saying every answer lived behind the
 * same address, so listing a shop would promise a page that did not exist.
 * The pages exist now: nothing on the site links to them except a result
 * somebody searched for, but each one is a real address that can be sent to a
 * friend and found from outside.
 *
 * Which is what a directory is for. A single search page is one page to a
 * search engine however many shops are behind it, and somebody looking for a
 * chemist in Sulaymaniyah is looking for a page.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shops = await listShops();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...shops.map((s) => ({
      url: `${SITE_URL}/shops/${s.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
