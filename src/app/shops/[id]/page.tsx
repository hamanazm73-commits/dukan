import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Phone, Store } from "lucide-react";
import { CATEGORIES, CITY_NAMES } from "@/lib/data";
import { getShop, listShops, nearbyShops } from "@/lib/shops-server";
import { hoursLabel, isOpenNow } from "@/lib/hours";
import { mediaSrc } from "@/lib/media";
import { BrandMark } from "@/components/brand-mark";
import { SITE_URL } from "@/app/layout";

/**
 * One shop, on a page of its own.
 *
 * Nothing on the site links here except a result someone searched for, and
 * that is deliberate — the front page is still one question with one box, and
 * there is no list to browse. This page exists for the two things a search
 * box cannot do:
 *
 *  - be sent to somebody. "Where do I buy this?" is answered with a link, not
 *    with "go to the site and search". On a phone in Kurdistan that link
 *    travels on WhatsApp, which is how anything travels here.
 *  - be found. A single search page is one page to a search engine however
 *    many shops are behind it; somebody looking for a chemist in Sulaymaniyah
 *    is looking for a page, and there was none to show them.
 *
 * Rendered on the server for the same reason: a crawler does not run the
 * search before deciding whether to keep the page.
 */

export const revalidate = 3600;

/** Built ahead of time for the shops that exist at build; anything added
    afterwards is rendered on first request and then cached. */
export async function generateStaticParams() {
  const shops = await listShops();
  return shops.map((s) => ({ id: s.id }));
}

function categoryOf(key: string) {
  return CATEGORIES.find((c) => c.key === key);
}

/** What this shop is, in one line — used as the description and on the page. */
function summary(name: string, category: string, city: string, tags?: string[]) {
  const known = tags?.length ? ` — ${tags.slice(0, 5).join("، ")}` : "";
  return `${name} — ${category} لە ${city}${known}. ژمارەی تەلەفۆن، ناونیشان و کاتی کردنەوە.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const shop = await getShop((await params).id);
  if (!shop) return { title: "دووکان نەدۆزرایەوە" };

  const name = shop.name.ku || shop.name.en || shop.name.ar || "";
  const city = CITY_NAMES[shop.city]?.ku ?? "";
  const cat = categoryOf(shop.category)?.label.ku ?? "";
  const title = `${name} — ${cat} لە ${city}`;
  const description = summary(name, cat, city, shop.tags);
  const url = `${SITE_URL}/shops/${shop.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      ...(shop.photo ? { images: [{ url: mediaSrc(shop.photo) }] } : {}),
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = await getShop(id);
  if (!shop) notFound();

  const name = shop.name.ku || shop.name.en || shop.name.ar || "";
  const city = CITY_NAMES[shop.city]?.ku ?? "";
  const cat = categoryOf(shop.category);
  const open = isOpenNow(shop.opensAt, shop.closesAt);
  const hours = hoursLabel(shop.opensAt, shop.closesAt);
  const tel = shop.phone.replace(/\s/g, "");
  const wa = shop.whatsapp?.replace(/\D/g, "");
  const near = await nearbyShops(shop.city, shop.id);

  /* A shop, as a search engine understands one. The address is only ever the
     city — the site never asks an owner for a street, and inventing one to
     fill a field would be worse than leaving it out. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/shops/${shop.id}`,
    name,
    url: `${SITE_URL}/shops/${shop.id}`,
    telephone: shop.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: "Kurdistan Region",
      addressCountry: "IQ",
    },
    ...(shop.photo ? { image: mediaSrc(shop.photo) } : {}),
    ...(shop.opensAt && shop.closesAt
      ? {
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            opens: shop.opensAt,
            closes: shop.closesAt,
          },
        }
      : {}),
    ...(shop.tags?.length ? { keywords: shop.tags.join(", ") } : {}),
  };

  const Icon = cat ? Store : Store;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-6 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Back to the one thing this site does. Not a navigation bar — there is
          nowhere else to go. */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-gold"
      >
        <BrandMark className="size-7" />
        گەڕانەوە بۆ گەڕان
      </Link>

      <article className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-card">
        {shop.photo ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaSrc(shop.photo)}
              alt={name}
              className="size-full object-cover"
            />
          </div>
        ) : (
          <div className="grid aspect-[16/7] w-full place-items-center bg-gold/10">
            <Icon className="size-14 text-gold/70" aria-hidden />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {cat && (
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold">
                {cat.label.ku}
              </span>
            )}
            {/* Only when it is known. A shop with no hours recorded must not
                be shown as closed — that is a lie about somebody's business. */}
            {open !== null && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  open
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {open ? "ئێستا کراوەیە" : "ئێستا داخراوە"}
              </span>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
            {name}
          </h1>

          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <MapPin className="size-4 text-gold" aria-hidden />
            {city}
            {shop.district?.ku && <span>· {shop.district.ku}</span>}
          </p>

          {hours && (
            <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 text-gold" aria-hidden />
              {hours}
            </p>
          )}

          {!!shop.tags?.length && (
            <div className="mt-5 flex flex-wrap gap-2">
              {shop.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Stacked under 640px: two labelled buttons side by side leave about
              150px each on a phone and the words break mid-word. */}
          <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
            <a
              href={`tel:${tel}`}
              className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3.5 text-sm font-bold text-gold-foreground transition-opacity hover:opacity-90"
            >
              <Phone className="size-4" aria-hidden />
              پەیوەندی بکە
            </a>
            {wa && (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                واتساپ
              </a>
            )}
            {shop.mapUrl && (
              <a
                href={shop.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-5 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 sm:col-span-2"
              >
                <MapPin className="size-4" aria-hidden />
                لە نەخشەدا پیشانی بدە
              </a>
            )}
          </div>

          <p dir="ltr" className="mt-4 text-center text-sm text-white/40">
            {shop.phone}
          </p>
        </div>
      </article>

      {near.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-bold text-white/60">
            دووکانی تر لە {city}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {near.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/shops/${s.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card p-3 transition-colors hover:border-gold/40"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold/10">
                    <Store className="size-5 text-gold/80" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {s.name.ku || s.name.en}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {categoryOf(s.category)?.label.ku}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
