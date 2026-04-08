import type { Metadata } from "next";
import {
  Playfair_Display,
  Lora,
  Kalam,
  Bebas_Neue,
  Nunito,
  Oswald,
  Source_Sans_3,
  Teko,
  Barlow,
  Barlow_Condensed,
  EB_Garamond,
  Raleway,
} from "next/font/google";
import "./globals.css";

// ─────────────────────────────────────────────────────────────────────────────
// Fonts (all explicitly weighted where required)
// ─────────────────────────────────────────────────────────────────────────────

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-playfair",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-lora",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-kalam",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-oswald",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-source-sans",
});

const teko = Teko({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-teko",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-barlow",
});

// ✅ FIXED (this caused your error)
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-barlow-condensed",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-eb-garamond",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-raleway",
});

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "CineCalendar",
  description:
    "A cinematic Bollywood calendar experience with themed months, trivia, and elegant date-range notes.",
};

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          playfair.variable,
          lora.variable,
          kalam.variable,
          bebas.variable,
          nunito.variable,
          oswald.variable,
          sourceSans.variable,
          teko.variable,
          barlow.variable,
          barlowCondensed.variable,
          ebGaramond.variable,
          raleway.variable,
          "min-h-screen antialiased",
        ].join(" ")}
        style={{
          backgroundColor: "var(--theme-bg, #070707)",
          color: "var(--theme-text, #f5f5f5)",
        }}
      >
        {children}
      </body>
    </html>
  );
}