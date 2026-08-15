import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // /hq is the dashboard; nothing there belongs in an index.
    rules: { userAgent: "*", allow: "/", disallow: ["/hq"] },
  };
}
