"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "./data";
import { LOCALE_COOKIE, dirOf, htmlLang, t as translate } from "./i18n";

export { LOCALE_COOKIE, localeFromCookie } from "./i18n";

/**
 * Which language the chrome speaks.
 *
 * Kept in a **cookie**, not just localStorage, because the shop pages are
 * rendered on the server: a choice the browser alone knows about would leave
 * `/shops/…` in Kurdish for a visitor who picked English, and would flash the
 * wrong direction on every load. The cookie is read on the server for the
 * first paint and updated here when the choice changes.
 *
 * There is no `/en/` or `/ar/` path. The site is one field and one answer, and
 * routing it three ways would buy a language switch the price of every URL in
 * it being three URLs. Kurdish is what a crawler is served and what the
 * canonical points at; the other two are for the person reading.
 */

const ONE_YEAR = 60 * 60 * 24 * 365;

interface Value {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dir: "rtl" | "ltr";
  /** `t("otherShopsIn", { city })` — the locale is already bound */
  t: (
    key: Parameters<typeof translate>[1],
    vars?: Record<string, string | number>,
  ) => string;
}

const Ctx = createContext<Value | null>(null);

export function LocaleProvider({
  initial,
  children,
}: {
  initial: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initial);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    } catch {
      /* nothing to be done, and the choice still holds for this page */
    }
  }, []);

  // The server already set these for the first paint; this keeps them right
  // when the choice changes without a reload.
  useEffect(() => {
    const el = document.documentElement;
    el.lang = htmlLang(locale);
    el.dir = dirOf(locale);
  }, [locale]);

  const value: Value = {
    locale,
    setLocale,
    dir: dirOf(locale),
    t: (key, vars) => translate(locale, key, vars),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale(): Value {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLocale must be used within <LocaleProvider>");
  return ctx;
}

