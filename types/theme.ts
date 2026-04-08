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

export interface ThemeColors {
  // Paper base - light, warm, cream tones
  paper: string;          // main calendar paper color
  paperAlt: string;       // slightly different paper tone
  ink: string;            // primary text ink color
  inkLight: string;       // secondary text
  accent: string;         // movie-specific accent (selection, highlights)
  accentSoft: string;     // soft version for range fill
  accentDark: string;     // darker accent for selected dates
  border: string;         // lines, grid borders
  borderLight: string;    // lighter grid lines
  gold: string;           // golden date markers
  shadow: string;         // paper shadow
  headerBg: string;       // month header background
  headerText: string;     // month header text
}

export interface GoldenDate {
  day: number;
  fact: string;
  filmReference: string;
}

export interface FilmTheme {
  id: FilmId;
  monthIndex: MonthIndex;
  filmTitle: string;
  shortTitle: string;
  year: number;
  director: string;
  tagline: string;
  quote: string;          // famous movie quote for paper decoration
  colors: ThemeColors;
  heroImage: string;      // Unsplash URL
  accentPattern: string;  // CSS gradient for decorative elements
  mood: string;           // e.g. "romantic", "gritty", "epic"
  goldenDates: GoldenDate[];
}