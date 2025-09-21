'use client';

import { useState } from 'react';
import React from 'react';

const habits = [
  { name: "Take Calcium", xp: 10, fact: "Calcium keeps bones dense and strong." },
  { name: "10-min Walk", xp: 10, fact: "Walking improves balance and strengthens muscles." },
  { name: "Get Sunlight", xp: 10, fact: "Sunlight boosts Vitamin D to absorb calcium." },
  { name: "Balance Exercise", xp: 10, fact: "Balance training lowers fall risk by 30%." }
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

    // If all completed → increment streak
    if (newCompleted.every(Boolean)) {
      setStreak(streak + 1);
    }
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Dashboard</h1>

      {/* XP + Streak Summary */}
      <div style={styles.statsBox}>
        <p>⭐ XP: {xp} / 100</p>
        <ProgressBar value={xp % 100} max={100} />
        <p>🔥 Streak: {streak} days</p>
        <p>🏆 Level {Math.floor(xp / 100) + 1}</p>
      </div>

      {/* Daily Habits */}
      <h2 style={styles.subtitle}>Today's Habits</h2>
      <ul style={styles.list}>
        {habits.map((habit, i) => (
          <li key={i} style={{ marginBottom: "1rem" }}>
            <button
              onClick={() => toggleHabit(i)}
              style={{
                ...styles.button,
                background: completed[i] ? "#4CAF50" : "#fff",
                color: completed[i] ? "#fff" : "#000",
              }}
            >
              {completed[i] ? `✅ ${habit.name}` : habit.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Motivational Fact */}
      {message && (
        <div style={styles.factBox}>
          <p>{message}</p>
        </div>
      )}

      {/* Daily Summary */}
      {completed.every(Boolean) && (
        <div style={styles.summaryBox}>
          🎉 Amazing! You completed all your habits today. Stronger bones incoming!
        </div>
      )}
    </main>
  );
}

// Reusable Progress Bar
function ProgressBar({ value, max }: { value: number; max: number }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div style={styles.progressContainer}>
      <div style={{ ...styles.progressFill, width: `${percentage}%` }} />
    </div>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    background: "#f9f9f9",
    minHeight: "100vh",
    fontSize: "1.2rem",
  },
  title: { fontSize: "2rem", marginBottom: "1.5rem" },
  subtitle: { fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem" },
  list: { listStyle: "none", padding: 0 },
  button: {
    fontSize: "1.2rem",
    padding: "0.8rem 1.2rem",
    borderRadius: "12px",
    border: "2px solid #333",
    cursor: "pointer",
    width: "260px",
  },
  statsBox: {
    textAlign: "center",
    marginBottom: "2rem",
    background: "#fff",
    padding: "1rem 2rem",
    borderRadius: "12px",
    border: "2px solid #ddd",
  },
  factBox: {
    marginTop: "1.5rem",
    padding: "1rem",
    border: "2px solid #4CAF50",
    borderRadius: "12px",
    background: "#eaffea",
    color: "#2d6a2d",
    fontWeight: "bold",
    maxWidth: "400px",
    textAlign: "center",
  },
  summaryBox: {
    marginTop: "2rem",
    padding: "1rem",
    border: "2px solid #333",
    borderRadius: "12px",
    background: "#ffe680",
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: "400px",
  },
  progressContainer: {
    width: "100%",
    height: "25px",
    background: "#ddd",
    borderRadius: "12px",
    overflow: "hidden",
    margin: "0.5rem 0",
  },
  progressFill: {
    height: "100%",
    background: "#4CAF50",
    borderRadius: "12px",
    transition: "width 0.4s ease",
  },
};
