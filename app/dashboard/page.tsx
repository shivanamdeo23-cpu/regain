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
        <p style={styles.helperText}>Undoing a habit will reduce today’s XP (derived from completed habits).</p>
        {/* Optional: show lifetime XP separately if you still want it */}
        <p style={{ marginTop: 8, color: '#666' }}>Lifetime XP: {lifetimeXp}</p>
      </div>

      {/* Today’s Habits */}
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
      {message && <div style={styles.factBox}>{message}</div>}

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
