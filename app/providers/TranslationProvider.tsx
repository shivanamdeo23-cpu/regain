"use client";

import React, { createContext, useContext, useState } from "react";

type Dict = Record<string, any>;

type I18nContextType = {
  locale: string;
  t: (key: string) => any;
  setLocale: (loc: string) => void;
};

const I18nContext = createContext<I18nContextType | null>(null);

const dictionary: Record<string, Dict> = {
  en: {
    common: {
      backToToday: "Back to Today",
      roadmap: "Roadmap"
    },
    future: {
      pageTitle: "Coming Soon",
      subtitle: "Ideas and features we are exploring",
      statuses: {
        planned: "Planned",
        building: "In Progress",
        research: "Research"
      },
      items: {
        socialSeasons: {
          title: "Social Seasons",
          desc: "Community-driven challenges synced to the calendar."
        },
        coach: {
          title: "AI Coach",
          desc: "Personalised tips and habit nudges."
        },
        analytics: {
          title: "Bone Analytics",
          desc: "Track risk scores, streaks, and outcomes."
        },
        healthSync: {
          title: "Health Sync",
          desc: "Connect wearables and health records."
        },
        dexa: {
          title: "DEXA Integration",
          desc: "Upload scan reports for deeper insights."
        },
        rehab: {
          title: "Rehab Mode",
          desc: "Tailored plans for post-op recovery."
        }
      }
    }
  }
};

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState("en");

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
