'use client';
isTaskDoneToday: (taskKey: string) => boolean;


completeHabit: (habitKey: string) => { ok: boolean; message: string };
}


const uid = () => {
if (typeof window === 'undefined') return 'anon';
const raw = localStorage.getItem('regain-user');
if (!raw) return 'anon';
try { const u = JSON.parse(raw) as User; return u?.id || 'anon'; } catch { return 'anon'; }
};


export const useXP = create<XPState>()(persist((set, get) => ({
user: null,
setUser: (u) => set({ user: u }),


habits: HABITS,
tasks: TASKS,


xp: 0,
streak: 0,
completions: [],


isTaskDoneToday: (taskKey) => {
const date = todayKey();
return get().completions.some(c => c.date === date && c.key === `${uid()}:${taskKey}` && c.type === 'task');
},


toggleTaskToday: (taskKey) => {
const date = todayKey();
const key = `${uid()}:${taskKey}`;
const { completions, tasks, xp } = get();
const exists = completions.find(c => c.date === date && c.key === key && c.type === 'task');


if (exists) {
// un‑check
const task = tasks.find(t => t.key === taskKey)!;
set({
completions: completions.filter(c => !(c.date === date && c.key === key && c.type === 'task')),
xp: Math.max(0, xp - task.xp),
});
return { ok: true, done: false, message: 'Unchecked for today.' };
}


const task = tasks.find(t => t.key === taskKey);
if (!task) return { ok: false, done: false, message: 'Unknown task.' };


const newCompletions = [...completions, { date, key, type: 'task' as const }];
const uniqueDays = new Set(newCompletions.map(c => c.date));
set({
completions: newCompletions,
xp: xp + task.xp,
streak: uniqueDays.size,
});
return { ok: true, done: true, message: `Completed — +${task.xp} XP` };
},


completeHabit: (habitKey) => {
const date = todayKey();
const { completions, xp, habits } = get();
const key = `${uid()}:${habitKey}`;
const already = completions.some(c => c.date === date && c.key === key && c.type === 'habit');
if (already) return { ok: false, message: 'Already logged for today.' };


const habit = habits.find(h => h.key === habitKey);
if (!habit) return { ok: false, message: 'Unknown habit.' };


const newCompletions = [...completions, { date, key, type: 'habit' as const }];
const uniqueDays = new Set(newCompletions.map(c => c.date));
set({
completions: newCompletions,
xp: xp + habit.xp,
streak: uniqueDays.size,
});
return { ok: true, message: `+${habit.xp} XP — nice!` };
},
}), { name: 'regain-xp' }));
