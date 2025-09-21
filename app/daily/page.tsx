'use client';

export const dynamic = 'force-dynamic'; // avoid build-time prerender for this page
// export const revalidate = 0; // (optional) also ensures no caching

import React, { useEffect, useMemo, useState } from 'react';

// ===== Config =====
type Task = { key: string; name: string; xp: number; why?: string };
const TASKS: Task[] = [
  { key: 'calcium',  name: 'Take Calcium',        xp: 10, why: 'Supports bone density.' },
  { key: 'walk10',   name: '10-min Walk',         xp: 10, why: 'Improves balance & strength.' },
  { key: 'hydrate2l',name: 'Drink 2L Water',      xp: 10, why: 'Good for cartilage & discs.' },
  { key: 'protein',  name: 'Protein-rich Meal',   xp: 10, why: 'Builds muscle to support bone.' },
  { key: 'vitd',     name: 'Vitamin D (safe sun / tabs)', xp: 10, why: 'Helps absorb calcium.' },
];

const DAILY_XP_GOAL = 100;
const WEEKLY_GOALS = [
  { key: 'walk10',  target: 5, label: 'Walks this week' },
  { key: 'calcium', target: 7, label: 'Calcium days' },
];

// ===== Safe helpers (SSR-proof) =====
const isBrowser = typeof window !== 'undefined';

const isoDay = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

const STORAGE_PREFIX = 'bonehub:day:';
const kDay = (dateStr: string) => `${STORAGE_PREFIX}${dateStr}`;

type DayState = { date: string; tasks: Record<string, boolean> };

const emptyDay = (dateStr: string): DayState => ({
  date: dateStr,
  tasks: Object.fromEntries(TASKS.map(t => [t.key, false])),
});

const loadDay = (dateStr: string): DayState | null => {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(kDay(dateStr));
    return raw ? (JSON.parse(raw) as DayState) : null;
  } catch {
    return null;
  }
};

const saveDay = (state: DayState) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(kDay(state.date), JSON.stringify(state));
  } catch {}
};

const dateOffset = (baseISO: string, days: number) => {
  const d = new Date(baseISO + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return isoDay(d);
};

// ===== UI bits =====
const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-600 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
};

const PaywallTeaser = () => (
  <div className="rounded-2xl border border-gray-200 p-4 bg-white">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold">Friends & Family Leaderboard</h3>
      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Premium</span>
    </div>
    <div className="relative">
      <div className="h-28 rounded-xl bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="p-4 opacity-40">
          <div className="flex justify-between text-sm">
            <span>Cat</span><span>420 XP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shiva</span><span>390 XP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Ma</span><span>360 XP</span>
          </div>
        </div>
      </div>
      <button
        className="mt-3 w-full rounded-xl bg-indigo-600 text-white py-2 text-sm font-medium hover:bg-indigo-700"
        onClick={() => alert('Upgrade flow goes here')}
      >
        Unlock Leaderboard
      </button>
    </div>
  </div>
);

// ===== Page =====
export default function DailyPage() {
  const today = isoDay();

  // IMPORTANT: initialize without touching localStorage (SSR-safe)
  const [day, setDay] = useState<DayState>(emptyDay(today));
  const [hydrated, setHydrated] = useState(false);

  // On client, hydrate from localStorage once
  useEffect(() => {
    if (!isBrowser) return;
    const stored = loadDay(today);
    if (stored) setDay(stored);
    setHydrated(true);
  }, [today]);

  // Persist whenever state changes (client only)
  useEffect(() => {
    if (!isBrowser) return;
    saveDay(day);
  }, [day]);

  // Derived values (safe either way)
  const xp = useMemo(
    () => TASKS.reduce((sum, t) => sum + (day.tasks[t.key] ? t.xp : 0), 0),
    [day]
  );

  const weeklyCounts = useMemo(() => {
    const counts: Record<string, number> = Object.fromEntries(TASKS.map(t => [t.key, 0]));
    // last 7 days incl. today
    for (let i = 0; i < 7; i++) {
      const dISO = dateOffset(day.date, -i);
      const ds = loadDay(dISO);
      if (!ds) continue;
      TASKS.forEach(t => { if (ds.tasks?.[t.key]) counts[t.key] += 1; });
    }
    return counts;
  }, [day.date, hydrated]); // recalc after hydration

  const streak = useMemo(() => {
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const dISO = dateOffset(day.date, -i);
      const ds = loadDay(dISO);
      if (!ds) break;
      const anyDone = Object.values(ds.tasks ?? {}).some(Boolean);
      if (anyDone) s += 1; else break;
    }
    return s;
  }, [day.date, hydrated]);

  const pretty = new Date(day.date).toLocaleDateString(undefined, {
    weekday: 'long', month: 'short', day: 'numeric'
  });

  const setTask = (key: string, done: boolean) =>
    setDay(prev => ({ ...prev, tasks: { ...prev.tasks, [key]: done } }));

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Today</h1>
          <span className="text-sm text-gray-500">{pretty}</span>
        </div>
        <div className="rounded-2xl border border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Daily XP</div>
              <div className="text-xl font-semibold">{xp} / {DAILY_XP_GOAL}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Streak</span>
              <span className="text-sm font-semibold">{streak} 🔥</span>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar value={xp} max={DAILY_XP_GOAL} />
            <p className="mt-2 text-sm text-gray-600">
              {xp >= DAILY_XP_GOAL
                ? 'Daily goal crushed — keep going for bonus XP!'
                : `You’re ${Math.max(0, DAILY_XP_GOAL - xp)} XP away from today’s goal.`}
            </p>
          </div>
        </div>
      </header>

      {/* Tasks */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Today’s Tasks</h2>
        {TASKS.map(t => {
          const done = !!day.tasks[t.key];
          return (
            <div key={t.key} className="rounded-2xl border border-gray-200 p-4 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-xs rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5">+{t.xp} XP</span>
                  </div>
                  {t.why && <p className="mt-1 text-sm text-gray-600">{t.why}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${done ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
                    onClick={() => setTask(t.key, true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${!done ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-gray-700 border-gray-300'}`}
                    onClick={() => setTask(t.key, false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Weekly Goal */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Weekly Goal</h2>
        <div className="rounded-2xl border border-gray-200 p-4 bg-white space-y-4">
          {WEEKLY_GOALS.map(g => {
            const progress = weeklyCounts[g.key] ?? 0;
            return (
              <div key={g.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{g.label}</span>
                  <span className="text-sm font-medium">{progress} / {g.target}</span>
                </div>
                <ProgressBar value={progress} max={g.target} />
              </div>
            );
          })}
          <p className="text-sm text-gray-600">
            Tip: completing today’s tasks pushes you towards weekly wins and keeps your streak alive.
          </p>
        </div>
      </section>

      {/* Paywalled Leaderboard */}
      <PaywallTeaser />

      <nav className="flex justify-center gap-3 text-sm text-gray-600">
        <a className="underline" href="/tasks">All tasks</a>
        <span>·</span>
        <a className="underline" href="/friends">Invite friends</a>
        <span>·</span>
        <a className="underline" href="/profile">Profile</a>
      </nav>
    </main>
  );
}
