import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

export default function robots(): MetadataRoute.Robots {
  return {
    // /hq is the dashboard; nothing there belongs in an index.
    rules: { userAgent: "*", allow: "/", disallow: ["/hq"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
