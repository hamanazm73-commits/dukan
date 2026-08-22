import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * The headers the other three sites have had all along.
 *
 * This one had none — no policy, no frame refusal, no nosniff, no referrer
 * rule — while hotels, homes and the doorway all carried the full set. Nothing
 * chose that; it is the site that was written last and the config was never
 * filled in.
 *
 * The policy is drawn from what the site actually talks to rather than copied
 * from a sister: Firebase for the dashboard sign-in and the shop records,
 * Unsplash for the one photograph behind the search, and nothing else.
 * `frame-src` is absent because this site embeds nothing — no map, no video,
 * no widget — so there is no frame to allow.
 *
 * `'unsafe-eval'` is dev only, where Turbopack needs it. `'unsafe-inline'` for
 * scripts stays: Next inlines its own bootstrap, and removing it means
 * threading a nonce through the document — a change to make deliberately
 * rather than in a security pass.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // The hero photograph is hotlinked; shop pictures come back through
  // /api/img on this origin.
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self' data:",
  // identitytoolkit signs the dashboard in, firestore holds the shops.
  "connect-src 'self' https://*.googleapis.com wss://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Nobody puts this site in a frame, including this site.
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    // A bare max-age was already being sent. The other two halves are what
    // make it cover bedozawa. alongside layhama.com, and what lets it preload.
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // The search offers "near me", so geolocation stays open to this origin.
    // Nothing here wants a camera, a microphone or a card.
    value: "camera=(), microphone=(), geolocation=(self), payment=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
