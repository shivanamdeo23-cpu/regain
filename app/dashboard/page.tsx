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

// ---- Utils: dates (local, YYYY-MM-DD) ----
function toISODateLocal(d = new Date()) {
  // ISO date in local tz (YYYY-MM-DD). Works without server timezone assumptions.
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

// ---- Storage shape (kept minimal & robust) ----
// xp: number (lifetime XP)
// streak: number (current streak count)
// lastAllCompleteDate: string | undefined (YYYY-MM-DD when ALL habits were completed most recently)
// daily: { [dateISO]: { completedKeys: string[] } }  // only store today and maybe a couple recent days (we'll keep it bounded)

type DailyRecord = { completedKeys: string[] };
type SavedState = {
  xp?: number;
  streak?: number;
  lastAllCompleteDate?: string;
  daily?: Record<string, DailyRecord>;
  challenges?: Record<string, number>; // optional, used elsewhere
  badges?: Record<string, boolean>;    // optional, used elsewhere
};

export default function Dashboard() {
  const router = useRouter();

  // ---- UI state ----
  const [profile, setProfile] = useState<Profile>({});
  const [xp, setXp] = useState(0);
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

        // Defensive defaults
        setXp(Number.isFinite(s.xp ?? 0) ? (s.xp as number) : 0);
        setStreak(Number.isFinite(s.streak ?? 0) ? (s.streak as number) : 0);
        setLastAllCompleteDate(
          typeof s.lastAllCompleteDate === 'string' ? s.lastAllCompleteDate : undefined
        );
        setDaily(typeof s.daily === 'object' && s.daily ? s.daily : {});
      }
    } catch {
      // Corrupt storage? Start clean, but don't crash UI.
      setXp(0);
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

  // ---- Streak rollover on day change (runs once when we know 'daily' + 'lastAllCompleteDate') ----
  useEffect(() => {
    if (!daily) return;

    // If last-all-complete was yesterday, we *keep* streak as-is.
    // If it was today, we're fine.
    // If it was neither yesterday nor today (i.e., user missed a day), streak resets.
    if (lastAllCompleteDate === undefined) return; // first run, leave as-is
    if (lastAllCompleteDate === today) return;     // already completed today => streak valid
    if (lastAllCompleteDate === yday) return;      // completed yesterday => streak still valid

    // Missed at least 1 day -> reset streak
    // (Do not alter lastAllCompleteDate here; it reflects last time they actually finished.)
    setStreak(0);
    // Persist reset
    persistState({ streak: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daily, lastAllCompleteDate, today, yday]);

  // ---- Derived helpers ----
  const completedTodayKeys = daily[today]?.completedKeys ?? [];
  const allHabitsCompletedToday = HABITS.every(h => completedTodayKeys.includes(h.key));

  // ---- Toggle habit (one-time XP per habit per day; no XP deduction) ----
  const toggleHabit = (key: string) => {
    setDaily((prev) => {
      const todayRec: DailyRecord = prev[today] ?? { completedKeys: [] };
      const isDone = todayRec.completedKeys.includes(key);

      // Copy to mutate safely
      const nextCompleted = new Set(todayRec.completedKeys);

      // If not done yet today -> mark complete and award XP once
      if (!isDone) {
        nextCompleted.add(key);

        // Award XP for this habit once today
        const habit = HABITS.find(h => h.key === key)!;
        const newXP = (xp ?? 0) + habit.xp;
        setXp(newXP);
        setMessage(habit.fact);
        // Persist XP immediately
        persistState({ xp: newXP });
      } else {
        // Allow untick for user control, but do NOT subtract XP
        nextCompleted.delete(key);
        // Clear motivation message if they undo
        setMessage('');
      }

      const updatedDaily: Record<string, DailyRecord> = {
        ...prev,
        [today]: { completedKeys: Array.from(nextCompleted) },
      };

      // Persist daily immediately
      persistState({ daily: updatedDaily });

      return updatedDaily;
    });
  };

  // ---- When all habits are completed today for the *first* time, increment streak once ----
  useEffect(() => {
    if (!allHabitsCompletedToday) return;

    // Only increment if we haven't already recorded "today" as all-complete
    if (lastAllCompleteDate === today) return;

    const newStreak =
      lastAllCompleteDate === yday ? (streak + 1) : 1; // continue streak if finished yesterday; else start at 1

    setStreak(newStreak);
    setLastAllCompleteDate(today);

    // Persist streak + lastAllCompleteDate
    persistState({ streak: newStreak, lastAllCompleteDate: today });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allHabitsCompletedToday, today, yday, lastAllCompleteDate, streak]);

  // ---- Persist partial state safely (merge into existing SavedState) ----
  const persistState = (partial: Partial<SavedState>) => {
    try {
      const raw = localStorage.getItem('state');
      const current: SavedState = raw ? JSON.parse(raw) : {};
      const merged: SavedState = { ...current, ...partial };
      localStorage.setItem('state', JSON.stringify(merged));
    } catch {
      // ignore write failures silently for MVP, could add UI toast later
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

      {/* XP / Level / Streak */}
      <div style={styles.statsBox}>
        <p>XP: {xp} / 100</p>
        <ProgressBar value={xp % 100} max={100} />
        <p>Level {Math.floor(xp / 100) + 1}</p>
        <p>Streak: {streak} day{streak === 1 ? '' : 's'}</p>
        <p style={styles.helperText}>
          Complete all habits today to continue your streak.
        </p>
      </div>

      {/* Today’s Habits (one-time XP per habit per day) */}
      <h2 style={styles.subtitle}>Today’s Habits ({today})</h2>
      <ul style={styles.list}>
        {HABITS.map((h) => {
          const done = completedTodayKeys.includes(h.key);
          return (
            <li key={h.key} style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => toggleHabit(h.key)}
                style={{
                  ...styles.habitButton,
                  background: done ? '#4CAF50' : '#fff',
                  color: done ? '#fff' : '#000',
                }}
              >
                {done ? `✓ ${h.name}` : h.name}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Motivational / Evidence “Why” */}
      {message && (
        <div style={styles.factBox}>
          {message}
        </div>
      )}

      {/* Celebration when all complete */}
      {allHabitsCompletedToday && (
        <div style={styles.summaryBox}>
          Brilliant! You’ve completed all habits today. Your bones will thank you.
        </div>
      )}
    </main>
  );
}

// ---- Reusable progress bar ----
function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={styles.progressOuter}>
      <div style={{ ...styles.progressInner, width: `${pct}%` }} />
    </div>
  );
}

// ---- Styles ----
const styles: { [k: string]: React.CSSProperties } = {
  page: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', background: '#f9f9f9', minHeight: '100vh', fontSize: '1.15rem' },
  title: { fontSize: '2rem', marginBottom: '1.5rem' },
  profileBox: { background: '#fff', padding: '1.5rem', borderRadius: 12, border: '2px solid #ddd', marginBottom: '2rem', textAlign: 'center', maxWidth: 520, width: '100%' },
  encourage: { marginTop: '0.75rem', fontWeight: 600, color: '#2d6a2d' },
  editButton: { marginTop: '1rem', padding: '0.6rem 1.2rem', borderRadius: 8, border: 'none', background: '#0070f3', color: '#fff', cursor: 'pointer', fontSize: '1rem' },

  statsBox: { textAlign: 'center', marginBottom: '2rem', background: '#fff', padding: '1rem 2rem', borderRadius: 12, border: '2px solid #ddd', width: '100%', maxWidth: 520 },
  helperText: { marginTop: '0.5rem', color: '#555', fontSize: '0.95rem' },

  subtitle: { fontSize: '1.5rem', marginTop: '1rem', marginBottom: '1rem' },
  list: { listStyle: 'none', padding: 0 },

  habitButton: { fontSize: '1.2rem', padding: '0.8rem 1.2rem', borderRadius: 12, border: '2px solid #333', cursor: 'pointer', width: 280, textAlign: 'center' },

  factBox: { marginTop: '1.5rem', padding: '1rem', border: '2px solid #4CAF50', borderRadius: 12, background: '#eaffea', color: '#2d6a2d', fontWeight: 600, maxWidth: 520, textAlign: 'center' },
  summaryBox: { marginTop: '1.5rem', padding: '1rem', border: '2px solid #333', borderRadius: 12, background: '#ffe680', fontWeight: 700, textAlign: 'center', maxWidth: 520 },

  progressOuter: { width: '100%', maxWidth: 520, height: 24, background: '#e2e2e2', borderRadius: 12, overflow: 'hidden', marginTop: 6, marginBottom: 6 },
  progressInner: { height: '100%', background: '#4CAF50', transition: 'width 0.35s ease' },
};
