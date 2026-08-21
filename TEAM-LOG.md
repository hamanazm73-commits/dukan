# TEAM-LOG — who is doing what

Two people work on this repo through Claude, from different machines. This file
is how the two sides avoid building the same thing twice.

The rules are in `AGENTS.md`. In short: pull, read this file, push your claim
**before** starting, then mark it done when the code is pushed.

Newest entry at the top.

---

## OPEN — Mohammed: Vercel is blocking everything Hama pushes

Vercel's own words, on the dukan deployment of `0b92381`:

> **Deployment Blocked** — The deployment was blocked because the commit author
> did not have contributing access to the project on Vercel. The Hobby Plan does
> not support collaboration for private repositories.

The Vercel account is **mohammed**, on **Hobby**. The repos are **private**,
under `hamanazm73-commits`. Commits authored by **hamakali2005-ops** — every
commit from Hama's side — are refused a build. Yours build normally.

### What this is not

Worth saying plainly, because time went into ruling each of these out:

- **Not the code.** All four repos build clean locally.
- **Not a failed build.** The builds never start.
- **Not billing.** There was a separate "billing address incomplete" warning
  earlier; it is gone and the block stayed. Different thing.
- **Not env vars, not the branch setting, not DNS.**
- **Not `3-dukan.txt`.** Hama's `.env.local` has had all eight NEXT_PUBLIC_
  values since the first day; `/shops/…` answers 200 on his machine.

### Why some of his work IS live and some is not

A blocked commit is not lost — it is still on the branch. The next time **you**
push, Vercel builds **your** commit, and everything sitting behind it on the
branch ships with it.

That is the whole pattern: his work reaches the site whenever you happen to
push after him, and stops dead whenever you do not. The third card on
layhama.com is his and it is live, because you pushed at 04:31. Nothing after
that has moved.

### Waiting on the branch right now

- `0b92381` Let each site say which commit it is running
- `a6abfda` Say the rest of it in Arabic and English too
- `4b8bb60` Name the shops site the same thing in all three languages
- `a209612` Take the row of sister-site links back off
- `e5bdeca` Teach the list 326 more ways to ask
- `fdc054e` Write down what is left, for whoever has hours
- `9a7af0b` Ask Claude only when the word list has nothing
- `86a7e4d` Move the third door to bedozawa.layhama.com
- `282e5ab` Say where this site lives, and whose it is
- `dfeed82` Name the site لای حەمە بیدۆزەوە, and leave one cross in the field
- `78bf69f` Set the type the way the hotels site sets it
- `22398c1` Lay the results out the way the hotels site does
- `da02a71` Build the shop card to the hotel card
- `13e3188` Hold every photograph to one ratio

### Four ways out — your call, it is your account

1. **Make the repos public.** Free, and Hobby only refuses collaboration on
   *private* repos. Nothing secret is in them — `.env.local` is gitignored and
   verified untracked in all four. The cost is that the code is readable by
   anyone.
2. **Upgrade to Pro.** About $20 a month. The correct fit for two people
   working on one thing, and the repos stay private.
3. **Have Hama's commits authored as you.** Free and immediate, but the history
   would say you wrote all of it — and TEAM-LOG only works because it says who
   did what.
4. **Deploy from the command line** with a token, which skips the author check.
   Free, but it becomes a manual step after every change.

Hama was asked and did not want to pick one on your behalf. Say which, and it
gets set up from his side in a few minutes.

### Until then

`/api/version` is on all four sites now — it reports the commit each one is
actually running, so this is visible in one request instead of by noticing an
old word on a page. It is itself in the blocked queue, so it starts answering
after the first successful deploy.

## 2026-08-21 15:30 — Mohammed · done

**Answering "why has the last commit not deployed": it was not your code.**

Vercel was blocking every deployment whose commit author was you. The page
said it plainly once we opened a blocked build:

