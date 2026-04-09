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
  Cinzel,
  Josefin_Sans,
  Libre_Baskerville,
  Righteous,
} from "next/font/google";
import "./globals.css";

// ─────────────────────────────────────────────────────────────────────────────
// Fonts (all explicitly weighted where required)
// ─────────────────────────────────────────────────────────────────────────────

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
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
  weight: ["300", "400", "600", "700", "900"],
  display: "swap",
  variable: "--font-nunito",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-oswald",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
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
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
  variable: "--font-barlow-condensed",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-eb-garamond",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-raleway",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-cinzel",
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-josefin",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-libre-baskerville",
});

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-righteous",
});

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "CineCalendar — Bollywood Wall Calendar",
  description:
    "A premium cinematic wall calendar inspired by 12 iconic Bollywood films. Date range selection, golden trivia dates, notes, and immersive film themes.",
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
          cinzel.variable,
          josefinSans.variable,
          libreBaskerville.variable,
          righteous.variable,
          "min-h-screen antialiased",
        ].join(" ")}
        style={{
          backgroundColor: "var(--paper-alt, #fdf8f0)",
          color: "var(--ink, #2d1f0a)",
        }}
      >
        {children}
      </body>
    </html>
  );
}