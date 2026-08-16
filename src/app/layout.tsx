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

const TITLE = "بازاڕی لای حەمە — بینووسە، بیدۆزەرەوە";
const DESCRIPTION =
  "مۆبایل، گوڵ، دەرمانخانە، چێشتخانە — بنووسە چیت دەوێت و دووکانەکەی لە هەولێر، سلێمانی، دهۆک و هەموو شارەکانی کوردستان بدۆزەرەوە.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "بازاڕی لای حەمە",
};

export const viewport: Viewport = { themeColor: "#0b1c2e" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ku" dir="rtl" className="dark" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${arabic.variable} ${display.variable} min-h-dvh`}
      >
        {children}
      </body>
    </html>
  );
}
