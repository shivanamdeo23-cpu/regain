export const dynamic = 'force-dynamic';

import './globals.css';
import { TranslationProvider } from './providers/TranslationProvider';
import LanguageToggle from '@/components/LanguageToggle';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="bg-gray-900 text-gray-50">
        <TranslationProvider>
          <header className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-end">
            <LanguageToggle />
          </header>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
