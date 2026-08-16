"use client";

import { useEffect, useRef } from "react";

/**
 * The bazaar at night, behind the whole page.
 *
 * Drawn rather than photographed. What was here was a fine picture and a
 * poor backdrop: a man looking straight down the lens, sitting exactly where
 * the name and the field sit, in a portrait crop that a wide screen cut down
 * to its busiest part. A face is the strongest thing on any page, and a
 * backdrop has to stay behind.
 *
 * So: strung lights out of focus over a warm dark. A few bytes instead of
 * 350KB, the same picture at every size and crop, nobody in it to license,
 * and the middle deliberately empty so the text always has somewhere clean
 * to stand.
 */

/** One lamp: where it hangs, how large it burns, how brightly. */
type Lamp = [x: number, y: number, r: number, a: number];

/** The near string — larger, brighter, and it travels furthest. */
const NEAR: Lamp[] = [
  [8, 18, 5, 0.5], [21, 11, 3.4, 0.38], [34, 22, 6, 0.42], [47, 9, 4, 0.5],
  [61, 19, 5.4, 0.36], [74, 12, 3.6, 0.46], [88, 24, 5, 0.4],
  [5, 74, 4.4, 0.34], [26, 84, 5.6, 0.3], [44, 77, 3.8, 0.4],
  [66, 86, 5, 0.32], [83, 72, 4.2, 0.38], [95, 88, 3.4, 0.3],
];

/** The far string — smaller, fainter, and it barely moves. */
const FAR: Lamp[] = [
  [14, 34, 2.4, 0.26], [29, 44, 2, 0.2], [41, 33, 2.6, 0.24],
  [55, 46, 2.2, 0.18], [69, 35, 2.8, 0.22], [80, 47, 2, 0.2],
  [92, 38, 2.4, 0.24], [3, 55, 2.2, 0.18], [18, 63, 2.6, 0.2],
  [52, 62, 2.4, 0.16], [76, 60, 2.2, 0.2], [90, 66, 2.6, 0.18],
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
        {/* Two strings at two depths. The blur is what makes them lamps seen
            past a focused foreground rather than dots on a screen, and two
            of them drifting at different speeds is what gives it depth. */}
        <div
          className="lamps-far absolute inset-0 blur-[3px]"
          style={{ background: lampsToCss(FAR) }}
        />
        <div
          className="lamps-near absolute inset-0 blur-[6px]"
          style={{ background: lampsToCss(NEAR) }}
        />
      </div>

      {/* The middle is kept clear on purpose: the name and the field stand
          there, and a lamp behind a letter is a lamp in the way. */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_62%_44%_at_50%_44%,transparent,rgba(10,7,4,0.92)_74%)]" />

      {/* and the dark the words stand on, heavier top and bottom */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,4,0.72)_0%,rgba(10,7,4,0.30)_45%,rgba(10,7,4,0.86)_100%)]" />

      {/* a little warmth behind the mark, so the gold has something to sit in */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_35%_at_50%_26%,rgba(223,178,80,0.14),transparent_70%)]" />
    </div>
  );
}
