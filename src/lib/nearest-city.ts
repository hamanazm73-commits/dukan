import { CITY_NAMES, type CityKey } from "./data";

/**
 * Which of the twelve is closest to a point.
 *
 * Kept out of `city.ts` because that file is a client module — it holds a
 * React hook — and a client module cannot be called from the server. Both
 * sides need this arithmetic: the browser after a GPS fix, and /api/where
 * from the coordinates the network attaches to the request.
 */

/** City centres. Close enough: the nearest of twelve is not a close call. */
const CITY_COORDS: Record<CityKey, readonly [number, number]> = {
  erbil: [36.1901, 44.0091],
  sulaymaniyah: [35.5556, 45.4351],
  duhok: [36.8669, 42.9503],
  kirkuk: [35.4681, 44.3922],
  halabja: [35.1778, 45.9864],
  zakho: [37.1436, 42.6819],
  ranya: [36.2545, 44.8802],
  koya: [36.0828, 44.628],
  soran: [36.6528, 44.5442],
  shaqlawa: [36.4053, 44.3208],
  chamchamal: [35.5308, 44.8339],
  kalar: [34.628, 45.3186],
};

export const CITY_KEYS = Object.keys(CITY_NAMES) as CityKey[];

/**
 * Longitude degrees shrink towards the pole, so they are scaled by the
 * cosine of the latitude before the comparison. Without it, at 36° north, an
 * east–west gap counts about a quarter more than it should and Kirkuk loses
 * to Chamchamal from inside Kirkuk.
 */
export function nearestCity(lat: number, lng: number): CityKey {
  const scale = Math.cos((lat * Math.PI) / 180);
  let best: CityKey = CITY_KEYS[0];
  let bestDistance = Infinity;

  for (const key of CITY_KEYS) {
    const [cLat, cLng] = CITY_COORDS[key];
    const dLat = lat - cLat;
    const dLng = (lng - cLng) * scale;
    const d = dLat * dLat + dLng * dLng;
    if (d < bestDistance) {
      bestDistance = d;
      best = key;
    }
  }
  return best;
}
