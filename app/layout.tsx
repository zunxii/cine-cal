import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineCalendar — Bollywood Wall Calendar",
  description:
    "A premium cinematic wall calendar inspired by 12 iconic Bollywood films. Date range selection, golden trivia dates, notes, and immersive film themes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}