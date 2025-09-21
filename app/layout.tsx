import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur bg-[var(--bg)]/70">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="font-semibold">BoneHealth</Link>
            <nav className="flex items-center gap-2">
              <Link className="btn-ghost" href="/profile">Profile</Link>
              <Link className="btn-primary" href="/dashboard">Dashboard</Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="container py-12 text-sm text-white/60">
          Built with ❤️ for stronger bones.
        </footer>
      </body>
    </html>
  );
}

