import "../styles/globals.css";
import { TranslationProvider } from "./providers/TranslationProvider";

export const metadata = {
  title: "ReGain",
  description: "Bone-health companion"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TranslationProvider>
          <main className="app-shell">{children}</main>
        </TranslationProvider>
      </body>
    </html>
  );
}
