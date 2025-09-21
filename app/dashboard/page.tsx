'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// ---- Config: habits and XP per day ----
const HABITS = [
  { key: 'calcium',  name: 'Take Calcium',        xp: 10, fact: 'Calcium keeps bones dense and strong.' },
  { key: 'walk',     name: '10-min Walk',         xp: 10, fact: 'Walking improves balance and strengthens muscles.' },
  { key: 'sunlight', name: 'Get Sunlight',        xp: 10, fact: 'Sunlight boosts Vitamin D to absorb calcium.' },
  { key: 'balance',  name: 'Balance Exercise',    xp: 10, fact: 'Balance training lowers fall risk by ~30%.' },
] as const;

const TOTAL_TODAY_XP = HABITS.reduce((s, h) => s + h.xp, 0);

// ---- Utils: dates (local, YYYY-MM-DD) ----
function toISODateLocal(d = new Date()) {
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day   = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toISODateLocal(d);
}

type Profile = { name?: string; age?: string; condition?: string };

// ---- Storage shape ----
type DailyRecord = { completedKeys: string[] };
type SavedState = {
  xp?: number; // lifetime XP (we won’t use it for the progress bar anymore)
  streak?: number;
  lastAllCompleteDate?: string;
  daily?: Record<string, DailyRecord>;
  challenges?: Record<string, number>;
  badges?: Record<string, boolean>;
};

export default function Dashboard() {
  const router = useRouter();

  // ---- UI state ----
  const [profile, setProfile] = useState<Profile>({});
  const [lifetimeXp, setLifetimeXp] = useState(0); // kept for display only (optional)
  const [streak, setStreak] = useState(0);
  const [lastAllCompleteDate, setLastAllCompleteDate] = useState<string | undefined>(undefined);
  const [daily, setDaily] = useState<Record<string, DailyRecord>>({});
  const [message, setMessage] = useState('');

  const today = useMemo(() => toISODateLocal(), []);
  const yday  = useMemo(() => yesterdayISO(), []);

  // ---- Load saved state safely ----
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('profile');
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      const raw = localStorage.getItem('state');
      if (raw) {
        const s: SavedState = JSON.parse(raw);

        setLifetimeXp(Number.isFinite(s.xp ?? 0) ? (s.xp as number) : 0);
        setStreak(Number.isFinite(s.streak ?? 0) ? (s.streak as number) : 0);
        setLastAllCompleteDate(typeof s.lastAllCompleteDate === 'string' ? s.lastAllCompleteDate : undefined);
        setDaily(typeof s.daily === 'object' && s.daily ? s.daily : {});
      }
    } catch {
      setLifetimeXp(0);
      setStreak(0);
      setLastAllCompleteDate(undefined);
      setDaily({});
    }
  }, []);

  // ---- Ensure a record for "today" exists ----
  useEffect(() => {
    setDaily((prev) => {
      if (prev[today]) return prev;
      return { ...prev, [today]: { completedKeys: [] } };
    });
  }, [today]);

  // ---- Streak rollover on day change ----
  useEffect(() => {
    if (!daily) return;
    if (lastAllCompleteDate === undefined) return;
    if (lastAllCompleteDate === today) return;
    if (lastAllCompleteDate === yday) return;

    // Missed at least 1 day -> reset streak
    setStreak(0);
    persistState({ streak: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daily, lastAllCompleteDate, today, yday]);

  // ---- Derived: today's completion + today's XP (DERIVED ONLY) ----
  const completedTodayKeys = daily[today]?.completedKeys ?? [];
  const todaysXp = completedTodayKeys.reduce((sum, key) => {
    const h = HABITS.find(h => h.key === key);
    return sum + (h?.xp ?? 0);
  }, 0);
  const allHabitsCompletedToday = HABITS.every(h => completedTodayKeys.includes(h.key));

  // ---- Toggle habit (no lifetime XP mutation; message only) ----
  const toggleHabit = (key: string) => {
    setDaily((prev) => {
      const todayRec: DailyRecord = prev[today] ?? { completedKeys: [] };
      const isDone = todayRec.completedKeys.includes(key);

      const nextCompleted = new Set(todayRec.completedKeys);
      if (isDone) {
        nextCompleted.delete(key);
        setMessage(''); // clear message on undo
      } else {
        nextCompleted.add(key);
        const habit = HABITS.find(h => h.key === key)!;
        setMessage(habit.fact);
      }

      const updatedDaily: Record<string, DailyRecord> = {
        ...prev,
        [today]: { completedKeys: Array.from(nextCompleted) },
      };

      // Persist only daily completion; do NOT change lifetime XP here
      persistState({ daily: updatedDaily });
      return updatedDaily;
    });
  };

  // ---- Increment streak when all habits completed today for the first time ----
  useEffect(() => {
    if (!allHabitsCompletedToday) return;
    if (lastAllCompleteDate === today) return;

    const newStreak = lastAllCompleteDate === yday ? (streak + 1) : 1;
    setStreak(newStreak);
    setLastAllCompleteDate(today);
    persistState({ streak: newStreak, lastAllCompleteDate: today });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allHabitsCompletedToday, today, yday, lastAllCompleteDate, streak]);

  // ---- Persist partial state safely ----
  const persistState = (partial: Partial<SavedState>) => {
    try {
      const raw = localStorage.getItem('state');
      const current: SavedState = raw ? JSON.parse(raw) : {};
      const merged: SavedState = { ...current, ...partial };
      localStorage.setItem('state', JSON.stringify(merged));
    } catch {
      /* ignore for MVP */
    }
  };

  // ---- UI ----
  return (
    <main style={styles.page}>
      {/* Profile */}
      {profile?.name ? (
        <section style={styles.profileBox}>
          <h1>Welcome back, {profile.name}</h1>
          {profile.age && <p><strong>Age:</strong> {profile.age}</p>}
          {profile.condition && <p><strong>Focus:</strong> {profile.condition}</p>}
          <p style={styles.encourage}>Let’s keep your bones strong today.</p>
          <button style={styles.editButton} onClick={() => router.push('/profile')}>
            Edit Profile
          </button>
        </section>
      ) : (
        <h1 style={styles.title}>Dashboard</h1>
      )}

      {/* TODAY progress (derived) */}
      <div style={styles.statsBox}>
        <p><strong>Today’s XP:</strong> {todaysXp} / {TOTAL_TODAY_XP}</p>
        <ProgressBar value={todaysXp} max={TOTAL_TODAY_XP} />
        <p>Streak: {streak} day{streak === 1 ? '' : 's'}</p>
        <p style={s
