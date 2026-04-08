export type FilmId =
  | "ddlj"
  | "kkhh"
  | "rdb"
  | "gow"
  | "satya"
  | "devdas"
  | "jthj"
  | "lagaan"
  | "three-idiots"
  | "mughal-e-azam"
  | "dil-chahta-hai"
  | "bajirao";

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type FontStyle =
  | "handpainted"   // GOW, Satya — rough, loud
  | "ornate"        // Devdas, Bajirao — serif, regal
  | "collegiate"    // KKHH, 3 Idiots — clean, youthful
  | "military"      // JTHJ — stencil, stark
  | "classical"     // Mughal-E-Azam — formal, grand
  | "rustic"        // Lagaan — earthy, worn
  | "modern"        // DCH, RDB — contemporary
  | "romantic";     // DDLJ — warm, flowing

export type GrainIntensity = "none" | "subtle" | "medium" | "heavy";

export interface ThemeColors {
  bg: string;           // page background
  surface: string;      // card / calendar surface
  accent: string;       // primary accent (CTA, selected dates)
  accentAlt: string;    // secondary accent (range fill, hover)
  text: string;         // primary text
  textMuted: string;    // secondary text, day labels
  border: string;       // grid lines, panel borders
  highlight: string;    // golden date marker color
  heroOverlay: string;  // gradient over hero image
}

export interface ThemeFonts {
  display: string;  // Google Font name — month title, film name
  body: string;     // Google Font name — date numbers, nav
  notes: string;    // Google Font name — notes textarea
  style: FontStyle;
}

export interface GoldenDate {
  day: number;          // 1–31
  fact: string;         // trivia shown on hover
  filmReference: string; // e.g. "DDLJ (1995)"
}

export interface FilmTheme {
  id: FilmId;
  monthIndex: MonthIndex;
  filmTitle: string;
  year: number;
  director: string;
  tagline: string;         // shown in hero panel
  colors: ThemeColors;
  fonts: ThemeFonts;
  grain: GrainIntensity;
  goldenDates: GoldenDate[];
  heroGradient: string;    // CSS gradient string for hero bg
  // Mughal-E-Azam special: starts grayscale
  startsGrayscale?: boolean;
}