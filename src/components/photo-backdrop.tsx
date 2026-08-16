"use client";

import { useEffect, useRef } from "react";

/**
 * The bazaar at night, behind the whole page.
 *
 * An empty alley strung with bulbs, made for this page rather than found:
 * nobody in it, dark through the middle where the name and the field stand,
 * and warm at the edges. It measures 52 of 255 through the centre band
 * before the wash goes on, against roughly 100 as the point white text
 * starts to struggle.
 *
 * It arrived square, which is the one shape a page is never. Rather than
 * crop a square to a laptop's middle band — which would have cut off the
 * lights along the top — it was widened to 16:9 by mirroring and blurring
 * its own edges outward, so the picture keeps everything it had. 59KB.
 *
 * The drawn lamps stay over it, faint. A photograph cannot move; those can,
 * and two of them breathing at different rates is what keeps a still page
 * from looking stopped.
 */

/** One lamp: where it hangs, how large it burns, how brightly. */
type Lamp = [x: number, y: number, r: number, a: number];

/**
 * The near string — larger, brighter, and it travels furthest.
 *
 * Strung along the top and the bottom with only a pair out at the sides.
 * The band through the middle is left to the far string and the vignette,
 * because that is where the name and the field stand.
 */
const NEAR: Lamp[] = [
  [6, 16, 7, 0.5], [15, 9, 5, 0.42], [24, 20, 7.5, 0.46], [33, 11, 5.5, 0.5],
  [42, 21, 6.5, 0.4], [51, 8, 5, 0.52], [60, 18, 7, 0.44], [69, 10, 5.5, 0.48],
  [78, 22, 6.5, 0.4], [87, 13, 5, 0.5], [95, 20, 6, 0.42],
  [4, 76, 6, 0.38], [14, 88, 5, 0.32], [25, 79, 7, 0.36], [36, 90, 5.5, 0.3],
  [47, 78, 6.5, 0.38], [58, 89, 5, 0.32], [69, 80, 6.5, 0.36],
  [80, 91, 5.5, 0.3], [90, 77, 6, 0.36], [97, 86, 4.5, 0.3],
  [3, 42, 5.5, 0.34], [96, 48, 5.5, 0.32],
];

/** The far string — smaller, fainter, and it barely moves. */
const FAR: Lamp[] = [
  [10, 30, 3.2, 0.26], [20, 38, 2.8, 0.22], [30, 29, 3.4, 0.24],
  [40, 40, 3, 0.2], [50, 31, 3.2, 0.22], [60, 41, 2.8, 0.2],
  [70, 30, 3.4, 0.24], [80, 40, 3, 0.22], [90, 32, 3.2, 0.24],
  [97, 42, 2.8, 0.2], [7, 58, 3, 0.22], [17, 66, 3.2, 0.2],
  [28, 57, 2.8, 0.18], [39, 67, 3, 0.2], [50, 58, 2.6, 0.16],
  [61, 68, 3, 0.18], [72, 57, 3.2, 0.2], [83, 67, 2.8, 0.18],
  [93, 59, 3, 0.2], [12, 50, 2.6, 0.18], [88, 52, 2.6, 0.18],
];

/** A whole string as one background shorthand, one radial stop per lamp. */
const lampsToCss = (lamps: Lamp[]) =>
  lamps
    .map(
      ([x, y, r, a]) =>
        `radial-gradient(circle at ${x}% ${y}%, rgba(255,214,140,${a}) 0 ${r * 0.5}px, rgba(223,178,80,${a * 0.5}) ${r * 0.9}px, transparent ${r * 2.2}px)`,
    )
    .join(",");

export function PhotoBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      // A quarter of the scroll distance, so the lights sit behind the page
      // rather than being painted on it. The 6% bleed covers the travel.
      el.style.transform = `translate3d(0, ${window.scrollY * -0.25}px, 0)`;
    };
    const onScroll = () => {
      // One write per frame — scroll fires far more often than the screen
      // refreshes, and each write would force a fresh layout.
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
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0a0704]"
    >
      {/* the warm dark the lights hang in — embers low and to one side rather
          than a flat wash */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_90%_70%_at_28%_18%,#2a1f14,transparent_65%),radial-gradient(ellipse_70%_60%_at_82%_78%,#241a12,transparent_60%),linear-gradient(180deg,#120c07,#0a0704)]" />

      <div
        ref={ref}
        className="absolute left-[-6%] top-[-6%] h-[112%] w-[112%] will-change-transform"
      >
        {/*
          The photograph.

          Bled 6% past every edge by the wrapper so the parallax never
          exposes a corner, and sized outright — an <img> is a replaced
          element, so insets alone would leave it at the file's own size
          instead of filling the box.
        */}
        <img
          src="/bazaar.webp"
          alt=""
          fetchPriority="high"
          className="size-full object-cover"
        />

        {/* The drawn lamps stay, faint, over the photograph. They are what
            keeps the frame alive on a still page — the picture cannot move
            on its own, and these breathe at two different rates. */}
        <div
          className="lamps-far absolute inset-0 opacity-40 blur-[4px]"
          style={{ background: lampsToCss(FAR) }}
        />
        <div
          className="lamps-near absolute inset-0 opacity-30 blur-[8px]"
          style={{ background: lampsToCss(NEAR) }}
        />
      </div>

      {/* Lighter than it was over the drawn version. That one needed a heavy
          vignette to clear a hole for the text; the photograph arrives dark
          through the middle already, and burying it under the same wash
          would waste the picture. */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_50%_at_50%_44%,transparent,rgba(10,7,4,0.55)_82%)]" />

      {/* the dark the words stand on, heavier top and bottom */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,4,0.62)_0%,rgba(10,7,4,0.18)_45%,rgba(10,7,4,0.78)_100%)]" />

      {/* a little warmth behind the mark, so the gold has something to sit in */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_35%_at_50%_26%,rgba(223,178,80,0.14),transparent_70%)]" />
    </div>
  );
}
