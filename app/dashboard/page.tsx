'use client';

import { useState } from 'react';

const habits = [
  { name: "Take Calcium", xp: 10, fact: "Calcium strengthens bones by maintaining density." },
  { name: "10-min Walk", xp: 10, fact: "Walking improves balance and reduces fall risk." },
  { name: "Get Sunlight", xp: 10, fact: "Sunlight boosts Vitamin D → stronger bones." },
  { name: "Balance Exercise", xp: 10, fact: "Balance exercises help prevent fractures." }
];

export default function Dashboard() {
  const [completed, setCompleted] = useState<boolean[]>(Array(habits.length).fill(false));
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState("");

  const toggleHabit = (i: number) => {
    const newCompleted = [...completed];
    if (!newCompleted[i]) {
      setXp(xp + habits[i].xp);
      setMessage(habits[i].fact);
    }
    newCompleted[i] = !newCompleted[i];
    setCompleted(newCompleted);
    if (newCompleted.every(Boolean)) setStreak(streak + 1);
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>XP: {xp} | Streak: {streak} days</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {habits.map((habit, i) => (
          <li key={i} style={{ margin: "1rem 0" }}>
            <button onClick={() => toggleHabit(i)} style={{
              fontSize: "1.2rem",
              padding: "0.8rem 1.2rem",
              borderRadius: "12px",
              cursor: "pointer",
              background: completed[i] ? "#4CAF50" : "#fff"
            }}>
              {completed[i] ? `✅ ${habit.name}` : habit.name}
            </button>
          </li>
        ))}
      </ul>
      {message && <p style={{ marginTop: "1.5rem", color: "green", fontWeight: "bold" }}>{message}</p>}
    </main>
  );
}
