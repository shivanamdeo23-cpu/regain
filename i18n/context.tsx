"use client";

import React, { createContext, useContext, useState } from "react";

type I18nContextType = {
  locale: string;
  t: (key: string) => string;
  setLocale: (loc: string) => void;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState("en");

  // super minimal translations (expand later)
  const dictionary: Record<string, Record<string, string>> = {
    en: {
      hello: "Hello",
      future: "This is the future page"
    },
    es: {
      hello: "Hola",
      future: "Esta es la página del futuro"
    }
  };

  const t = (key: string) => {
    return dictionary[locale]?.[key] ?? key;
  };

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
