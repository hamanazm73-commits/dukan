# TEAM-LOG — who is doing what

Two people work on this repo through Claude, from different machines. This file
is how the two sides avoid building the same thing twice.

The rules are in `AGENTS.md`. In short: pull, read this file, push your claim
**before** starting, then mark it done when the code is pushed.

Newest entry at the top.

---

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
