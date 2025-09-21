'use client';
import HabitCard from '../components/HabitCard';
import { useXP } from '../../store/xp';


export default function Dashboard() {
  const { habits, xp, streak } = useXP();
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="muted">Total XP</div>
          <div className="h2">{xp}</div>
        </div>
        <div className="card p-5">
          <div className="muted">Streak</div>
          <div className="h2">{streak} days</div>
        </div>
        <div className="card p-5">
          <div className="muted">Today</div>
          <div className="h2">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {habits.map(h => (
          <HabitCard key={h.key} habitKey={h.key} />
        ))}
      </div>
    </div>
  );
}
