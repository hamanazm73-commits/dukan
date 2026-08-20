<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Build for a 375px phone first

Almost every visitor and every shop owner is on a phone. A layout that only
works in the desktop preview is broken for nearly everyone.

Before considering any UI change done:

- Check it at **375px wide**, not just the default preview width.
- Nothing may be wider than the viewport. If an element is cut off at the
  edge, the layout is wrong — don't leave it to horizontal scrolling.

Default to `grid gap-N sm:grid-cols-2` for any pair of labelled fields. A
plain `grid-cols-2` is only safe for short numeric inputs, and a nested one
leaves about 150px per cell on a phone.

# Where a shop photograph goes

The browser redraws it to 1200px WebP, posts it to `/api/upload` on this
site, and this site writes it to the bucket under `shops/`. Records store
the **key**, never a URL; `mediaSrc()` turns a key into `/api/img/<key>`.

Do not reintroduce a presigned URL that the browser writes to directly.
That was tried: when it failed the browser reported only "Failed to fetch",
which is all a blocked cross-origin request ever says, and the bucket's CORS
rules answered correctly to every probe from outside. Same-origin has no
such failure, and the 4.5MB body limit is nowhere near a 150KB image.

# The bucket is shared with the hotels site

Both sites read and write `hotel-media` with the same credentials, kept
apart by key prefix — `shops/` here, hotel media there. A change to those
credentials affects both.

# Two people work on this, and neither of them runs git

The owner and his partner both drive this repository through an assistant,
from different machines, and neither types a git command by hand. Nobody is
watching for conflicts, so the agent has to be.

Every session, without being asked:

- **Before the first edit**, `git pull --rebase`. The other machine may have
  pushed since you last looked, and a rebase onto their work beats resolving
  a merge later.
- **After finishing a change**, commit it and `git push`. Work left sitting
  uncommitted is invisible to the other side and will be overwritten.
- **Never end a session with uncommitted changes.** If the work is not ready
  to land, say so — do not leave it on the disk of a machine the other
  person cannot see.

Pushing is deploying. The Vercel project builds from this repository, so a
push to the default branch replaces the live site within a minute. Run the
build first — `npm run build` — and do not push what does not compile.
