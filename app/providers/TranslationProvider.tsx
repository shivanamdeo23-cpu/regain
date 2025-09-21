'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '@/lib/i18n/en';
import hi from '@/lib/i18n/hi';

type Locale = 'en' | 'hi';
const DICTS = { en, hi };
const LS_KEY = 're_gain:locale';

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: (path: string, vars?: Record<string,string|number>) => string; };
const CtxI18n = createContext<Ctx | null>(null);

function get(obj: any, path: string) { return path.split('.').reduce((o,k)=>o?.[k], obj); }

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  useEffect(() => { const s = (localStorage.getItem(LS_KEY) as Locale) || 'en'; setLocale(s); document.documentElement.lang = s; }, []);
  useEffect(() => { localStorage.setItem(LS_KEY, locale); document.documentElement.lang = locale; }, [locale]);
  const dict = DICTS[locale];
  const t = useMemo(() => (path: string, vars?: Record<string, string | number>) => {
    let out = get(dict, path) ?? path;
    if (typeof out !== 'string') return path;
    for (const [k,v] of Object.entries(vars || {})) out = out.replace(new RegExp(`\\{${k}\\}`,'g'), String(v));
    return out;
  }, [dict]);
  return <CtxI18n.Provider value={{ locale, setLocale, t }}>{children}</CtxI18n.Provider>;
}

export function useI18n(){ const c = useContext(CtxI18n); if(!c) throw new Error('useI18n outside provider'); return c; }
