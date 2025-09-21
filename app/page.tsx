'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Welcome to ReGain</h1>
      <p style={styles.text}>Build stronger bones with daily habits</p>
      <button style={styles.button} onClick={() => router.push('/dashboard')}>
        Create Profile / Log In
      </button>
      <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#555" }}>
        (2FA placeholder: enter email + password, confirm via code)
      </p>
    </main>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", alignItems: "center", minHeight: "80vh", justifyContent: "center" },
  title: { fontSize: "2.5rem" },
  text: { fontSize: "1.2rem", margin: "1rem 0" },
  button: { fontSize: "1.2rem", padding: "0.8rem 1.2rem", borderRadius: "12px", cursor: "pointer" }
};
