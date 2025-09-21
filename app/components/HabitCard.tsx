'use client';
import { useState } from 'react';
import { useXP } from '../../store/xp';

export default function HabitCard({ habitKey }: { habitKey: string }) {
  const { habits, completeHabit } = useXP();
  const habit = habits.find(h => h.key === habitKey)!;
  const [busy, setBusy] = useState(false);

  const onClick = () => {
    if (busy) return;
    setBusy(true);
    const res = completeHabit(habit.key);
    alert(res.message);
    setTimeout(() => setBusy(false), 400);
  };

  return (
    <div className="card p-4 flex items-start gap-4">
      <div className="flex-1">
        <div className="h3">{habit.name}</div>
        {habit.fact && <p className="muted mt-1">{habit.fact}</p>}
      </div>
      <button disabled={busy} onClick={onClick} className="btn-primary whitespace-nowrap">
        {busy ? '…' : `Do (+${habit.xp})`}
      </button>
    </div>
  );
}
