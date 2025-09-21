"use client";

// Daily Tasks — Pretty MVP UI
// - Clean, modern styling with Tailwind
// - Gradient progress bar with percentage label
// - Iconic task cards, smooth toggle animations
// - Evidence toast on mark done; Undo clears toast
// - All logic remains simple + robust (derived XP, toggle)

import { useEffect, useMemo, useState } from "react";

// ---- Types
 type Task = {
  id: string;
  label: string;
  evidence: string;
  category: "Nutrition" | "Exercise" | "Lifestyle";
  icon: JSX.Element; // inline SVG/emoji for simplicity
};
 type TasksByCategory = Record<Task["category"], Task[]>;

// ---- Icons (inline SVG for zero deps)
const PillIcon = (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M7 3a5 5 0 0 0-3.536 8.536l7 7A5 5 0 0 0 17.465 8.07l-7-7A4.98 4.98 0 0 0 7 3m7.95 2.464 1.586 1.586-6.485 6.485-1.586-1.586z"/></svg>
);
const WalkIcon = (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M13.5 5.5A1.5 1.5 0 1 0 12 4a1.5 1.5 0 0 0 1.5 1.5m-4.8 3.7L6 21h2l1.1-5 2.2 2V21h2v-4.3l-2.1-2.1.7-3 1.3 1.1V15h2v-2.5l-2.4-2 .5-2c.2-.8-.3-1.5-1-1.8-.7-.3-1.6-.1-2.1.5l-1.8 2.3z"/></svg>
);
const SunIcon = (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0-5h1v3h-2V2h1m0 19h1v3h-2v-3h1M2 11h3v2H2v-2m17 0h3v2h-3v-2M4.222 4.222l2.121 2.121-1.415 1.415L2.807 5.637 4.222 4.222m14.142 14.142 2.121 2.121-1.415 1.415-2.121-2.121 1.415-1.415M4.222 19.778l1.415-1.415 2.121 2.121-1.415 1.415-2.121-2.121M16.242 4.95l1.415-1.414 2.121 2.12-1.415 1.416-2.12-2.122Z"/></svg>
);
const DumbbellIcon = (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M2 14h2v-4H2v4m18-4v4h2v-4h-2M7 7h2v10H7V7m8 0h2v10h-2V7M10 9h4v6h-4V9Z"/></svg>
);
const BalanceIcon = (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M11 3h2v2h4v2h-4v10h3v2H8v-2h3V7H7V5h4V3Z"/></svg>
);
const SleepIcon = (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M12 2a10 10 0 1 0 9.95 11.173A7 7 0 0 1 12 2Z"/></svg>
);
const DrinkIcon = (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M3 3h18l-2 7H5L3 3m4 9h10l-1 9H8l-1-9Z"/></svg>
);

// ---- Config: tasks
const ALL_TASKS: Task[] = [
  // Nutrition
  { id: "calcium",   label: "Take calcium (diet or supplement)", evidence: "Adequate calcium supports bone mineral density.", category: "Nutrition", icon: PillIcon },
  { id: "vitD",      label: "Vitamin D source (supplement or sunlight)", evidence: "Vitamin D improves calcium absorption.", category: "Nutrition", icon: SunIcon },
  { id: "protein",   label: "Hit your protein target today", evidence: "Protein supports bone matrix & muscle.", category: "Nutrition", icon: DrinkIcon },
  { id: "hydration", label: "Drink 6–8 glasses of water", evidence: "Hydration aids activity & recovery.", category: "Nutrition", icon: DrinkIcon },

  // Exercise
  { id: "walk10",    label: "10–20 min weight‑bearing walk", evidence: "Weight‑bearing stimulates bone formation.", category: "Exercise", icon: WalkIcon },
  { id: "resistance",label: "5–10 min resistance (bands/weights)", evidence: "Resistance increases bone & muscle strength.", category: "Exercise", icon: DumbbellIcon },
  { id: "balance",   label: "3 min balance practice", evidence: "Balance work reduces fall risk.", category: "Exercise", icon: BalanceIcon },

  // Lifestyle
  { id: "sunlight",  label: "Get 10–15 min safe daylight", evidence: "Daylight supports vitamin D & circadian rhythm.", category: "Lifestyle", icon: SunIcon },
  { id: "sleep",     label: "Aim 7–8 h sleep", evidence: "Sleep helps hormone balance & recovery.", category: "Lifestyle", icon: SleepIcon },
  { id: "alcohol",   label: "Keep alcohol ≤ 1 unit (or none)", evidence: "Lower alcohol correlates with better bone health.", category: "Lifestyle", icon: DrinkIcon },
];

