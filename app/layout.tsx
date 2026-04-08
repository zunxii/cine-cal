import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineCalendar — A Bollywood Wall Calendar",
  description:
    "A cinematic Bollywood calendar experience. Twelve iconic films, twelve months, golden date trivia, and a director's notebook for your scene logs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}