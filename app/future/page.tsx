'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useI18n } from '@/app/providers/TranslationProvider';

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full">{children}</span>
);

const Card = ({ title, desc, tag }: { title: string; desc: string; tag: string }) => (
  <div className="rounded-2xl border border-gray-800 p-4 bg-gray-900">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">{title}</h3>
      <Tag>{tag}</Tag>
    </div>
    <p className="mt-1 text-sm text-gray-300">{desc}</p>
  </div>
);

export default function FuturePage() {
  const { t } = useI18n();
  const S = t('future.statuses') as any;
  const I = t('future.items') as any;

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{t('future.pageTitle')}</h1>
        <p className="text-sm text-gray-400">{t('future.subtitle')}</p>
      </header>

      <section className="space-y-3">
        <Card title={I.socialSeasons.title} desc={I.socialSeasons.desc} tag={S.planned} />
        <Card title={I.coach.title} desc={I.coach.desc} tag={S.building} />
        <Card title={I.analytics.title} desc={I.analytics.desc} tag={S.planned} />
        <Card title={I.healthSync.title} desc={I.healthSync.desc} tag={S.research} />
        <Card title={I.dexa.title} desc={I.dexa.desc} tag={S.research} />
        <Card title={I.rehab.title} desc={I.rehab.desc} tag={S.planned} />
      </section>

      <nav className="flex justify-center gap-3 text-sm text-gray-400">
        <a className="underline" href="/daily">{t('common.backToToday')}</a>
        <span>·</span>
        <a className="underline" href="/roadmap">{t('common.roadmap')}</a>
      </nav>
    </main>
  );
}
