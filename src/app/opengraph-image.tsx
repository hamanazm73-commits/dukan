import { ImageResponse } from "next/og";

export const alt = "Find It at Lay Hama — every shop in Kurdistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The picture that appears when somebody shares this site.
 *
 * There was none, so a link pasted into WhatsApp — which is where nearly all
 * of this business actually happens — arrived as a bare line of text, while
 * the homes site and the doorway both showed a card.
 *
 * Latin text only: Satori draws none of the Arabic script without a font file
 * bundled alongside it, and a preview card is not the place to carry the
 * weight of one. The sister sites made the same call for the same reason.
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "white",
          fontFamily: "sans-serif",
          // The navy this site opens on, so the card and the page a reader
          // lands on are recognisably the same place.
          background:
            "linear-gradient(135deg, #0b1424 0%, #14243c 55%, #1e3450 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "90px",
              height: "90px",
              borderRadius: "22px",
              background: "rgba(255,255,255,0.16)",
            }}
          >
            {/* A shopfront: awning, counter, doorway — the mark the site uses */}
            <svg
              width="52"
              height="52"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e7ba54"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l1.5-5h15L21 9" />
              <path d="M3 9h18" />
              <path d="M5 9v11h14V9" />
              <path d="M10 20v-6h4v6" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: "42px", fontWeight: 700 }}>
            Find It at Lay Hama
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "44px",
            fontSize: "70px",
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: "960px",
          }}
        >
          You type it, we find the shop
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: "34px",
            opacity: 0.9,
          }}
        >
          Phones · Pharmacies · Flowers · Food — across Kurdistan
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "46px",
            fontSize: "28px",
            opacity: 0.85,
          }}
        >
          bedozawa.layhama.com
        </div>
      </div>
    ),
    { ...size },
  );
}