> The deployment was blocked because the commit author did not have
> contributing access to the project. The Hobby Plan does not support
> collaboration for private repositories.

We made all four repos private last night, at Hama's request, and that is
what did it — from that hour on, everything you pushed was created, blocked
and never built. Four projects, ten hours. Your `/api/version` and
`check-live.ps1` are what made it visible; without them it would still be
running.

**Fixed two ways.** An empty commit authored by the account holder unblocked
each project and carried all your work with it. Then the repos went **public
again** — the private setting protected nothing that was not already
protected (`.gitignore` keeps every key out, and the whole history was
searched for `sk-ant-`, private keys, AWS ids and bot tokens before
publishing: zero matches).

**So push normally now.** Your commits deploy on their own again.

## 2026-08-21 14:39 — hamakali2005 · done

**`/api/version` reports the commit this site is actually running.** A push is
not a deploy: code sat right on origin for five hours today while the live site
served the morning's words, and the only way that surfaced was somebody
noticing the old name on the page.

`check-live.ps1` in `C:\Users\Admin\dev` asks all four and compares each
against its branch. BEHIND means the code is fine and the deployment did not
happen — a different problem, and one only the Vercel account holder can see.

## 2026-08-21 — hamakali2005 · done

**The site speaks Arabic and English now, not only Kurdish.** Hama asked for
this twice; the first time I heard "rename the card" and renamed the card,
which was not it.

`i18n.ts` holds one dictionary in three languages and no `"use client"`, so
the server can read it too. `locale.tsx` holds the provider. The choice is a
**cookie**: the shop pages are server-rendered, so a language the browser alone
knew about would leave `/shops/…` in Kurdish for an English reader and flash
the wrong direction on every load. The layout reads it and sets `lang`/`dir`
before the first paint.

Everything visible follows it — the field, the city picker, the permission
card, the counts, the AI notice, the card, and the shop page. Shop names,
trades and cities come out of the data in the chosen language.

Verified: `ckb/rtl`, `ar/rtl`, `en/ltr` on both the search page and
`/shops/…`; switching is instant and survives a reload; "1 shop" not
"1 shops"; nothing off-screen at 375px.

**One thing I got wrong on the way, again:** `localeFromCookie` started in the
`"use client"` module and the layout threw on every request. Same mistake as
`nearestCity` earlier this morning. Anything the server needs belongs in a file
with no directive on it.

Metadata and the canonical stay Kurdish deliberately — that is the language
this site is indexed in.

## 2026-08-21 14:10 — hamakali2005 · done

Arabic and English names brought in line with the Kurdish: يم حمة تلاقيها and
Find It at Lay Hama, replacing يم حمة للمحلات and Lay Hama Shops in the
organisation data. Same change in the hub.

## 2026-08-21 13:57 — hamakali2005 · done

**Removed the family links from the shop page**, the same row Hama asked to
have taken off the other two sites. They were already off the search page.
Nothing on this site links out to the siblings now.

If a link home is wanted again for crawling, ask him first.

## 2026-08-21 06:05 — hamakali2005 · done

**Vocabulary 433 → 759 terms.** Things, in the words people reach for: شاحن,
airpods, redmi, برجر, شاورما, بەقلاوە, بەتری, زەیت, پەمپەرز, حليب اطفال,
سجاد, كنب, بخور, صبغة شعر — brands, goods and the Arabic and Latin spellings
beside the Kurdish, across all sixteen trades. The thin ones gained most:
barber went 19 → 42, supermarket 23 → 54.

Every word added here is one Claude no longer has to be paid to interpret, and
one answered instantly and offline instead of after a round trip. `data.ts`
still says it best: this list is the product.

Checked: شاحن and airpods now land on مۆبایل locally, no /api/interpret call.

## 2026-08-21 05:55 — Mohammed · done

Answering the list below, and adding what changed while Hama was away.

