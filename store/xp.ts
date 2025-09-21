'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { todayKey } from '../lib/date';

export type Habit = { key: string; name: string; xp: number; fact?: string };
export type Task = { key: string; title: string; why: string; xp: number };
export type Completion = { date: string; key: string; type: 'habit' | 'task' };

export const TASKS: Task[] = [
  { key: 'walk10',   title: 'Brisk walk 10 minutes',        why: 'Weight-bearing impact helps maintain bone strength.', xp: 10 },
  { key: 'sit2stand',title: '15× sit-to-stand',             why: 'Strengthens quads and hips; supports balance.', xp: 10 },
  { key: 'balance',  title: 'Balance: 30s one-leg each',    why: 'Improves stability and reduces fall risk.', xp: 10 },
  { key: 'stairs',   title: 'Climb 3 flights of stairs',    why: 'Adds brief load; improves leg strength.', xp: 10 },
  { key: 'calcium',  title: '2 calcium-rich servings',      why: 'Dietary calcium supports bone mineralisation.', xp: 10 },
  { key: 'vitd',     title: 'Vitamin D taken today',        why: 'Supports calcium absorption. Follow your clinician’s advice.', xp: 10 },
  { key: 'protein',  title: 'Protein at each main meal',    why: 'Adequate protein supports bone and muscle repair.', xp: 10 },
  { key: 'sun',      title: '15 min daylight exposure',     why: 'Supports vitamin D synthesis (consider skin & sun safety).', xp: 5 },
  { key: 'alcohol',  title: '≤ 2 units alcohol',            why: 'Lower alcohol intake is better for bone and fall risk.', xp: 5 },
  { key: 'smoke',    title: 'Smoke-free day',               why: 'Smoking is linked with lower bone density.', xp: 10 },
];

const HABITS: Habit[] = [
  { key: 'calcium', name: 'Take Calcium', xp: 10, fact: 'Calcium keeps bones dense and strong.' },
  { key: 'walk', name: '10-min Walk', xp: 10, fact: 'Walking improves balance and strength.' },
  { key: 'vitd', name: 'Vitamin D', xp: 10, fact: 'Vitamin D helps calcium absorption.' },
  { key: 'balance', name: 'Balance Drill', xp: 15, fact: 'Balance training reduces fall risk.' },
];

export type User = { id: string; name: string; premium: boolean } | null;

interface XPState {
  user: User;
  setUser: (u: User) => void;

  habits: Habit[];
  tasks: Task[];

  xp: number;
  streak: number;
  completions: Completion[];

  toggleTaskToday: (taskKey: string) => { ok: boolean; done: boolean; message: string };
  isTaskDoneToday: (taskKey: string) => boolean;

  completeHabit: (habitKey: string) => { ok: boolean; message: string };
}

const uid = () => {
  if (typeof window === 'undefined') return 'anon';
  const raw = localStorage.getItem('regain-user');
  if (!raw) return 'anon';
  try { const u = JSON.parse(raw) as User; return u?.id || 'anon'; } catch { return 'anon'; }
};

export const useXP = create<XPState>()
