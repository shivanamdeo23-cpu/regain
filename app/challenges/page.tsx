'use client';

import { useState, useEffect } from 'react';

export default function Challenges() {
  const [progress, setProgress] = useState({ walk: 0, sunlight: 0, balance: 0 });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("challenges") || "{}");
    setProgress({
      walk: saved.walk || 0,
      sunlight: saved.sunlight || 0,
      balance: saved.balance || 0
    });
  }, []);

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Weekly Challenges</h1>

      <div style={styles.challenge}>
        <p>🚶 Walk 50 minutes this week</p>
        <ProgressBar value={progress.walk} max={50} />
        <p>{progress.walk} / 50 minutes</p>
      </div>

      <div style={styles.challenge}>
        <p>☀️ Get sunlight on 5 days</p>
        <ProgressBar value={progress.sunlight} max={5} />
        <p>{progress.sunlight} / 5 days</p>
      </div>

      <div style={styles.challenge}>
        <p>🧘 Do 3 balance sessions</p>
        <ProgressBar value={progress.balance} max={3} />
        <p>{progress.balance} / 3 sessions</p>
      </div>
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
  page: { padding: "2rem", background: "#f9f9f9", minHeight: "100vh" },
  title: { fontSize: "2rem", marginBottom: "1.5rem" },
  challenge: { marginBottom: "2rem" },
  progressContainer: { width: "100%", height: "25px", background: "#ddd", borderRadius: "12px", overflow: "hidden", margin: "0.5rem 0" },
  progressFill: { height: "100%", background: "#4CAF50", borderRadius: "12px", transition: "width 0.4s ease" }
};
