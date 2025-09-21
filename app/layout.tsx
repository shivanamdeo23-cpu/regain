export const dynamic = 'force-dynamic';


import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Regain',
  description: 'Regain — daily micro-habits for stronger recovery and resilience.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur bg-[var(--bg)]/70">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="font-semibold">Regain</Link>
            <nav className="flex items-center gap-2">
              <a className="btn-ghost" href="/tasks">Tasks</a>
              <a className="btn-ghost" href="/calendar">Calendar</a>
              <a className="btn-ghost" href="/roadmap">Roadmap</a>
              <a className="btn-primary" href="/account">Account</a>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="container py-12 text-sm text-white/60">
          Built with ❤️ with Regain.
        </footer>
      </body>
    </html>
  );
}
