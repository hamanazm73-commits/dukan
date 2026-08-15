import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

// The same pairing as the two sister sites: Jakarta for Latin, Naskh for
// Kurdish and Arabic. Half of what makes them read as one family.
const sans = Plus_Jakarta_Sans({ variable: "--font-sans", subsets: ["latin"] });
const arabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

const TITLE = "دووکان — هەر شتێک دەتەوێت، دووکانەکەی بدۆزەرەوە";
const DESCRIPTION =
  "مۆبایل، گوڵ، دەرمانخانە، چێشتخانە — بنووسە چیت دەوێت و دووکانەکەی لە هەولێر، سلێمانی، دهۆک و هەموو شارەکانی کوردستان بدۆزەرەوە.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "دووکان",
};

export const viewport: Viewport = { themeColor: "#0b1c2e" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ku" dir="rtl" className="dark" suppressHydrationWarning>
      <body className={`${sans.variable} ${arabic.variable} min-h-dvh`}>
        {children}
      </body>
    </html>
  );
}
