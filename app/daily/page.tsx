"use client";

// app/daily/page.tsx — FINAL (Simple, toggle, derived XP, no localStorage)
// This version avoids storage entirely so progress ALWAYS goes up/down on toggle.
// Once confirmed working, we can add persistence back.

import { useMemo, useState } from "react";

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
  { id: "walk10", label: "10–20 min weight‑bearing walk", category: "Exercise", evidence: "Weight‑bearing exercise stimulates bone formation." },
  { id: "resistance", label: "5–10 min resistance (bands/weights)", category: "Exercise", evidence: "Resistance training increases bone and muscle strength." },
  { id: "balance", label: "3 min balance practice", category: "Exercise", evidence: "Balance work reduces fall risk and fractures." },

  // Lifestyle
  { id: "sunlight", label: "Get 10–15 min safe daylight", category: "Lifestyle", evidence: "Daylight supports circadian health and vitamin D synthesis." },
  { id: "sleep", label: "Aim 7–8 h sleep", category: "Lifestyle", evidence: "Sleep is linked to hormone balance and recovery." },
  { id: "alcohol", label: "Keep alcohol ≤ 1 unit (or none)", category: "Lifestyle", evidence: "Lower alcohol is associated with better bone health." },
];

const CATEGORIES: Task["category"][] = ["Nutrition", "Exercise", "Lifestyle"];
const POINTS_PER_TASK = 10; // adjust freely

function groupTasks(tasks: Task[]): TasksByCategory {
  return tasks.reduce((acc, t) => {
    (acc[t.category] ||= []).push(t);
    return acc;
  }, {} as TasksByCategory);
}

export default function Page() {
  const [completed, setCompleted] = useState<string[]>([]);
  const grouped = useMemo(() => groupTasks(ALL_TASKS), []);

  const completedCount = completed.length;
  const xp = completedCount * POINTS_PER_TASK;           // derived, not stored
  const maxXp = ALL_TASKS.length * POINTS_PER_TASK;
  const progress = Math.round((xp / maxXp) * 100);

  function toggleTask(id: string) {
    setCompleted((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Daily Bone Health Tasks</h1>
        <div className="text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">XP: {xp}/{maxXp}</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
        <div className="h-3 rounded-full transition-all" style={{ width: `${progress}%`, background: `linear-gradient(90deg, rgba(59,130,246,1), rgba(16,185,129,1))` }} />
      </div>
      <div className="text-xs text-gray-600 mb-6">{completedCount}/{ALL_TASKS.length} tasks</div>

      {/* Categories */}
      <div className="space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat}>
            <h2 className="text-lg font-medium mb-3">{cat}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {grouped[cat]?.map((t) => {
                const done = completed.includes(t.id);
                return (
                  <div key={t.id} className={`p-4 rounded-2xl border ${done ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{t.label}</div>
                        <p className="text-sm text-gray-600 mt-1">{t.evidence}</p>
                      </div>
                      <button
                        className={`px-3 py-1.5 text-sm rounded-full font-medium border transition ${done ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"}`}
                        onClick={() => toggleTask(t.id)}
                        aria-pressed={done}
                      >
                        {done ? "Undo" : "Mark done"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Dev helpers */}
      <div className="mt-8 flex gap-3">
        <button className="text-xs text-gray-600 underline" onClick={() => setCompleted([])}>Reset (dev)</button>
        <button className="text-xs text-gray-600 underline" onClick={() => setCompleted(CATEGORIES.flatMap(cat => grouped[cat].map(t => t.id)))}>Complete all (dev)</button>
      </div>
    </div>
  );
}
