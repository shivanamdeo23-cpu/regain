'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [condition, setCondition] = useState('');

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleFinish = () => {
    // Save to localStorage (so Dashboard could greet user later)
    localStorage.setItem('profile', JSON.stringify({ name, age, condition }));
    router.push('/dashboard');
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Profile Setup</h1>

      {step === 1 && (
        <div style={styles.box}>
          <p style={styles.text}>What is your name?</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <div style={styles.buttons}>
            <button style={styles.next} onClick={nextStep} disabled={!name}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={styles.box}>
          <p style={styles.text}>How old are you?</p>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={styles.input}
          />
          <div style={styles.buttons}>
            <button style={styles.back} onClick={prevStep}>Back</button>
            <button style={styles.next} onClick={nextStep} disabled={!age}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={styles.box}>
          <p style={styles.text}>Why are you using ReGain?</p>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            style={styles.input}
          >
            <option value="">Select an option</option>
            <option value="prevention">Prevention</option>
            <option value="pre-op">Pre-op</option>
            <option value="post-op">Post-op</option>
          </select>
          <div style={styles.buttons}>
            <button style={styles.back} onClick={prevStep}>Back</button>
            <button
              style={styles.next}
              onClick={handleFinish}
              disabled={!condition}
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
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
  title: { fontSize: "2rem", marginBottom: "1rem" },
  box: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    border: "2px solid #ddd",
    marginTop: "1rem",
    width: "300px",
  },
  text: { fontSize: "1.2rem", marginBottom: "1rem" },
  input: {
    fontSize: "1.1rem",
    padding: "0.6rem",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #aaa",
    marginBottom: "1rem",
  },
  buttons: { display: "flex", justifyContent: "space-between" },
  next: {
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
  },
  back: {
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    border: "1px solid #aaa",
    background: "#f0f0f0",
    cursor: "pointer",
  },
};
