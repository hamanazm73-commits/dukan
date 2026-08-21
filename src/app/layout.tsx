import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, dirOf, htmlLang, localeFromCookie } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/locale";
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
  process.env.NEXT_PUBLIC_SITE_URL || "https://bedozawa.layhama.com"
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
  alternateName: ["Find It at Lay Hama", "يم حمة تلاقيها"],
  url: SITE_URL,
  description: DESCRIPTION,
  parentOrganization: { "@id": `${HUB_URL}/#organization` },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Kurdistan Region, Iraq",
  },
  address: { "@type": "PostalAddress", addressCountry: "IQ" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* Read here rather than in the browser so the first paint is already in the
     right language and the right direction — a page that arrives Kurdish and
     turns English is worse than one that was slow. */
  const store = await cookies();
  const locale = localeFromCookie(store.get(LOCALE_COOKIE)?.value);

  return (
    <html
      lang={htmlLang(locale)}
      dir={dirOf(locale)}
      className="dark"
      suppressHydrationWarning
    >
      <body
        className={`${sans.variable} ${arabic.variable} ${display.variable} min-h-dvh`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD),
          }}
        />
        {/* The name Google prints where the address would otherwise go. It is
            read from the home page of each host, so this site has to declare
            its own — the parent declaring one does not cover the children. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: "لای حەمە بیدۆزەوە",
              alternateName: ["بازاڕی لای حەمە", "Lay Hama", "يم حمة"],
              url: SITE_URL,
              inLanguage: "ckb",
              publisher: { "@id": `${HUB_URL}/#organization` },
            }),
          }}
        />
        <LocaleProvider initial={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
