import "../styles/globals.css";
import { I18nProvider } from "./i18n/context";

export const metadata = {
  title: "ReGain",
  description: "Bone-health companion"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <main className="app-shell">{children}</main>
        </I18nProvider>
      </body>
    </html>
  );
}
