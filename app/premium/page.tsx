'use client';

export const dynamic = 'force-dynamic';

import React from 'react';

const Feature = ({ title, desc, tag }: { title: string; desc: string; tag?: string }) => (
  <div className="rounded-2xl border border-gray-200 p-4 bg-white">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">{title}</h3>
      {tag && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{tag}</span>}
    </div>
    <p className="mt-1 text-sm text-gray-600">{desc}</p>
  </div>
);

export default function PremiumPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Premium & What’s Next</h1>
        <p className="text-sm text-gray-600">Unlock social features, coaching, and deeper insights.</p>
      </header>

      <section className="space-y-3">
        <Feature
          title="Friends & Family Leaderboard"
          desc="Compete with your circle, weekly seasons, and private groups."
          tag="Premium"
        />
        <Feature
          title="Smart Coaching"
          desc="Adaptive nudges and evidence-based micro-plans tailored to your data."
          tag="Premium"
        />
        <Feature
          title="Advanced Analytics"
          desc="Habit correlations, streak analysis, and plateau detection."
          tag="Premium"
        />
        <Feature
          title="Health Sync"
          desc="Apple Health / Google Fit / Garmin steps & workouts imported automatically."
          tag="Coming soon"
        />
        <Feature
          title="DEXA / FRAX Integrations"
          desc="Pull objective bone metrics and map them to your roadmap."
          tag="Coming soon"
        />
        <Feature
          title="Rehab Packs"
          desc="Procedure-specific protocols (pre-op, post-op, fracture rehab)."
          tag="Coming soon"
        />
      </section>

      <div className="rounded-2xl border border-gray-200 p-4 bg-white">
        <h3 className="font-semibold">Go Premium</h3>
        <p className="mt-1 text-sm text-gray-600">Unlock social competition and smart coaching.</p>
        <button
          className="mt-3 w-full rounded-xl bg-indigo-600 text-white py-2 text-sm font-medium hover:bg-indigo-700"
          onClick={() => alert('Start checkout flow')}
        >
          Start 14-day trial
        </button>
      </div>

      <nav className="flex justify-center gap-3 text-sm text-gray-600">
        <a className="underline" href="/daily">Today</a>
        <span>·</span>
        <a className="underline" href="/roadmap">Roadmap</a>
      </nav>
    </main>
  );
}
