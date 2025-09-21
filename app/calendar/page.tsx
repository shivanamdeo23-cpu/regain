'use client';
import { useMemo, useState } from 'react';
import { useXP } from '../../store/xp';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay } from './date-utils';


export default function CalendarPage() {
const { completions, user } = useXP();
const [month, setMonth] = useState(new Date());


const days = useMemo(() => {
const start = startOfMonth(month);
const end = endOfMonth(month);
const all = eachDayOfInterval({ start, end });
const pad = Array.from({ length: getDay(start) }, () => null);
return [...pad, ...all];
}, [month]);


const byDate = useMemo(() => {
const map = new Map<string, number>();
for (const c of completions) {
map.set(c.date, (map.get(c.date) || 0) + 1);
}
return map;
}, [completions]);


const isPremium = Boolean(user?.premium);


return (
<div className="space-y-6">
<div className="flex items-center justify-between">
<h1 className="h1">Your Calendar</h1>
<div className="flex gap-2">
<button className="btn-ghost" onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth()-1, 1))}>Prev</button>
<button className="btn-ghost" onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth()+1, 1))}>Next</button>
</div>
</div>


<div className="card p-5">
<div className="grid grid-cols-7 gap-2 text-center text-white/70 text-sm mb-2">
{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
</div>
<div className="grid grid-cols-7 gap-2">
{days.map((d, i) => {
if (!d) return <div key={`pad-${i}`} />;
const key = format(d, 'yyyy-MM-dd');
const count = byDate.get(key) || 0;
const bg = count === 0 ? 'bg-white/5' : count < 3 ? 'bg-white/20' : 'bg-white/40';
return (
<div key={key} className={`aspect-square rounded-lg flex items-center justify-center ${bg}`}>
<div>
<div className="text-xs text-white/70 text-center">{d.getDate()}</div>
{count > 0 && <div className="text-[10px]">{count} ✓</div>}
</div>
</div>
);
})}
</div>
</div>


{!isPremium && (
<div className="card p-5">
<div className="h3 mb-1">Premium insights</div>
<p className="muted">Upgrade to see weekly adherence %, best/worst days, task breakdowns, and smart suggestions.</p>
</div>
)}


{isPremium && (
<div className="card p-5 space-y-2">
<div className="h3">Insights</div>
<ul className="list-disc pl-5 text-white/90">
<li>Weekly adherence: {/* simple placeholder */} {(Array.from(byDate.values()).filter(v=>v>0).length / Math.max(1, byDate.size) * 100).toFixed(0)}%</li>
<li>Most consistent weekday: {/* naive */} computed from completions in future iteration</li>
<li>Top tasks: coming soon</li>
</ul>
</div>
)}
</div>
);
}
