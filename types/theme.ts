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
  paper: string;
  paperAlt: string;
  ink: string;
  inkLight: string;
  accent: string;
  accentSoft: string;
  accentDark: string;
  border: string;
  borderLight: string;
  gold: string;
  shadow: string;
  headerBg: string;
  headerText: string;
}

export interface GoldenDate {
  day: number;
  fact: string;
  filmReference: string;
}

export interface EasterEgg {
  type: "dialogue" | "silhouette" | "symbol" | "stamp";
  content: string;
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right" | "center";
}

export interface FilmTheme {
  id: FilmId;
  monthIndex: MonthIndex;
  filmTitle: string;
  shortTitle: string;
  year: number;
  director: string;
  tagline: string;
  quote: string;
  mood: string;
  colors: ThemeColors;
  heroImage: string;
  accentPattern: string;
  goldenDates: GoldenDate[];
  easterEggs: EasterEgg[];
}