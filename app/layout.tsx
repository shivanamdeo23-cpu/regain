export const metadata = {
  title: "ReGain",
  description: "Bone-health companion"
};

import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="app-shell">
          {children}
        </main>
      </body>
    </html>
  );
}
