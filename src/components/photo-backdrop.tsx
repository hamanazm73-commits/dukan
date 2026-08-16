"use client";

import { useEffect, useRef } from "react";

/**
 * The Erbil bazaar, behind the whole page.
 *
 * Served from this site rather than a photo CDN. The CDN's own parameters
 * were what made the last one look poor: `cs=tinysrgb` and `auto=compress`
 * flatten the colour and band the gradients. Downloaded once at full size,
 * resized to 1800px and encoded as WebP, the whole picture is 350KB and
 * loses nothing a background needs.
 *
 * It no longer moves on its own. It shifts as the page is scrolled, a
 * quarter of the distance the content travels — so the photograph feels like
 * it sits behind the page rather than being painted on it, and nothing moves
 * unless the reader moves it.
 */
export function PhotoBackdrop() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      // A quarter of the scroll distance. Any more and the picture outruns
      // its 6% bleed and shows an edge.
      el.style.transform = `translate3d(0, ${window.scrollY * -0.25}px, 0)`;
    };
    const onScroll = () => {
      // One write per frame — a scroll event can fire far more often than
      // the screen refreshes, and each write would force a fresh layout.
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/*
        Bled 6% past every edge so the parallax never exposes a corner.

        Offset with left/top rather than centred with a translate, because
        the scroll handler owns `transform` — a centring translate as well
        would put the picture a whole frame off to one side. And the size is
        stated outright: an <img> is a replaced element, so insets alone
        leave it at the file's own dimensions instead of filling the box.
      */}
      <img
        ref={ref}
        src="/bazaar.webp"
        alt=""
        fetchPriority="high"
        className="absolute left-[-6%] top-[-6%] h-[112%] w-[112%] max-w-none object-cover will-change-transform"
      />

      {/* The dark the words stand on — heavier top and bottom, where the name
          sits and the results run, than through the middle. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,34,0.86)_0%,rgba(8,20,34,0.60)_45%,rgba(8,20,34,0.90)_100%)]" />

      {/* a little warmth behind the mark, so the gold has something to sit in */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_35%_at_50%_26%,rgba(223,178,80,0.13),transparent_70%)]" />
    </div>
  );
}
