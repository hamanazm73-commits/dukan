"use client";

import { useEffect, useState } from "react";
import { Hammer, Loader2 } from "lucide-react";
import { loadComingSoon, saveComingSoon } from "@/lib/shops-repo";
import { useLocale } from "@/lib/locale";

/**
 * The strip across the top while the owner is still filling the site in, and
 * the switch that flies it.
 *
 * Both live here because they are two halves of one thing and neither is more
 * than a few lines. The hotels site keeps them apart, and the result is two
 * files that have to be read together to understand either.
 */

/** The strip. Off unless the owner has switched it on. */
export function ComingSoonStrip() {
  // t is the lookup the rest of the site uses, straight off the context.
  const { t } = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let live = true;
    void loadComingSoon().then((on) => {
      if (live) setShow(on);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!show) return null;

  return (
    <div
      role="status"
      // Above the language pills, which sit at top-5 absolute — so the strip
      // takes the very top and the page starts under it.
      className="relative z-40 bg-gradient-to-r from-gold via-amber-300 to-gold text-[#0f1624]"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-center gap-2 px-4 py-2 text-center">
        <Hammer className="size-4 shrink-0" aria-hidden />
        <p className="text-xs font-semibold leading-snug sm:text-sm">
          <span className="font-extrabold">{t("soonTitle")}</span>{" "}
          <span className="font-medium">{t("soonText")}</span>
        </p>
      </div>
    </div>
  );
}

/** The switch, for the dashboard. */
export function ComingSoonCard() {
  const [on, setOn] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    void loadComingSoon().then(setOn);
  }, []);

  async function toggle() {
    if (on === null || saving) return;
    const next = !on;
    setOn(next);
    setFailed(false);
    setSaving(true);
    try {
      await saveComingSoon(next);
    } catch {
      // Put the switch back. One that shows a thing the site is not doing is
      // worse than one that refused.
      setOn(!next);
      setFailed(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Hammer className="size-4 text-gold" />
            دۆخی «لە چاککردندایە»
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            هێڵێکی زێڕین لە سەرەوەی ماڵپەڕەکە دەردەکەوێت. دووکانەکان وەک خۆیان
            دەمێننەوە و گەڕان کاردەکات.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={on === true}
          aria-label="دۆخی لە چاککردندایە"
          onClick={toggle}
          disabled={on === null || saving}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
            on ? "bg-gold" : "bg-border"
          }`}
        >
          {/* start/end, not left/right: this dashboard reads right to left, so
              "on" has to travel the way the page does. */}
          <span
            className={`absolute size-5 rounded-full bg-white shadow transition-all ${
              on ? "end-1" : "start-1"
            }`}
          />
        </button>
      </div>

      <p className="mt-2.5 flex items-center gap-2 text-xs font-medium">
        {on === null || saving ? (
          <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
        ) : null}
        {on === null ? (
          <span className="text-muted-foreground">دەخوێنرێتەوە…</span>
        ) : on ? (
          <span className="text-gold">چالاکە — هێڵەکە دەردەکەوێت</span>
        ) : (
          <span className="text-muted-foreground">ناچالاکە</span>
        )}
      </p>

      {failed && (
        <p className="mt-2 text-xs text-danger">
          پاشەکەوت نەکرا. دووبارە هەوڵ بدەرەوە.
        </p>
      )}
    </div>
  );
}
