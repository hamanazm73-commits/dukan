/**
 * Amedi on its rock, behind the whole page.
 *
 * The photograph drifts — a very slow zoom and pan, thirty seconds each way.
 * Slow enough that nobody watches it move, fast enough that the page never
 * feels like a printed sheet. Anything quicker would pull the eye off the
 * field, which is the only thing here anyone came to use.
 *
 * It is fixed rather than scrolled, so the picture stays put while the
 * results move over it.
 */

/** Pexels, free for commercial use. Wide enough to survive the zoom. */
const PHOTO =
  "https://images.pexels.com/photos/21972276/pexels-photo-21972276.jpeg?auto=compress&cs=tinysrgb&w=1920";

export function PhotoBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/*
        Bled 6% past every edge so the drift never exposes a corner.

        Two things this markup is deliberate about. It is offset with
        left/top rather than centred with a translate, because the keyframes
        set `transform` themselves — with a centring translate as well the
        picture ended up a whole frame off to one side, showing only its edge.
        And the size is stated outright: an <img> is a replaced element, so
        four insets alone leave it at the file's own 1920×3413 rather than
        filling the box.
      */}
      <img
        src={PHOTO}
        alt=""
        fetchPriority="high"
        className="backdrop-drift absolute left-[-6%] top-[-6%] h-[112%] w-[112%] max-w-none object-cover"
      />

      {/*
        The dark the words stand on. Heavier at the top and bottom than the
        middle: the name sits high and the results run low, and both need
        more cover than the band between them where the photograph shows.
      */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,34,0.86)_0%,rgba(8,20,34,0.62)_45%,rgba(8,20,34,0.90)_100%)]" />

      {/* a little warmth behind the mark, so the gold has something to sit in */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_35%_at_50%_26%,rgba(223,178,80,0.13),transparent_70%)]" />
    </div>
  );
}
