export default function Challenges() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Weekly Challenges</h1>

      <ul style={styles.list}>
        <li style={styles.item}>🚶 Walk 50 minutes this week → +50 XP</li>
        <li style={styles.item}>☀️ Get sunlight on 5 days → Unlock Vitamin D Badge</li>
        <li style={styles.item}>🧘 Do 3 balance sessions → +30 XP</li>
      </ul>

      <p style={styles.note}>
        ✅ Stay tuned! More community challenges will appear here soon.
      </p>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "2rem",
    fontSize: "1.2rem",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  title: { fontSize: "2rem", marginBottom: "1rem" },
  list: { paddingLeft: "1rem", marginBottom: "1.5rem" },
  item: { marginBottom: "0.8rem" },
  note: { marginTop: "1rem", fontSize: "1rem", color: "#555" },
};
