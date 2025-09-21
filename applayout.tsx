import './globals.css';
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
      <body>{children}</body>
    </html>
  );
}
