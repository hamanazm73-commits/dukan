/**
 * The Lay Hama shops emblem: a shopfront awning under three stars, inside the
 * same gold double ring on the same navy badge as the two sister sites. Only
 * the motif in the middle changes — that is what makes them one family.
 */

const GOLD = "#e7ba54";
const STAR_D =
  "M50 20 l2.3 4.8 5.3.8-3.8 3.7 1 5.3-4.8-2.5-4.8 2.5 1-5.3-3.8-3.7 5.3-.8Z";
const place = (cx: number, cy: number, s: number) =>
  `translate(${cx} ${cy}) scale(${s}) translate(-50 -27.5)`;

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-[#15304A] shadow-md ${className ?? ""}`}
    >
      <svg viewBox="0 0 100 100" className="size-[82%]" aria-hidden="true">
        <circle cx="50" cy="50" r="43" fill="none" stroke={GOLD} strokeWidth="2.4" />
        <circle cx="50" cy="50" r="37" fill="none" stroke={GOLD} strokeWidth="1" />
        <g fill={GOLD}>
          <path d={STAR_D} transform={place(50, 23, 1)} />
          <path d={STAR_D} transform={place(34.5, 30, 0.62)} />
          <path d={STAR_D} transform={place(65.5, 30, 0.62)} />
        </g>
        {/* the awning, scalloped along its lower edge */}
        <path
          d="M28 44 L72 44 L72 52 q-5.5 5 -11 0 q-5.5 5 -11 0 q-5.5 5 -11 0 q-5.5 5 -11 0 Z"
          fill={GOLD}
        />
        {/* The shop below it, doorway cut with fill-rule rather than a mask.
            A mask is a `url(#id)` reference, and the sister sites lost whole
            emblems to phones that declined to resolve one — the masked group
            vanishes and the mark is simply gone. evenodd is resolved by the
            renderer with nothing to look up.

            The id mattered here more than most: every card on the page draws
            this mark, so `id="door"` appeared dozens of times in one document. */}
        <path
          d="M32 56 H68 V74 H32 Z
             M45.4 60 H54.6 A1.4 1.4 0 0 1 56 61.4 V74 H44 V61.4 A1.4 1.4 0 0 1 45.4 60 Z"
          fill={GOLD}
          fillRule="evenodd"
        />
      </svg>
    </span>
  );
}
