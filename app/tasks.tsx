'use client';
import { useXP } from '../../store/xp';


export default function TasksPage() {
const { tasks, toggleTaskToday, isTaskDoneToday } = useXP();


return (
<div className="space-y-6">
<div className="flex items-center justify-between">
<h1 className="h1">Today’s Tasks</h1>
<div className="badge">Simple Yes / No</div>
</div>


<div className="grid md:grid-cols-2 gap-4">
{tasks.map(t => {
const done = isTaskDoneToday(t.key);
return (
<div key={t.key} className={`card p-5 ${done ? 'ring-2 ring-white/60' : ''}` }>
<div className="flex items-start justify-between gap-4">
<div>
<div className="h3">{t.title}</div>
<p className="muted mt-1 max-w-prose">{t.why}</p>
</div>
<button
className={done ? 'btn-ghost' : 'btn-primary'}
onClick={() => toggleTaskToday(t.key)}
>
{done ? 'Undo' : 'Yes'}
</button>
</div>
</div>
);
})}
</div>
</div>
);
}
