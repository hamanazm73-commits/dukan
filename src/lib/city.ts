"use client";

import { useCallback, useEffect, useState } from "react";
import { CITY_NAMES, type CityKey } from "./data";

/**
 * Where the person searching is.
 *
 * A directory that answers "where do I buy this" with a shop three cities
 * away has not answered it. So the city comes first: results are the ones
 * within reach, and everywhere else is a fallback shown only when nothing
 * near enough exists.
 *
 * Two ways to know it, in this order:
 *
 *  1. What they chose last time. Stored, because being asked on every visit
 *     is worse than being wrong once.
 *  2. The browser's own position, resolved to the nearest of the twelve.
 *
 * Neither is asked for on arrival. The permission sheet is requested on the
 * first search and not before — the empty page is one question, and a system
 * dialog on top of it before anyone has typed a letter answers a question
 * nobody asked.
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

const STORAGE_KEY = "dukan.city";

function isCityKey(v: unknown): v is CityKey {
  return typeof v === "string" && v in CITY_NAMES;
}

/**
 * The nearest city centre to a position.
 *
 * Longitude degrees shrink towards the pole, so they are scaled by the
 * cosine of the latitude before the comparison. Without it, at 36° north,
 * an east–west gap counts about a quarter more than it should and Kirkuk
 * loses to Chamchamal from inside Kirkuk.
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

const DISMISS_KEY = "dukan.city.dismissed";

function dismissedThisVisit(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}
function rememberDismissed() {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* private mode — asking again next visit is survivable */
  }
}

function readStored(): CityKey | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return isCityKey(v) ? v : null;
  } catch {
    // Private mode, or storage turned off. Not knowing is survivable.
    return null;
  }
}

function writeStored(city: CityKey | null) {
  if (typeof localStorage === "undefined") return;
  try {
    if (city) localStorage.setItem(STORAGE_KEY, city);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* same */
  }
}

export type CityStatus =
  /** nothing stored and nothing asked for yet */
  | "idle"
  /**
   * Our own card is up, explaining what is about to be asked for and why.
   * The browser has not been touched yet.
   *
   * This state exists because the browser's own bar arrives with no reason
   * attached: a strip at the top of the screen demanding a location, from a
   * shop directory a person opened three seconds ago. Most people refuse it,
   * and a refusal is permanent — the browser will not ask that site again.
   * So the explanation has to come first, from us, where it can be read.
   */
  | "asking"
  /** the browser is being asked where it is */
  | "locating"
  /** we have a city */
  | "ready"
  /** asked and refused, or the browser cannot say — they can still pick */
  | "unknown";

export interface HomeCity {
  city: CityKey | null;
  status: CityStatus;
  /** chosen by hand; overrides anything measured, and is remembered */
  choose: (city: CityKey | null) => void;
  /** ask the browser — only ever from something the person just tapped */
  locate: () => void;
  /** close the explanation without the browser being asked at all */
  decline: () => void;
}

/**
 * @param active whether it is time to find out — pass `true` once the visitor
 * has actually searched for something.
 */
export function useHomeCity(active: boolean): HomeCity {
  const [city, setCity] = useState<CityKey | null>(null);
  const [status, setStatus] = useState<CityStatus>("idle");

  // What they chose before, restored before anything is measured. Runs on
  // mount rather than on `active` so a returning visitor is never relocated.
  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setCity(stored);
      setStatus("ready");
    }
  }, []);

  const locate = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unknown");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const found = nearestCity(pos.coords.latitude, pos.coords.longitude);
        setCity(found);
        writeStored(found);
        setStatus("ready");
      },
      () => {
        // Refused, or no fix. Say nothing and let them pick — a site that
        // nags for a permission it was already denied is a site people leave.
        setStatus("unknown");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 30 * 60 * 1000 },
    );
  }, []);

  /**
   * The first search raises our card — not the browser's.
   *
   * Unless the permission was already given, in which case there is nothing
   * to explain and the card would only be in the way: ask the browser
   * straight away and let the city appear. `permissions` is missing on some
   * browsers, so its absence is treated as "not yet granted" and the card
   * shows, which is the safe way round.
   */
  useEffect(() => {
    if (!active || city || status !== "idle") return;
    if (dismissedThisVisit()) {
      setStatus("unknown");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const p = await navigator.permissions?.query({ name: "geolocation" });
        if (cancelled) return;
        if (p?.state === "granted") {
          locate();
          return;
        }
      } catch {
        /* fall through to the card */
      }
      if (!cancelled) setStatus("asking");
    })();
    return () => {
      cancelled = true;
    };
  }, [active, city, status, locate]);

  /** They said not now. Drop it for this visit rather than asking again on
      the next keystroke. */
  const decline = useCallback(() => {
    rememberDismissed();
    setStatus("unknown");
  }, []);

  const choose = useCallback((next: CityKey | null) => {
    setCity(next);
    writeStored(next);
    setStatus(next ? "ready" : "unknown");
  }, []);

  return { city, status, choose, locate, decline };
}
