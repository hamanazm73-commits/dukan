"use client";

import { useEffect, useRef } from "react";

/**
 * What the page stands on.
 *
 * No photograph. Two were tried and both failed the same way: a picture is
 * one shape and a page is every shape, so whatever a screen crops to is
 * whatever the picture happens to have there. The first had a man's face in
 * the middle; the second was an empty alley, which reads as shut rather than
 * open on a site about shops.
 *
 * Drawn instead: a deep warm dark, a kilim weave so faint it is closer to
 * texture than pattern, and lamps out of focus along the top and the bottom.
 * A few bytes, identical at every size, no crop to lose anything to, and the
 * middle stays clear on purpose — that is where the name and the field
 * stand, and a lamp behind a letter is a lamp in the way.
 */

/** One lamp: where it hangs, how large it burns, how brightly. */
type Lamp = [x: number, y: number, r: number, a: number];

/** The near string — larger, brighter, and it travels furthest. */
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

/**
 * The weave.
 *
 * Two diagonals crossing at 28px make the lattice a kilim is built on, and a
 * row of small diamonds sits in it. Kept under a tenth of full strength: at
 * anything stronger it stops being a surface the page rests on and starts
 * being a pattern the reader has to look past.
 */
const KILIM =
  "repeating-linear-gradient(45deg, rgba(223,178,80,0.9) 0 1px, transparent 1px 28px)," +
  "repeating-linear-gradient(-45deg, rgba(223,178,80,0.9) 0 1px, transparent 1px 28px)," +
  "repeating-linear-gradient(45deg, rgba(200,120,60,0.55) 0 2px, transparent 2px 84px)";

export function PhotoBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      // A quarter of the scroll distance, so the lamps sit behind the page
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
      {/* the warm dark — embers low and to one side rather than a flat wash */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_90%_70%_at_28%_18%,#2a1f14,transparent_65%),radial-gradient(ellipse_70%_60%_at_82%_78%,#241a12,transparent_60%),linear-gradient(180deg,#120c07,#0a0704)]" />

      {/* the weave, barely there */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ background: KILIM }}
      />

      <div
        ref={ref}
        className="absolute left-[-6%] top-[-6%] h-[112%] w-[112%] will-change-transform"
      >
        {/* Two strings at two depths. The blur is what makes them lamps seen
            past a focused foreground rather than dots on a screen, and two
            of them breathing at different rates is what gives it depth. */}
        <div
          className="lamps-far absolute inset-0 blur-[4px]"
          style={{ background: lampsToCss(FAR) }}
        />
        <div
          className="lamps-near absolute inset-0 blur-[8px]"
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
