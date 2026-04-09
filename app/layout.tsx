import type { Metadata } from "next";
import {
  Crimson_Text,
  Playfair_Display,
  EB_Garamond,
  Oswald,
  Bebas_Neue,
  Barlow,
  Barlow_Condensed,
  Nunito,
  Kalam,
  Raleway,
  Lora,
} from "next/font/google";
import "./globals.css";

// ── Google fonts loaded via next/font (no external @import needed) ────────
const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

const oswald = Oswald({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const barlow = Barlow({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const kalam = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
});

const raleway = Raleway({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const lora = Lora({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CineCalendar — Bollywood Wall Calendar",
  description:
    "A premium paper wall calendar inspired by 12 iconic Bollywood films. Date range selection, golden trivia dates, notes, and immersive film themes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          crimsonText.variable,
          playfair.variable,
          ebGaramond.variable,
          oswald.variable,
          bebasNeue.variable,
          barlow.variable,
          barlowCondensed.variable,
          nunito.variable,
          kalam.variable,
          raleway.variable,
          lora.variable,
          "antialiased min-h-screen",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}