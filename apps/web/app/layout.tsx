import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASX Risk–Reward Matrix",
  description: "Educational ASX risk-reward explorer. Not financial advice."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800 bg-slate-900/80 p-4 text-center text-sm">
          <strong>Not financial advice.</strong> High risk. Past performance ≠ future results.
        </header>
        {children}
      </body>
    </html>
  );
}
