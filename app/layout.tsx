import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ReGain',
  description: 'Gamified elderly-friendly habit tracker for bone health',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={styles.nav}>
          <Link href="/" style={styles.link}>Home</Link>
          <Link href="/dashboard" style={styles.link}>Dashboard</Link>
          <Link href="/challenges" style={styles.link}>Weekly Challenges</Link>
          <Link href="/friends" style={styles.link}>Friends & Family</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: "flex",
    justifyContent: "space-around",
    padding: "1rem",
    background: "#eee",
    borderBottom: "2px solid #ccc",
    position: "sticky",
    top: 0
  },
  link: { fontSize: "1.2rem", textDecoration: "none", color: "#333" }
};
