'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

const habits = [
  { key: "calcium", name: "Take Calcium", xp: 10, fact: "Calcium keeps bones dense and strong." },
  { key: "walk", name: "10-min Walk", xp: 10, fact: "Walking improves balance and strengthens muscles." },
  { key: "sunlight", name: "Get Sunlight", xp: 10, fact: "Sunlight boosts Vitamin D to absorb calcium." },
  { key: "balance", name: "Balance Exercise", xp: 10, fact: "Balance training lowers fall risk by 30%." }
];

export default function Dashboard() {
  const router = useRouter();
  const [completed, setCompleted] = useState<boolean[]>(Array(habits.length).fill(false));
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<{ name?: string; age?: string; condition?: string }>({});

  // Load profile + progress
  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedXP = localStorage.getItem("xp");
    const savedStreak = localStorage.getItem("streak");
    if (savedXP) setXp(parseInt(savedXP, 10));
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
  }, []);

  const toggleHabit = (i: number) => {
    const newCompleted = [...completed];
    if (!newCompleted[i]) {
      const newXP = xp + habits[i].xp;
      setXp(newXP);
      setMessage(habits[i].fact);
      localStorage.setItem("xp", String(newXP));

      updateChallengeProgress(habits[i].key);
    }
    newCompleted[i] = !newCompleted[i];
    setCompleted(newCompleted);

    if (newCompleted.every(Boolean)) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("streak", String(newStreak));
    }
  };

  const updateChallengeProgress = (habitKey: string) => {
    const challenges = JSON.parse(localStorage.getItem("challenges") || "{}");

    if (habitKey === "walk") challenges.walk = (challenges.walk || 0) + 10;
    if (habitKey === "sunlight") challenges.sunlight = (challenges.sunlight || 0) + 1;
    if (habitKey === "balance") challenges.balance = (challenges.balance || 0) + 1;

    localStorage.setItem("challenges", JSON.stringify(challenges));
  };

  return (
    <main style={styles.page}>
      {/* Profile Section */}
      {profile.name && (
        <section style={styles.profileBox}>
          <h1>Welcome back, {profile.name} 👋</h1>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Focus:</strong> {profile.condition}</p>
          <p style={styles.encourage}>
            Let’s keep your bones strong today!
          </p>
          <button style={styles.editButton} onClick={() => router.push('/profile')}>
            Edit Profile
          </button>
        </section>
      )}

      {/* XP + Streak */}
      <div style={styles.statsBox}>
        <p>⭐ XP: {xp} / 100</p>
        <ProgressBar value={xp % 100} max={100} />
        <p>🔥 Streak: {streak} days</p>
        <p>🏆 Level {Math.floor(xp / 100) + 1}</p>
      </div>

      {/* Habits */}
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

      {/* Motivation */}
      {message && (
        <div style={styles.factBox}>
          <p>{message}</p>
        </div>
      )}

      {completed.every(Boolean) && (
        <div style={styles.summaryBox}>
          🎉 Amazing! You completed all your habits today. Stronger bones incoming!
        </div>
      )}
    </main>
  );
}

// Progress Bar
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
  profileBox: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "2px solid #ddd",
    marginBottom: "2rem",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
  },
  encourage: {
    marginTop: "1rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#2d6a2d",
  },
  editButton: {
    marginTop: "1rem",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    border: "none",
    background: "#0070f3",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
  },
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
