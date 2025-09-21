"use client";

// app/daily/page.tsx
import { useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  label: string;
  evidence: string;
  category: "Nutrition" | "Exercise" | "Lifestyle";
};

type TasksByCategory = Record<Task["category"], Task[]>;

const ALL_TASKS: Task[] = [
  // Nutrition
  { id: "calcium", label: "Take calcium (diet or supplement)", category: "Nutrition", evidence: "Adequate calcium intake supports bone mineral density." },
  { id: "vitD", label: "Vitamin D source (supplement or sunlight)", category: "Nutrition", evidence: "Vitamin D improves calcium absorption and bone health." },
  { id: "protein", label: "Hit your protein target today", category: "Nutrition", evidence: "Protein supports bone matrix and muscle to prevent falls." },
  { id: "hydration", label: "Drink 6–8 glasses of water", category: "Nutrition", evidence: "Hydration aids overall health and supports physical activity." },

  // Exercise
  { id: "walk10", label: "10–20 min weight-bearing walk", category: "Exercise", evidence: "Weight-bearing exercise stimulates bone formation." },
  { id: "resistance", label: "5–10 min resistance (bands/weights)", category: "Exercise", evidence: "Resistance training increases bone and muscle strength." },
  { id: "balance", label: "3 min balance practice", category: "Exercise", evidence: "Balance work reduces fall risk and fractures." },

  // Lifestyle
  { id: "sunlight", label: "Get 10–15 min safe daylight", category: "Lifestyle", evidence: "Daylight supports circadian health and vitamin D synthesis." },
  { id: "sleep", label: "Aim 7–8 h sleep", category: "Lifestyle", evidence: "Sleep is linked to hormone balance and recovery." },
  { id: "alcohol", label: "Keep alcohol ≤ 1 unit (or none)", category: "Lifestyle", evidence: "Lower alcohol is associated with better bone health." },
];

const CATEGORIES: Task["category"][] = ["Nutrition", "Exercise", "Lifestyle"];

const STORAGE_KEY = "dailyTasks_state_v1"; // { date: "YYYY-MM-DD", completed: string[] }
const STREAK_KEY = "dailyTasks_streak_v1"; // { lastDate: string|null, streak: number }

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

function todayLocal(): string {
  const now = new Date();
  const tzAdjusted = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return fmtDate(tzAdjusted);
}

function loadState(): { date: string; completed: string[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayLocal(), completed: [] };
    const parsed = JSON.parse(raw);
    if (!parsed.date || !Array.isArray(parsed.completed)) {
      return { date: todayLocal(), completed: [] };
    }
    return parsed;
  } catch {
    return { date: todayLocal(), completed: [] };
  }
}

function saveState(state: { date: string; completed: string[] }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadStreak(): { lastDate: string | null; streak: number } {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { lastDate: null, streak: 0 };
    const parsed = JSON.parse(raw);
    return { lastDate: parsed.lastDate ?? null, streak: Number(parsed.streak) || 0 };
  } catch {
    return { lastDate: null, streak: 0 };
  }
}

function saveStreak(s: { lastDate: string | null; streak: number }) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(s));
}

function groupTasks(tasks: Task[]): TasksByCategory {
  return tasks.reduce((acc, t) => {
    (acc[t.category] ||= []).push(t);
    return acc;
  }, {} as TasksByCategory);
}

function daysBetweenISO(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  const diff = Math.round((+db - +da) / 86400000);
  return diff;
}

function StreakBadge({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2c1.657 0 3 1.343 3 3v1h1a3 3 0 0 1 2.995 2.824L19 9v2a5 5 0 0 1-5 5h-1v2h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2H10a5 5 0 0 1-4.995-4.783L5 11V9a3 3 0 0 1 3-3h1V5c0-1.657 1.343-3 3-3z" />
      </svg>
      <span className="text-sm font-medium">Streak: {streak} day{streak === 1 ? "" : "s"}</span>
    </div>
  );
}

export default function Page() {
  const [state, setState] = useState<{ date: string; completed: string[] } | null>(null);
  const [streak, setStreak] = useState<{ lastDate: string | null; streak: number } | null>(null);

  // init + daily reset
  useEffect(() => {
    const t = todayLocal();
    const s = loadState();
    if (s.date !== t) {
      const prevCompleted = s.completed;
      const prevDate = s.date;
      const allDoneYesterday = prevCompleted.length === ALL_TASKS.length;
      const streakObj = loadStreak();

      if (allDoneYesterday) {
        if (streakObj.lastDate) {
          const gap = daysBetweenISO(streakObj.lastDate, prevDate);
          const continued = gap === 1 || gap === 0;
          saveStreak({ lastDate: prevDate, streak: continued ? streakObj.streak + 1 : 1 });
        } else {
          saveStreak({ lastDate: prevDate, streak: 1 });
        }
      } else {
        if (streakObj.lastDate) {
          const gap = daysBetweenISO(streakObj.lastDate, t);
          if (gap >= 1) saveStreak({ lastDate: streakObj.lastDate, streak: 0 });
        }
      }

      const fresh = { date: t, completed: [] };
      saveState(fresh);
      setState(fresh);
      setStreak(loadStreak());
    } else {
      setState(s);
      setStreak(loadStreak());
    }
  }, []);

  const grouped = useMemo(() => groupTasks(ALL_TASKS), []);
  const total = ALL_TASKS.length;
  const completedCount = state ? state.completed.length : 0;
  const progress = total ? Math.round((completedCount / total) * 100) : 0;

  function markDone(taskId: string) {
    if (!state) return;
    if (state.completed.includes(taskId)) return; // 1x per day cap
    const next = { ...state, completed: [...state.completed, taskId] };

    // if finishing all tasks today, update streak live
    const nowCompletedCount = next.completed.length;
    if (nowCompletedCount === total) {
      const t = todayLocal();
      const streakObj = loadStreak();
      if (streakObj.lastDate) {
        const gap = daysBetweenISO(streakObj.lastDate, t);
        const continued = gap === 1 || gap === 0;
        saveStreak({ lastDate: t, streak: continued ? streakObj.streak + 1 : 1 });
      } else {
        saveStreak({ lastDate: t, streak: 1 });
      }
      setStreak(loadStreak());
    }

    saveState(next);
    setState(next);
  }

  if (!state || streak === null) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
        <div className="h-3 w-full bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Daily Bone Health Tasks</h1>
        <StreakBadge streak={streak.streak} />
      </div>

      <div className="w-full bg-gray-100 rounded-full h-3 mb-6">
        <div
          className="h-3 rounded-full transition-all"
          style={{ width: `${progress}%`, background: `linear-gradient(90deg, rgba(59,130,246,1), rgba(16,185,129,1))` }}
          aria-label={`Progress ${progress}%`}
        />
      </div>
      <div className="text-sm text-gray-600 mb-6">{completedCount}/{total} completed today</div>

      <div className="space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat}>
            <h2 className="text-lg font-medium mb-3">{cat}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {grouped[cat]?.map((t) => {
                const done = state.completed.includes(t.id);
                return (
                  <div key={t.id} className={`p-4 rounded-2xl border ${done ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{t.label}</div>
                        <p className="text-sm text-gray-600 mt-1">{t.evidence}</p>
                      </div>
                      <button
                        className={`px-3 py-1.5 text-sm rounded-full font-medium border transition ${done ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"}`}
                        onClick={() => markDone(t.id)}
                        disabled={done}
                        aria-pressed={done}
                      >
                        {done ? "Done" : "Mark done"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-8">Tasks reset daily at local midnight. Completing all tasks today advances your streak.</p>
    </div>
  );
}
