"use client";

import { useI18n } from "../i18n/context";

export default function FuturePage() {
  const { t, locale, setLocale } = useI18n();

  return (
    <div className="space-y-6">
      <h1 className="h1">{t("future")}</h1>
      <p className="muted">{t("hello")}, your current locale is {locale}.</p>

      <div className="flex gap-2">
        <button className="btn-ghost" onClick={() => setLocale("en")}>
          English
        </button>
        <button className="btn-ghost" onClick={() => setLocale("es")}>
          Español
        </button>
      </div>
    </div>
  );
}
