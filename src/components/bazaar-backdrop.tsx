/**
 * The arcade of the Qaysari bazaar, drawn in one gold line behind the page.
 *
 * Drawn rather than photographed: it holds at any screen size, costs nothing
 * to load, and cannot turn out to be a picture of somebody else's market.
 *
 * The arches tile through an SVG pattern instead of being listed one by one,
 * so the row runs the full width of any phone or monitor without a seam and
 * without deciding in advance how many will fit.
 */
export function BazaarBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* the field the arcade stands in */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1c2e_0%,#15304A_58%,#1b3b5a_100%)]" />

      {/* a little light where the mark and the field sit */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_80%_45%_at_50%_28%,rgba(223,178,80,0.13),transparent_65%)]" />

      <svg
        className="absolute inset-x-0 bottom-0 h-[46vh] w-full"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 400 300"
      >
        <defs>
          {/* one bay of the arcade, repeated */}
          <pattern
            id="arcade"
            width="70"
            height="300"
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke="#DFB250" strokeWidth="1.1" opacity="0.3">
              {/* the tall arch */}
              <path d="M0 210 v-64 a35 35 0 0 1 70 0 v64" />
              {/* the smaller one below, set back */}
              <path d="M9 300 v-52 a26 26 0 0 1 52 0 v52" opacity="0.55" />
            </g>
            {/* the lamp hanging in the bay */}
            <circle cx="35" cy="166" r="2" fill="#DFB250" opacity="0.5" />
          </pattern>

          {/* the arcade fades out as it climbs, so it never crowds the text */}
          <linearGradient id="arcadeFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id="arcadeMask">
            <rect width="400" height="300" fill="url(#arcadeFade)" />
          </mask>
        </defs>

        <rect
          width="400"
          height="300"
          fill="url(#arcade)"
          mask="url(#arcadeMask)"
        />

        {/* the two courses the arches spring from */}
        <g stroke="#DFB250" strokeWidth="1.1" opacity="0.26">
          <path d="M0 146 H400" />
          <path d="M0 210 H400" />
        </g>
      </svg>
    </div>
  );
}
