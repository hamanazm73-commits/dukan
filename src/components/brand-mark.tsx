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
        {/* the shop below it, with the doorway cut out */}
        <mask id="door">
          <rect width="100" height="100" fill="white" />
          <rect x="44" y="60" width="12" height="14" rx="1.4" fill="black" />
        </mask>
        <path d="M32 56 H68 V74 H32 Z" fill={GOLD} mask="url(#door)" />
      </svg>
    </span>
  );
}
