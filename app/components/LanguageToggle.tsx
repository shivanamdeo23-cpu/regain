'use client';

import { useI18n } from '@/app/providers/TranslationProvider';

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="inline-flex rounded-xl border border-gray-700 overflow-hidden">
      <button
        className={`px-3 py-1 text-sm ${locale === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-200'}`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        English
      </button>
      <button
        className={`px-3 py-1 text-sm ${locale === 'hi' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-200'}`}
        onClick={() => setLocale('hi')}
        aria-pressed={locale === 'hi'}
      >
        हिंदी
      </button>
    </div>
  );
}
