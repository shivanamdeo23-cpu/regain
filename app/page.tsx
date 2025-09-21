'use client';

import { useState } from 'react';

const habits = [
  "Take Calcium",
  "10-min Walk",
  "Get Sunlight",
  "Balance Exercise"
];

export default function Home() {
  const [completed, setCompleted] = useState<boolean[]>(Array(habits.length).fill(false));
  const [streak, setStreak] = useState(0);

  const toggleHabit = (index: number) => {
    const newCompleted = [...completed];
    newCompleted[index] = !newCompleted[index];
    setCompleted(newCompleted);

    // Simple streak logic: if all habits ticked, increment streak
    if (newCompleted.every(Boolean)) {
      setStreak(streak + 1);
    }
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontSize: "1.5rem",
        padding: "2rem",
        background: "#f9f9f9",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>ReGain</h1>
      <h2 style={{ marginBottom: "1.5rem" }}>Today's Habits</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {habits.map((habit, i) => (
          <li key={i} style={{ marginBottom: "1rem" }}>
            <button
              onClick={() => toggleHabit(i)}
              style={{
                fontSize: "1.2rem",
                padding: "0.8rem 1.2rem",
                borderRadius: "12px",
                border: "2px solid #333",
                background: completed[i] ? "#4CAF50" : "#fff",
                color: completed[i] ? "#fff" : "#000",
                cursor: "pointer",
                width: "250px",
                textAlign: "center",
              }}
            >
              {completed[i] ? `✅ ${habit}` : habit}
            </button>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: "2rem", fontSize: "1.2rem" }}>
        Streak: <strong>{streak} days</strong>
      </p>

      {streak > 0 && (
        <p style={{ marginTop: "1rem", color: "green", fontWeight: "bold" }}>
          🎉 Great job! You're building stronger bones!
        </p>
      )}
    </main>
  );
}