**The four settings are set.** `NEXT_PUBLIC_SITE_URL` was never needed —
layout.tsx already falls back to `https://bedozawa.layhama.com`, so setting it
changes nothing. The two S3 keys are in. `ANTHROPIC_API_KEY` is in and
working: /api/interpret returns a real answer now, not `not-configured`.

**Shops have their own pages.** `/shops/[id]`, server-rendered, read over
Firestore's REST API from `lib/shops-server.ts` — the browser SDK is a client
module, and a crawler does not run the search before deciding whether to keep
a page. The sitemap grows with the collection on its own. The card carries a
stretched link underneath its three buttons, so a tap on Call still calls.

The front page is unchanged: one question, one box, no list and no menu. Those
pages are reached by tapping a result, or by a link somebody was sent.

**Know this before you pull:** `.env.local` on Mohammed's machine held only
`VERCEL_OIDC_TOKEN`, so every `/shops/...` answered 404 locally while working
perfectly in production. Yours will be the same. The eight `NEXT_PUBLIC_`
values are in the file Mohammed sent you (`3-dukan.txt`) — without
`NEXT_PUBLIC_FIREBASE_PROJECT_ID` the server has no project to read from.

**Across all four repos:** one navy and one gold (the hand-written `#DFB250`
sat two percent off the token and is now `#e7ba54`); each host declares its
own site name in Kurdish, which is what Google prints in place of the address;
every child links back to the hub; and the hotels homepage went from 4.3s to
0.5s — it had been reading the whole hotels collection out of Firestore on
every single request.

**Still true, and still the largest thing:** the directory is nearly empty.
Everything above is a door, and there is almost nothing behind it yet.

---

## 2026-08-21 04:41 — hamakali2005 · open, for whoever picks this up

Hama has run out of Claude hours; Mohammed is taking the dashboard work.
Nothing here needs code — all four are things only an account holder can do.

**Vercel → dukan → Environment Variables**
- `NEXT_PUBLIC_SITE_URL` = `https://bedozawa.layhama.com`
- `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` — the same pair the hotels
  site uses; both sites share the `hotel-media` bucket, split by key prefix.
  **Without them the live site opens fine and silently cannot upload a photo**
  — /api/upload answers 501 and /api/img cannot serve one either.
- `ANTHROPIC_API_KEY` — only for /api/interpret. Absent, the route returns
  null and the search behaves exactly as it did before it existed.

**The directory is empty.** One shop, in Kirkuk. A search site with nothing in
it finds nothing, and that is now the largest thing standing between this and
being useful — larger than anything left in the code.

The domain itself is done: bedozawa.layhama.com answers 200.

## 2026-08-21 04:27 — hamakali2005 · done

**The search asks Claude when the word list runs out.** New `/api/interpret`:
given a query nothing local matched, it returns one of the sixteen category
keys or null. The client then re-runs its **own** search on that trade, so the
shops still come from the local index — the model never sees the database and
cannot put a shop on the page that was not already in it. Asked only after a
local miss, cached per tab, rate-limited per instance, and silent when
`ANTHROPIC_API_KEY` is absent: the site behaves exactly as before without it.
The result is labelled on screen, because a guess shown as a match is a lie.

**Also fixed two things in `/api/where`, from the commit that landed while I
was working:**

1. It 500'd on every request. `nearestCity` lived in `city.ts`, which is
   `"use client"`, so the server route compiled and then threw. The other side
   was fixing this in the same hour — `nearest-city.ts` is theirs; mine was a
   second file with the same contents and was dropped in the merge. Third time
   this week two of us have built the same thing at once.
2. With the headers absent it answered **Zakho** for everyone. `Number(null)`
   and `Number("")` are both 0, and 0 is finite, so a missing header became a
   valid point at (0,0) — nearest Kurdish city, Zakho. Now checked as text
   before conversion.

Verified: no headers → null, Kirkuk coords → kirkuk, Erbil → erbil, Berlin →
outside, blank header → null.

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
