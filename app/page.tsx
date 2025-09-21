'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function Home() {
  const router = useRouter();

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Welcome to ReGain</h1>
      <p style={styles.tagline}>
        Your daily partner in <strong>building stronger bones</strong>, 
        preventing falls, and supporting recovery.
      </p>

      <section style={styles.infoBox}>
        <h2 style={styles.sectionTitle}>Why ReGain?</h2>
        <ul style={styles.list}>
          <li>🦴 Keep bones strong with daily calcium & vitamin D.</li>
          <li>🚶 Walking & balance exercises reduce fall risk by 30%.</li>
          <li>☀️ Sunlight boosts vitamin D for healthy bones.</li>
          <li>👨‍👩‍👧 Family can track and cheer you on (premium).</li>
        </ul>
      </section>

      <button style={styles.button} onClick={() => router.push('/dashboard')}>
        ➡️ Create Profile / Log In
      </button>

      <p style={styles.note}>
        (Future: secure login with email, password, and 2FA verification)
      </p>

      <section style={styles.footerBox}>
        <h3 style={styles.sectionTitle}>How it works</h3>
        <p>✅ Track habits daily</p>
        <p>🏅 Earn XP & badges</p>
        <p>🔥 Build streaks</p>
        <p>👨‍👩‍👧 Share progress with family</p>
      </section>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    background: "#f9f9f9",
    minHeight: "100vh",
    textAlign: "center",
  },
  title: { fontSize: "2.8rem", marginBottom: "1rem" },
  tagline: { fontSize: "1.3rem", marginBottom: "2rem", maxWidth: "600px" },
  sectionTitle: { fontSize: "1.6rem", marginBottom: "1rem" },
  infoBox: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "2px solid #ddd",
    marginBottom: "2rem",
    maxWidth: "600px",
  },
  footerBox: {
    background: "#e8f5ff",
    padding: "1.2rem",
    borderRadius: "12px",
    marginTop: "2rem",
    maxWidth: "500px",
  },
  list: {
    textAlign: "left",
    fontSize: "1.1rem",
    lineHeight: "1.6",
  },
  button: {
    fontSize: "1.3rem",
    padding: "1rem 2rem",
    borderRadius: "12px",
    cursor: "pointer",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    marginTop: "1rem",
  },
  note: { marginTop: "1rem", fontSize: "0.9rem", color: "#555" },
};
