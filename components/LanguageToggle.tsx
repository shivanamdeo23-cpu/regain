'use client';
import { useI18n } from '@/app/providers/TranslationProvider';
export default function LanguageToggle(){
  const { locale, setLocale } = useI18n();
  return (
    <div className="inline-flex rounded-xl border border-gray-300 overflow-hidden">
      <button className={`px-3 py-1 text-sm ${locale==='en'?'bg-indigo-600 text-white':'bg-white'}`} onClick={()=>setLocale('en')}>English</button>
      <button className={`px-3 py-1 text-sm ${locale==='hi'?'bg-indigo-600 text-white':'bg-white'}`} onClick={()=>setLocale('hi')}>हिंदी</button>
    </div>
  );
}