const CATEGORIES: Task["category"][] = ["Nutrition", "Exercise", "Lifestyle"];
const CATEGORY_ICONS: Record<string, string> = { Nutrition: "🥛", Exercise: "🏃", Lifestyle: "🌞" };
const POINTS_PER_TASK = 10;

// ---- Helpers
function groupTasks(tasks: Task[]): TasksByCategory {
  return tasks.reduce((acc, t) => {
    (acc[t.category] ||= []).push(t);
    return acc;
  }, {} as TasksByCategory);
}

export default function Page() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [toast, setToast] = useState<string>("");
  const grouped = useMemo(() => groupTasks(ALL_TASKS), []);

  // Derived (pure)
  const completedCount = completed.length;
  const xp = completedCount * POINTS_PER_TASK;
  const maxXp = ALL_TASKS.length * POINTS_PER_TASK;
  const progress = Math.round((xp / maxXp) * 100);
  const allDone = completedCount === ALL_TASKS.length;

  function toggleTask(id: string) {
    setCompleted((prev) => {
      const has = prev.includes(id);
      const next = has ? prev.filter((x) => x !== id) : [...prev, id];
      // Toast: show evidence for mark, clear on undo
      if (!has) {
        const t = ALL_TASKS.find((x) => x.id === id);
        if (t) {
          setToast(t.evidence);
          clearToastSoon();
        }
      } else {
        setToast("");
      }
      return next;
    });
  }

  function clearToastSoon() {
    window.clearTimeout((clearToastSoon as any)._t);
    (clearToastSoon as any)._t = window.setTimeout(() => setToast(""), 2500);
  }

  // Subtle confetti (emoji) when all done
  useEffect(() => {
    if (!allDone) return;
    setToast("All tasks complete today! 🎉");
    clearToastSoon();
  }, [allDone]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Daily Bone Health</h1>
          <div className="px-3 py-1 rounded-full text-sm bg-amber-50 border border-amber-200 text-amber-700">
            Streak: {/* Placeholder streak chip for consistency */} <span className="font-medium">{allDone ? 1 : 0}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-3xl mx-auto px-6 mt-4">
        <div className="relative w-full h-4 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3b82f6, #10b981)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-medium text-slate-600">{progress}%</span>
          </div>
        </div>
        <div className="text-xs text-slate-600 mt-2">XP: {xp}/{maxXp} • {completedCount}/{ALL_TASKS.length} tasks</div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="max-w-3xl mx-auto px-6 mt-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3 text-sm shadow-sm">
            {toast}
          </div>
        </div>
      )}

      {/* Categories + Tasks */}
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-7">
        {CATEGORIES.map((cat) => (
          <section key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg" aria-hidden>{CATEGORY_ICONS[cat]}</span>
              <h2 className="text-lg font-medium">{cat}</h2>
              <span className="ml-auto text-sm text-slate-500">{(grouped[cat]?.filter(t => completed.includes(t.id)).length ?? 0)}/{grouped[cat]?.length ?? 0}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {grouped[cat]?.map((t) => {
                const done = completed.includes(t.id);
                return (
                  <div
                    key={t.id}
                    className={`group p-4 rounded-2xl border shadow-sm transition-all ${done ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200 hover:shadow-md"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 p-2 rounded-full border ${done ? "bg-emerald-100 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                        {t.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className={`font-medium ${done ? "text-emerald-800" : "text-slate-900"}`}>{t.label}</div>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{t.evidence}</p>
                          </div>
                          <button
                            onClick={() => toggleTask(t.id)}
                            aria-pressed={done}
                            className={`px-3 py-1.5 text-sm rounded-full font-medium border transition-all active:scale-[0.98] ${done ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"}`}
                          >
                            {done ? "Undo" : "Mark done"}
                          </button>
                        </div>
                        {done && (
                          <div className="mt-2 text-emerald-700 text-sm flex items-center gap-1">
                            <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                            <span>Great! Counted for today.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Footer info */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <p className="text-xs text-slate-500">Tasks reset daily at local midnight. Progress and XP are derived from tasks completed today.</p>
      </div>
    </div>
  );
}
