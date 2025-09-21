'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useMemo, useState } from 'react';

type Task = { key: string; weight: number; label: string };
const TASKS: Task[] = [
  { key: 'calcium',   weight: 1.0, label: 'Calcium' },
  { key: 'vitd',      weight: 0.8, label: 'Vitamin D' },
  { key: 'protein',   weight: 0.6, label: 'Protein' },
  { key: 'walk10',    weight: 0.7, label: 'Walk' },
  { key: 'hydrate2l', weight: 0.2, label: 'Hydration' },
];

// basic model params (tweak as you like)
const BASE_SCORE = 50;                      // starting “Bone Health Score”
const MAX_SCORE = 100;
const MONTHLY_GAIN_AT_100_ADHERENCE = 8;    // points/month if perfect adherence

const isBrowser = typeof window !== 'undefined';
const isoDay = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const STORAGE_PREFIX = 'bonehub:day:';
const kDay = (dateStr: string) => `${STORAGE_PREFIX}${dateStr}`;
const dateOffset = (baseISO: string, days: number) => {
  const d = new Date(baseISO + 'T00:00:00'); d.setDate(d.getDate() + days); 
  return isoDay(d);
};

type DayState = { date: string; tasks: Record<string, boolean> };

const loadDay = (dateStr: string): DayState | null => {
  if (!isBrowser) return null;
  try { const raw = localStorage.getItem(kDay(dateStr)); return raw ? JSON.parse(raw) as DayState : null; }
  catch { return null; }
};

const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-600 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
};

export default function RoadmapPage() {
  const today = isoDay();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { if (isBrowser) setHydrated(true); }, []);

  // compute adherence over last 28 days (weighted)
  const { adherencePct, byTask } = useMemo(() => {
    if (!hydrated) return { adherencePct: 0, byTask: {} as Record<string, number> };

    const days = 28;
    const counts: Record<string, number> = Object.fromEntries(TASKS.map(t => [t.key, 0]));
    for (let i = 0; i < days; i++) {
      const dISO = dateOffset(today, -i);
      const ds = loadDay(dISO);
      if (!ds) continue;
      for (const t of TASKS) if (ds.tasks?.[t.key]) counts[t.key] += 1;
    }

    // weighted adherence (per-task rate * weight)
    const totalWeight = TASKS.reduce((s, t) => s + t.weight, 0);
    const weighted = TASKS.reduce((s, t) => {
      const rate = counts[t.key] / days; // 0..1
      return s + rate * t.weight;
    }, 0);
    const adherence = totalWeight ? (weighted / totalWeight) : 0;

    const perTaskRate: Record<string, number> = {};
    TASKS.forEach(t => perTaskRate[t.key] = counts[t.key] / days);

    return { adherencePct: Math.round(adherence * 100), byTask: perTaskRate };
  }, [hydrated, today]);

  // simple projection curve
  const project = (months: number) => {
    // linear gain scaled by adherence; clamp to MAX_SCORE
    const gain = months * MONTHLY_GAIN_AT_100_ADHERENCE * (adherencePct / 100);
    return Math.min(MAX_SCORE, Math.round(BASE_SCORE + gain));
  };

  const cards = [
    { label: 'In 1 month',  score: project(1),  copy: 'Consistent habits begin to raise your baseline.' },
    { label: 'In 2 months', score: project(2),  copy: 'Bone & muscle adaptations compound with steady effort.' },
    { label: 'In 3 months', score: project(3),  copy: 'Meaningful improvement—keep the streak alive.' },
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Your Roadmap</h1>
        <p className="text-sm text-gray-600">
          Projections use your last 28 days of completion to estimate future improvement.
        </p>
      </header>

      {/* Overall adherence */}
      <section className="rounded-2xl border border-gray-200 p-4 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current adherence</span>
          <span className="text-lg font-semibold">{adherencePct}%</span>
        </div>
        <ProgressBar value={adherencePct} max={100} />
        <p className="text-sm text-gray-600">
          Staying above 70% steadily pushes your score upward.
        </p>
      </section>

      {/* Timeline cards */}
      <section className="grid grid-cols-1 gap-3">
        {cards.map(c => (
          <div key={c.label} className="rounded-2xl border border-gray-200 p-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{c.label}</h3>
              <span className="text-xl font-bold">{c.score}</span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{c.copy}</p>
            <div className="mt-3">
              <ProgressBar value={c.score} max={100} />
            </div>
          </div>
        ))}
      </section>

      {/* Per-habit insight */}
      <section className="rounded-2xl border border-gray-200 p-4 bg-white space-y-3">
        <h3 className="font-semibold">Where to focus</h3>
        {TASKS.map(t => {
          const pct = Math.round((byTask[t.key] ?? 0) * 100);
          return (
            <div key={t.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t.label}</span>
                <span className="text-sm font-medium">{pct}%</span>
              </div>
              <ProgressBar value={pct} max={100} />
            </div>
          );
        })}
        <p className="text-sm text-gray-600">
          Boosting
