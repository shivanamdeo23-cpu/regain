'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/app/providers/TranslationProvider';

/* ---- SSR-safe helpers ---- */
const isBrowser = typeof window !== 'undefined';
const isoDay = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const STORAGE_PREFIX = 'bonehub:day:'; const kDay = (d: string) => `${STORAGE_PREFIX}${d}`;
const dateOffset = (baseISO: string, days: number) => { const dt = new Date(baseISO + 'T00:00:00'); dt.setDate(dt.getDate() + days); return isoDay(dt); };
type DayState = { date: string; tasks: Record<string, boolean> };
const loadDay = (d: string): DayState | null => { if (!isBrowser) return null; try { const raw = localStorage.getItem(kDay(d)); return raw ? JSON.parse(raw) : null; } catch { return null; } };

/* ---- UI ---- */
const Bar = ({ value, max, showPct = false }: { value: number; max: number; showPct?: boolean }) => {
  const pct = Math.max(0, Math.min(100, Math.round(((value || 0) / max) * 100)));
  return (
    <div className="w-full">
      {showPct && <div className="text-xs mb-1 text-gray-400">{pct}%</div>}
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* ---- model ---- */
type TaskKey = 'calcium' | 'vitd' | 'protein' | 'walk10' | 'hydrate2l';
type TaskWeight = { key: TaskKey; weight: number };
const TASKS: TaskWeight[] = [
  { key: 'calcium', weight: 1.0 },
  { key: 'vitd', weight: 0.8 },
  { key: 'protein', weight: 0.6 },
  { key: 'walk10', weight: 0.7 },
  { key: 'hydrate2l', weight: 0.2 },
];
const BASE_SCORE = 50, MAX_SCORE = 100, MONTHLY_GAIN_AT_100 = 8;

export default function RoadmapPage() {
  const { t } = useI18n();
  const today = isoDay();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { if (isBrowser) setHydrated(true); }, []);

  const { adherencePct, byTask } = useMemo(() => {
    if (!hydrated) return { adherencePct: 0, byTask: {} as Record<TaskKey, number> };
    const days = 28;
    const counts: Record<TaskKey, number> = { calcium: 0, vitd: 0, protein: 0, walk10: 0, hydrate2l: 0 };
    for (let i = 0; i < days; i++) {
      const dISO = dateOffset(today, -i);
      const ds = loadDay(dISO);
      if (!ds) continue;
      (Object.keys(counts) as TaskKey[]).forEach(k => { if (ds.tasks?.[k]) counts[k] += 1; });
    }
    const tw = TASKS.reduce((s, x) => s + x.weight, 0);
    const weighted = TASKS.reduce((s, x) => s + (counts[x.key] / days) * x.weight, 0);
    const adh = tw ? weighted / tw : 0;
    const per: Record<TaskKey, number> = { calcium: 0, vitd: 0, protein: 0, walk10: 0, hydrate2l: 0 };
    (Object.keys(per) as TaskKey[]).forEach(k => (per[k] = counts[k] / days));
    return { adherencePct: Math.round(adh * 100), byTask: per };
  }, [hydrated, today]);

  const project = (m: number) =>
    Math.min(MAX_SCORE, Math.round(BASE_SCORE + m * MONTHLY_GAIN_AT_100 * (adherencePct / 100)));

  const cards = [
    { label: t('common.in1'), score: project(1), copy: t('roadmap.consistent') },
    { label: t('common.in2'), score: project(2), copy: t('roadmap.compound') },
    { label: t('common.in3'), score: project(3), copy: t('roadmap.meaningful') },
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t('common.roadmap')}</h1>
        <p className="text-sm text-gray-400">{t('common.roadmapTag')}</p>
      </header>

      <section className="rounded-2xl border border-gray-800 p-4 bg-gray-900 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">{t('common.currentAdherence')}</span>
          <span className="text-lg font-semibold">{adherencePct}%</span>
        </div>
        <Bar value={adherencePct} max={100} />
        <p className="text-sm text-gray-400">{t('common.stayingAbove')}</p>
      </section>

      <section className="grid grid-cols-1 gap-3">
        {cards.map(c => (
          <div key={c.label} className="rounded-2xl border border-gray-800 p-4 bg-gray-900">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold">{c.label}</h3>
              <span className="text-xl font-bold">{c.score}</span>
            </div>
            <p className="text-sm text-gray-300">{c.copy}</p>
            <div className="mt-3">
              <Bar value={c.score} max={100} showPct />
            </div>
            <p className="mt-1 text-xs text-gray-500">{t('roadmap.assuming')}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-800 p-4 bg-gray-900 space-y-3">
        <h3 className="font-semibold">{t('common.focus')}</h3>
        {(Object.keys(byTask) as TaskKey[]).map(k => {
          const pct = Math.round((byTask[k] ?? 0) * 100);
          return (
            <div key={k} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t(`tasks.${k}`)}</span>
                <span className="text-sm font-medium">{pct}%</span>
              </div>
              <Bar value={pct} max={100} />
            </div>
          );
        })}
      </section>

      <nav className="flex justify-center gap-3 text-sm text-gray-400">
        <a className="underline" href="/daily">{t('common.backToToday')}</a>
        <span>·</span>
        <a className="underline" href="/premium">{t('common.seePremium')}</a>
        <span>·</span>
        <a className="underline" href="/future">{t('common.viewFuture')}</a>
      </nav>
    </main>
  );
}
