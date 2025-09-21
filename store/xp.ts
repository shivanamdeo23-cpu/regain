'use client';

import { create } from 'zustand';
import { todayKey } from '../lib/date';

export type Habit = { key: string; name: string; xp: number; fact?: string };
export type Completion = { date: string; habitKey: string };

const HABITS: Habit[] = [
  { key: 'calcium', name: 'Take Calcium', xp: 10, fact: 'Calcium keeps bones dense and strong.' },
  { key: 'walk', name: '10-min Walk', xp: 10, fact: 'Walking improves balance and strength.' },
  { key: 'vitd', name: 'Vitamin D', xp: 10, fact: 'Vitamin D helps calcium absorption.' },
  { key: 'balance', name: 'Balance Drill', xp: 15, fact: 'Balance training reduces fall risk.' },
];

interface XPState {
  habits: Habit[];
  xp: number;
  streak: number;
  completions: Completion[];
  completeHabit: (habitKey: string) => { ok: boolean; message: string };
}

export const useXP = create<XPState>((set, get) => ({
  habits: HABITS,
  xp: 0,
  streak: 0,
  completions: [],
  completeHabit: (habitKey) => {
    const date = todayKey();
    const { completions, xp, habits } = get();
    const already = completions.some(c => c.date === date && c.habitKey === habitKey);
    if (already) return { ok: false, message: 'Already logged for today.' };

    const habit = habits.find(h => h.key === habitKey);
    if (!habit) return { ok: false, message: 'Unknown habit.' };

    const newCompletions = [...completions, { date, habitKey }];
    const uniqueDays = new Set(newCompletions.map(c => c.date));
    const streak = uniqueDays.size;

    set({
      completions: newCompletions,
      xp: xp + habit.xp,
      streak,
    });

    return { ok: true, message: `+${habit.xp} XP — nice!` };
  },
}));
