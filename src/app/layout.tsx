import type { Metadata, Viewport } from "next";
import {
  Aref_Ruqaa,
  Noto_Naskh_Arabic,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

// The same pairing as the two sister sites: Jakarta for Latin, Naskh for
// Kurdish and Arabic. Half of what makes them read as one family.
const sans = Plus_Jakarta_Sans({ variable: "--font-sans", subsets: ["latin"] });
const arabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

/**
 * The name only, never body text — the same face the parent site sets its own
 * name in, so the two read as one hand. Ruqaa is a written script: right for
 * a word, exhausting for a paragraph.
 */
const display = Aref_Ruqaa({
  variable: "--font-display",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const TITLE = "لای حەمە بیدۆزەوە — نووسین لە تۆ، گەڕان و دۆزینەوە لە ئێمە";
const DESCRIPTION =
  "مۆبایل، گوڵ، دەرمانخانە، چێشتخانە — بنووسە چیت دەوێت و دووکانەکەی لە هەولێر، سلێمانی، دهۆک و هەموو شارەکانی کوردستان بدۆزەرەوە.";

/**
 * Where this site lives.
 *
 * It is the third door off layhama.com, beside hotels. and homes., so it
 * needs to say so in its own right: on its own a subdomain looks like an
 * unrelated site, and the pair of statements — `subOrganization` on the hub,
 * `parentOrganization` here — is what lets a search engine treat them as one
 * business and surface whichever of them answers the question.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://shops.layhama.com"
).replace(/\/$/, "");

const HUB_URL = "https://layhama.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "لای حەمە بیدۆزەوە",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "لای حەمە بیدۆزەوە",
    title: TITLE,
    description: DESCRIPTION,
    locale: "ku_IQ",
  },
};

export const viewport: Viewport = { themeColor: "#0b1c2e" };

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "لای حەمە بیدۆزەوە",
  alternateName: ["Lay Hama Shops", "يم حمة للمحلات"],
  url: SITE_URL,
  description: DESCRIPTION,
  parentOrganization: { "@id": `${HUB_URL}/#organization` },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Kurdistan Region, Iraq",
  },
  address: { "@type": "PostalAddress", addressCountry: "IQ" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ku" dir="rtl" className="dark" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${arabic.variable} ${display.variable} min-h-dvh`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD),
          }}
        />
        {children}
      </body>
    </html>
  );
}
