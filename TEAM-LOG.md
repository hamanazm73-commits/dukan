# TEAM-LOG — who is doing what

Two people work on this repo through Claude, from different machines. This file
is how the two sides avoid building the same thing twice.

The rules are in `AGENTS.md`. In short: pull, read this file, push your claim
**before** starting, then mark it done when the code is pushed.

Newest entry at the top.

---

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
