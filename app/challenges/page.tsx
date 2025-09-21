'use client';

import { useState } from 'react';

export default function Challenges() {
  // Fake progress state (later we can connect to real habit completion)
  const [progress, setProgress] = useState({
    walk: 30,      // out of 50 minutes
    sunlight: 3,   // out of 5 days
    balance: 2     // out of 3 sessions
  });

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Weekly Challenges</h1>

      <div style={styles.challenge}>
        <p>🚶 Walk 50 minutes this week</p>
        <ProgressBar value={progress.walk} max={50} />
        <p style={styles.smallText}>{progress.walk} / 50 minutes</p>
      </div>

      <div style={styles.challenge}>
        <p>☀️ Get sunlight on 5 days</p>
        <ProgressBar value={progress.sunlight} max={5} />
        <p style={styles.smallText}>{progress.sunlight} / 5 days</p>
      </div>

      <div style={styles.challenge}>
        <p>🧘 Do 3 balance sessions</p>
        <ProgressBar value={progress.balance} max={3} />
        <p style={styles.smallText}>{progress.balance} / 3 sessions</p>
      </div>

      <p style={styles.note}>
        ✅ Stay tuned! More community challenges will appear here soon.
      </p>
    </main>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div style={styles.progressContainer}>
      <div style={{ ...styles.progressFill, width: `${percentage}%` }} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
    fontSize: "1.2rem",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  title: { fontSize: "2rem", marginBottom: "1.5rem" },
  challenge: { marginBottom: "2rem" },
  smallText: { fontSize: "1rem", color: "#555" },
  note: { marginTop: "2rem", fontSize: "1rem", color: "#666" },
  progressContainer: {
    width: "100%",
    height: "25px",
    background: "#ddd",
    borderRadius: "12px",
    overflow: "hidden",
    margin: "0.5rem 0"
  },
  progressFill: {
    height: "100%",
    background: "#4CAF50",
    borderRadius: "12px",
    transition: "width 0.4s ease"
  }
};
