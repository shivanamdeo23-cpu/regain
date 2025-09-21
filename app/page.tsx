'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function Home() {
  const router = useRouter();

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Welcome to ReGain</h1>
      <p style={styles.text}>Build stronger bones with daily habits</p>
      <button style={styles.button} onClick={() => router.push('/dashboard')}>
        Create Profile / Log In
      </button>
      <p style={styles.note}>
        (2FA placeholder: enter email + password, confirm via code)
      </p>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "80vh",
    justifyContent: "center",
    padding: "2rem",
    background: "#f9f9f9"
  },
  title: { fontSize: "2.5rem", marginBottom: "1rem" },
  text: { fontSize: "1.2rem", marginBottom: "1.5rem" },
  button: {
    fontSize: "1.2rem",
    padding: "0.8rem 1.2rem",
    borderRadius: "12px",
    cursor: "pointer",
    border: "2px solid #333",
    background: "#fff"
  },
  note: { marginTop: "1rem", fontSize: "1rem", color: "#555" }
};
