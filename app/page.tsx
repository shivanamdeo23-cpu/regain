'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ name?: string; age?: string; condition?: string }>({});

  // Load profile if it exists
  useEffect(() => {
    const saved = localStorage.getItem('profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  return (
    <main style={styles.page}>
      {/* Section 1: Welcome Header */}
      <section style={styles.section}>
        <h1 style={styles.title}>Welcome to ReGain</h1>
        <p style={styles.tagline}>
          Your daily partner in <strong>building stronger bones</strong>, 
          preventing falls, and supporting recovery.
        </p>
        {!profile.name ? (
          <button style={styles.button} onClick={() => router.push('/profile')}>
            Create Profile / Log In
          </button>
        ) : (
          <button style={styles.button} onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </button>
        )}
      </section>

      {/* Section 2: About Me */}
      {profile.name && (
        <section style={styles.infoBox}>
          <h2 style={styles.sectionTitle}>About Me</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Reason for using ReGain:</strong> {profile.condition}</p>
        </section>
      )}

      {/* Section 3: Why ReGain */}
      <section style={styles.infoBox}>
        <h2 style={styles.sectionTitle}>Why ReGain?</h2>
        <ul style={styles.list}>
          <li>Keep bones strong with daily calcium & vitamin D.</li>
          <li>Walking and balance exercises reduce fall risk by 30%.</li>
          <li>Sunlight improves vitamin D absorption.</li>
          <li>Family can track and support your progress (premium).</li>
        </ul>
      </section>

      {/* Section 4: How it works */}
      <section style={styles.footerBox}>
        <h3 style={styles.sectionTitle}>How it works</h3>
        <p>Track your habits daily.</p>
        <p>Earn points and unlock badges.</p>
        <p>Build healthy streaks.</p>
        <p>Share your progress with family.</p>
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
  },
  section: {
    textAlign: "center",
    marginBottom: "2rem",
    maxWidth: "600px",
  },
  title: { fontSize: "2.8rem", marginBottom: "1rem" },
  tagline: { fontSize: "1.3rem", marginBottom: "1.5rem" },
  sectionTitle: { fontSize: "1.6rem", marginBottom: "1rem" },
  infoBox: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "2px solid #ddd",
    marginBottom: "2rem",
    width: "100%",
    maxWidth: "600px",
  },
  footerBox: {
    background: "#e8f5ff",
    padding: "1.2rem",
    borderRadius: "12px",
    marginTop: "2rem",
    maxWidth: "600px",
    width: "100%",
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
};
