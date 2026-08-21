# TEAM-LOG — who is doing what

Two people work on this repo through Claude, from different machines. This file
is how the two sides avoid building the same thing twice.

The rules are in `AGENTS.md`. In short: pull, read this file, push your claim
**before** starting, then mark it done when the code is pushed.

Newest entry at the top.

---

## 2026-08-21 04:08 — hamakali2005 · done

The third door is **bedozawa.layhama.com**, not shops. — the address now says
what the site is called. Changed on both sides: the hub entry, the OG card and
the organisation data here, the default SITE_URL and .env.local there.

## 2026-08-21 04:00 — hamakali2005 · done

Prepared for **shops.layhama.com**: metadataBase, a canonical, OpenGraph, a
sitemap, robots pointing at it, and Organization JSON-LD naming layhama.com as
parentOrganization — the other half of the subOrganization the hub now
declares. NEXT_PUBLIC_SITE_URL is set locally; **Vercel needs it too**, along
with the domain itself and the DNS record.

## 2026-08-21 03:49 — hamakali2005 · done

Site renamed to **لای حەمە بیدۆزەوە** — heading, document title and
applicationName. Also killed the second cross in the search field: type="search"
earns the input Chrome's own clear button, which sat beside ours. Ours is the
one kept, since it is styled with the field, labelled سڕینەوە, and puts the
cursor back in the box.

## 2026-08-21 03:46 — hamakali2005 · done

Typography brought onto the hotels site's base layer: Naskh leads for Kurdish
now that the page is always RTL, text-size-adjust pinned so a phone cannot
re-inflate the type, every field held at 16px under 768px so iOS Safari stops
zooming on focus, body text unselectable while anything typed stays selectable,
and the ring colour on focus outlines. Shop photographs use the same img-fade,
so a picture landing after its card eases in instead of snapping.

## 2026-08-21 03:40 — hamakali2005 · done

Results are laid out like the hotels site: max-w-7xl page, `grid gap-6
sm:grid-cols-2 lg:grid-cols-3`. Three cards abreast at 1265px, one at 375px,
nothing off-screen either way. The mark and the search field keep their own
2xl column down the middle — a search box stretched across a desktop is a
worse box. Palette, radius and fonts already matched; the width and the grid
were the whole difference.

## 2026-08-21 03:36 — hamakali2005 · done

Shop cards rebuilt to the hotels site's card: rounded-2xl on a ring that turns
gold on hover, the lift and shadow, a 3:2 cover that scales slightly under the
cursor, a dark gradient over it, and the trade and open/closed pills floating
on the photograph instead of taking lines away from the name. Body is p-5 with
a gap-3 stack, matching the hotel card's rhythm.

## 2026-08-21 03:31 — hamakali2005 · done

Shop photographs are 3:2 now, the same ratio the hotels site uses. The
full-height version dwarfed the name and phone number under it and left every
card a different height. 341x227 in a 343px card — 56% of it, against most of
it before.

## 2026-08-21 03:28 — hamakali2005 · done

**Photographs fill the card's width now.** The height cap added earlier failed
on a wide screen for the same reason a crop fails on a narrow one: at 640px
across, a near-square photo hit the cap and sat in the middle with a bar of
empty panel down each side. No cap at all now — full width, height following
the picture's own proportions.

Measured: 638x581 in a 638px card and 341x311 in a 341px one, both at the
photo's exact ratio, no side bars, nothing off-screen at 375px.

The trade this makes: cards no longer match each other in height, unlike the
hotels site, which crops to aspect-[3/2] so every card reads the same weight.
That uniformity and never cutting a photograph cannot both be had.

## 2026-08-21 03:23 — hamakali2005 · done

**Shop photographs were being cropped.** The card held them in a fixed 144px
strip under object-cover, so the first real photograph — 911x830, nearly
square — lost about sixty per cent of its height, and the sign naming the shop
was the part that went.

The card takes the shape of the photograph now: full width, natural height,
capped at 26rem so a very tall picture is scaled and letterboxed rather than
taking over the screen. Nothing is cropped either way. The preview in /hq
matches, so what the owner approves is what a customer sees.

Nothing changed about uploading — `downscale()` never cropped; it was only ever
the display.

## 2026-08-21 03:16 — hamakali2005 · done

**Saving an edited shop failed on `district`.** Opening a shop that has no
district seeded the form with `district: undefined`, the key travelled into the
write, and Firestore refuses undefined outright — "Unsupported field value:
undefined (found in field district)". Every other optional field was already
normalised in `save()`; this one had been missed.

It now writes an empty map instead of being left out, because an absent key in
an update means "leave it alone", so omitting it would have made clearing a
district impossible. `shops-repo.ts` also drops undefined keys before writing
now, so the next optional field added upstream cannot fail a save the same way.

Also: image upload was dead here because `S3_ACCESS_KEY_ID` and
`S3_SECRET_ACCESS_KEY` were blank in this machine's `.env.local` — deliberately,
they were stripped before being sent. Filled from the hotels site, which shares
the same bucket. **Nothing in git changed for that; it is env only, and Vercel
needs the same two values if uploads are to work on the live site.**

## 2026-08-21 03:05 — hamakali2005 · done

**Saving a shop failed with "Missing or insufficient permissions".** Not the
site: this project never had Firestore rules written for it, unlike aqarat, so
`lay-d4576` was still on defaults that allow reads and refuse writes — which is
exactly what it looked like, a directory that opens fine and rejects everything
you put in it.

Added `firestore.rules`: /shops readable by anyone, written only by a signed-in
address in `admins()`, with a shape check so a malformed record cannot reach the
search. **It still has to be pasted into the console** — pushing rules does not
deploy them.

## 2026-08-21 02:54 — hamakali2005 · done

**The search is location-first now.** A search returns what is in the
searcher's own city and nothing else; shops elsewhere appear only when the home
city has nothing, under a line that says so. A city typed into the query still
wins over the one we worked out — naming Erbil is asking about Erbil.

The city is remembered between visits, and asked for on the **first search**,
never on arrival — the empty page stays one question. A chip above the results
shows which city they are seeing and opens a picker of all twelve; refusing the
browser's location prompt costs nothing, the picker is still there.

New `src/lib/city.ts` (coordinates, nearest-city, the stored choice),
`search.ts` returns `elsewhere` and `homeCity` beside `shops`, and
`search-page.tsx` renders the chip, the picker and the fallback notice.

Checked at 375px with no horizontal overflow, and against four cases: near
results only, fallback to other cities, a typed city overriding home, and the
picker changing the answer.

## 2026-08-21 02:45 — hamakali2005 · done

Shared workflow set up: Claude now runs git on both sides, and this log was
added so neither side repeats work the other has already started.
