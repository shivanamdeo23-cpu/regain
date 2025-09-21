"use client";

import React, { createContext, useContext, useState } from "react";
import en from "@/i18n/en";
import hi from "@/i18n/hi";

type Dict = Record<string, any>;

type I18nContextType = {
  locale: string;
  t: (key: string) => any;
  setLocale: (loc: string) => void;
};

const I18nContext = createContext<I18nContextType | null>(null);

const dictionary: Record<string, Dict> = { en, hi };

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<keyof typeof dictionary>("en");

  const t = (key: string): any => {
    const parts = key.split(".");
    let result: any = dictionary[locale];
    for (const p of parts) {
      result = result?.[p];
      if (!result) break;
    }
    return result ?? key;
  };

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within TranslationProvider");
  return ctx;
}
