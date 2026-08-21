import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

/**
 * One page, and that is the whole site.
 *
 * Every answer lives behind the same address — the search runs in the
 * visitor's browser and nothing it finds has a URL of its own. Listing a shop
 * here would mean promising a page that does not exist.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
