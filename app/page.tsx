'use client';

import { useState } from 'react';

const habits = [
  { name: "Take Calcium", xp: 10 },
  { name: "10-min Walk", xp: 10 },
  { name: "Get Sunlight", xp: 10 },
  { name: "Balance Exercise", xp: 10 }
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [completed, setCompleted] = useState<boolean[]>(Array(habits.length).fill(false));
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  const toggleHabit = (index: number) => {
    const newCompleted = [...completed];
    if (!newCompleted[index]) {
      setXp(xp + habits[index].xp);
    }
    newCompleted[index] = !newCompleted[index];
    setCompleted(newCompleted);

    // Simple streak logic
    if (newCompleted.every(Boolean)) {
      setStreak(streak + 1);
    }
  };

  // Landing / Profile creation placeholder
  if (!isLoggedIn) {
    return (
      <main style={styles.page}>
        <h1 style={styles.title}>Welcome to ReGain</h1>
        <p style={styles.text}>Build stronger bones with small daily habits</p>
        <button style={styles.button} onClick={() => setIsLoggedIn(true)}>
          Create Profile / Log In
        </button>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#555" }}>
          (2FA placeholder: enter email + password, confirm via code)
        </p>
      </main>
    );
  }

  // Dashboard after "login"
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>ReGain Dashboard</h1>
      <p style={styles.text}>XP: {xp} | Streak: {streak} days</p>
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBar, width: `${Math.min(xp % 100, 100)}%` }}></div>
      </div>
      <p style={styles.textSmall}>Level {Math.floor(xp / 100) + 1}</p>

      <h2 style={styles.subtitle}>Today's Habits</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {habits.map((habit, i) => (
          <li key={i} style={{ marginBottom: "1rem" }}>
            <button
              onClick={() => toggleHabit(i)}
              style={{
                ...styles.button,
                background: completed[i] ? "#4CAF50" : "#fff",
                color: completed[i] ? "#fff" : "#000",
                border: "2px solid #333",
                width: "260px"
              }}
            >
              {completed[i] ? `✅ ${habit.name}` : habit.name}
            </button>
          </li>
        ))}
      </ul>

      <h2 style={styles.subtitle}>Badges (coming soon)</h2>
      <p style={styles.textSmall}>🏅 Bone Builder (7-day streak)</p>
      <p style={styles.textSmall}>🥇 Strong Walker (30 walks)</p>

      <h2 style={styles.subtitle}>Community Challenge (placeholder)</h2>
      <p style={styles.textSmall}>Walk 50 minutes this week with others</p>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "100vh",
    fontSize: "1.2rem",
    padding: "2rem",
    background: "#f9f9f9"
  },
  title: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  subtitle: { fontSize: "1.8rem", marginTop: "2rem" },
  text: { fontSize: "1.2rem", marginBottom: "1rem" },
  textSmall: { fontSize: "1rem", marginBottom: "0.5rem" },
  button: {
    fontSize: "1.2rem",
    padding: "0.8rem 1.2rem",
    borderRadius: "12px",
    cursor: "pointer"
  },
  progressBarContainer: {
    width: "80%",
    height: "20px",
    background: "#ddd",
    borderRadius: "10px",
    margin: "1rem 0"
  },
  progressBar: {
    height: "100%",
    background: "#4CAF50",
    borderRadius: "10px"
  }
};
