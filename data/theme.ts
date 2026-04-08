import type { FilmTheme } from "@/types/theme";

export const FILM_THEMES: readonly FilmTheme[] = [
  // ─── JANUARY — DDLJ ───────────────────────────────────────────────
  {
    id: "ddlj",
    monthIndex: 0,
    filmTitle: "Dilwale Dulhania Le Jayenge",
    year: 1995,
    director: "Aditya Chopra",
    tagline: "Come, fall in love.",
    colors: {
      bg:          "#1a1008",
      surface:     "#2c1f0e",
      accent:      "#d4a017",
      accentAlt:   "#8b5e0a",
      text:        "#f5e6c8",
      textMuted:   "#a08858",
      border:      "#3d2d14",
      highlight:   "#f0c040",
      heroOverlay: "linear-gradient(to bottom, rgba(26,16,8,0) 40%, rgba(26,16,8,0.95) 100%)",
    },
    fonts: {
      display: "Playfair Display",
      body:    "Lora",
      notes:   "Kalam",
      style:   "romantic",
    },
    grain: "subtle",
    heroGradient:
      "linear-gradient(135deg, #3d2a0a 0%, #7a5218 40%, #c4871a 70%, #1a1008 100%)",
    goldenDates: [
      {
        day: 13,
        fact:
          "DDLJ ran for 1,009 consecutive weeks at Maratha Mandir, Mumbai — a world record for a single-screen theatrical run.",
        filmReference: "DDLJ (1995)",
      },
      {
        day: 20,
        fact:
          "Shah Rukh Khan was not the first choice — the role was offered to Saif Ali Khan, who turned it down.",
        filmReference: "DDLJ (1995)",
      },
    ],
  },

  // ─── FEBRUARY — KKHH ──────────────────────────────────────────────
  {
    id: "kkhh",
    monthIndex: 1,
    filmTitle: "Kuch Kuch Hota Hai",
    year: 1998,
    director: "Karan Johar",
    tagline: "You only fall in love once.",
    colors: {
      bg:          "#0d1b2e",
      surface:     "#162440",
      accent:      "#e84393",
      accentAlt:   "#a01f60",
      text:        "#f0f4ff",
      textMuted:   "#7a90b8",
      border:      "#1e3054",
      highlight:   "#ff6eb4",
      heroOverlay: "linear-gradient(to bottom, rgba(13,27,46,0) 40%, rgba(13,27,46,0.95) 100%)",
    },
    fonts: {
      display: "Bebas Neue",
      body:    "Nunito",
      notes:   "Kalam",
      style:   "collegiate",
    },
    grain: "none",
    heroGradient:
      "linear-gradient(135deg, #0d1b2e 0%, #1e3a6e 40%, #e84393 80%, #0d1b2e 100%)",
    goldenDates: [
      {
        day: 16,
        fact:
          "Salman Khan's cameo was written overnight after the original actor dropped out just 48 hours before the shoot.",
        filmReference: "KKHH (1998)",
      },
      {
        day: 22,
        fact:
          "The St. Teresa's school set was built from scratch in Film City — Karan Johar wanted it to feel like a real institution, not a set.",
        filmReference: "KKHH (1998)",
      },
    ],
  },

  // ─── MARCH — RANG DE BASANTI ──────────────────────────────────────
  {
    id: "rdb",
    monthIndex: 2,
    filmTitle: "Rang De Basanti",
    year: 2006,
    director: "Rakeysh Omprakash Mehra",
    tagline: "A generation awakens.",
    colors: {
      bg:          "#1c1200",
      surface:     "#2e1f00",
      accent:      "#e8a020",
      accentAlt:   "#c0521a",
      text:        "#f5ead0",
      textMuted:   "#9a7a3a",
      border:      "#3a2800",
      highlight:   "#ffcc44",
      heroOverlay: "linear-gradient(to bottom, rgba(28,18,0,0) 30%, rgba(28,18,0,0.95) 100%)",
    },
    fonts: {
      display: "Oswald",
      body:    "Source Sans 3",
      notes:   "Kalam",
      style:   "modern",
    },
    grain: "medium",
    heroGradient:
      "linear-gradient(135deg, #1c1200 0%, #5a3800 30%, #e8a020 65%, #c0521a 100%)",
    goldenDates: [
      {
        day: 27,
        fact:
          "The AR Rahman score was recorded across studios in three countries simultaneously — Chennai, London, and Los Angeles.",
        filmReference: "Rang De Basanti (2006)",
      },
      {
        day: 5,
        fact:
          "The film was in development for 8 years. Rakeysh Mehra first pitched it in 1997 and faced over 40 rejections.",
        filmReference: "Rang De Basanti (2006)",
      },
    ],
  },

  // ─── APRIL — GANGS OF WASSEYPUR ───────────────────────────────────
  {
    id: "gow",
    monthIndex: 3,
    filmTitle: "Gangs of Wasseypur",
    year: 2012,
    director: "Anurag Kashyap",
    tagline: "Revenge is a dish best served coal-black.",
    colors: {
      bg:          "#0a0a0a",
      surface:     "#141414",
      accent:      "#c0392b",
      accentAlt:   "#7a1a10",
      text:        "#e8e0d0",
      textMuted:   "#666050",
      border:      "#222222",
      highlight:   "#e85020",
      heroOverlay: "linear-gradient(to bottom, rgba(10,10,10,0) 30%, rgba(10,10,10,0.97) 100%)",
    },
    fonts: {
      display: "Teko",
      body:    "Barlow",
      notes:   "Kalam",
      style:   "handpainted",
    },
    grain: "heavy",
    heroGradient:
      "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #4a1a10 70%, #c0392b 100%)",
    goldenDates: [
      {
        day: 5,
        fact:
          "Ramadhir Singh never fires a gun himself in the entire film — a deliberate directorial choice by Kashyap to show power through command, not action.",
        filmReference: "Gangs of Wasseypur (2012)",
      },
      {
        day: 18,
        fact:
          "The film was shot over 63 days across Dhanbad, Varanasi, and Mumbai. Kashyap used real locals as extras to avoid a 'polished' look.",
        filmReference: "Gangs of Wasseypur (2012)",
      },
    ],
  },

  // ─── MAY — SATYA ──────────────────────────────────────────────────
  {
    id: "satya",
    monthIndex: 4,
    filmTitle: "Satya",
    year: 1998,
    director: "Ram Gopal Varma",
    tagline: "The city never sleeps. Neither does the underworld.",
    colors: {
      bg:          "#080c10",
      surface:     "#0f1620",
      accent:      "#4a90d9",
      accentAlt:   "#1a4a7a",
      text:        "#d8e4f0",
      textMuted:   "#4a6080",
      border:      "#1a2030",
      highlight:   "#6ab0f0",
      heroOverlay: "linear-gradient(to bottom, rgba(8,12,16,0) 30%, rgba(8,12,16,0.97) 100%)",
    },
    fonts: {
      display: "Bebas Neue",
      body:    "Barlow Condensed",
      notes:   "Kalam",
      style:   "handpainted",
    },
    grain: "heavy",
    heroGradient:
      "linear-gradient(135deg, #080c10 0%, #0f2040 50%, #1a4a7a 80%, #4a90d9 100%)",
    goldenDates: [
      {
        day: 3,
        fact:
          "Manoj Bajpayee improvised 'Goli maar bheje mein' entirely on set — it was not in the original script and became the film's most quoted line.",
        filmReference: "Satya (1998)",
      },
      {
        day: 21,
        fact:
          "RGV shot the entire film on location in Mumbai's actual chawls — no sets were built. Residents often walked into live shots.",
        filmReference: "Satya (1998)",
      },
    ],
  },

  // ─── JUNE — DEVDAS ────────────────────────────────────────────────
  {
    id: "devdas",
    monthIndex: 5,
    filmTitle: "Devdas",
    year: 2002,
    director: "Sanjay Leela Bhansali",
    tagline: "A love that consumed everything.",
    colors: {
      bg:          "#1a0a1e",
      surface:     "#2a1030",
      accent:      "#9b59b6",
      accentAlt:   "#c0392b",
      text:        "#f5e0ff",
      textMuted:   "#8a6a9a",
      border:      "#3a1a40",
      highlight:   "#e040fb",
      heroOverlay: "linear-gradient(to bottom, rgba(26,10,30,0) 30%, rgba(26,10,30,0.97) 100%)",
    },
    fonts: {
      display: "Playfair Display",
      body:    "EB Garamond",
      notes:   "Kalam",
      style:   "ornate",
    },
    grain: "medium",
    heroGradient:
      "linear-gradient(135deg, #1a0a1e 0%, #4a1060 40%, #9b59b6 70%, #c0392b 100%)",
    goldenDates: [
      {
        day: 12,
        fact:
          "Bhansali used over 200kg of real rose petals in a single chandelier scene — artificial petals were rejected because they didn't fall with the right weight.",
        filmReference: "Devdas (2002)",
      },
      {
        day: 28,
        fact:
          "The production design team built an entire 19th-century Calcutta street — 400 feet long — inside a Mumbai studio. It took 11 months to construct.",
        filmReference: "Devdas (2002)",
      },
    ],
  },

  // ─── JULY — JAB TAK HAI JAAN ──────────────────────────────────────
  {
    id: "jthj",
    monthIndex: 6,
    filmTitle: "Jab Tak Hai Jaan",
    year: 2012,
    director: "Yash Chopra",
    tagline: "Till the end of time.",
    colors: {
      bg:          "#0c1418",
      surface:     "#162028",
      accent:      "#5ba3c9",
      accentAlt:   "#3a6a8a",
      text:        "#e8f4f8",
      textMuted:   "#5a8090",
      border:      "#1e3040",
      highlight:   "#80c8e8",
      heroOverlay: "linear-gradient(to bottom, rgba(12,20,24,0) 30%, rgba(12,20,24,0.97) 100%)",
    },
    fonts: {
      display: "Oswald",
      body:    "Raleway",
      notes:   "Kalam",
      style:   "military",
    },
    grain: "subtle",
    heroGradient:
      "linear-gradient(135deg, #0c1418 0%, #1a3a50 40%, #5ba3c9 75%, #e8f4f8 100%)",
    goldenDates: [
      {
        day: 13,
        fact:
          "The Chhalla sequence was filmed in −15°C in Ladakh. The visible breath mist in every frame is real — no VFX was used.",
        filmReference: "Jab Tak Hai Jaan (2012)",
      },
      {
        day: 25,
        fact:
          "This was Yash Chopra's final film as director. He passed away 12 days before its release, never seeing the audience's reaction.",
        filmReference: "Jab Tak Hai Jaan (2012)",
      },
    ],
  },

  // ─── AUGUST — LAGAAN ──────────────────────────────────────────────
  {
    id: "lagaan",
    monthIndex: 7,
    filmTitle: "Lagaan",
    year: 2001,
    director: "Ashutosh Gowariker",
    tagline: "Once upon a time in India.",
    colors: {
      bg:          "#1a1208",
      surface:     "#2a1e0c",
      accent:      "#c87820",
      accentAlt:   "#8a4e10",
      text:        "#f0e4c8",
      textMuted:   "#8a7040",
      border:      "#3a2a10",
      highlight:   "#e8a840",
      heroOverlay: "linear-gradient(to bottom, rgba(26,18,8,0) 30%, rgba(26,18,8,0.97) 100%)",
    },
    fonts: {
      display: "Teko",
      body:    "Source Sans 3",
      notes:   "Kalam",
      style:   "rustic",
    },
    grain: "medium",
    heroGradient:
      "linear-gradient(135deg, #1a1208 0%, #4a3010 30%, #c87820 65%, #e8c060 100%)",
    goldenDates: [
      {
        day: 15,
        fact:
          "Lagaan's climax cricket match took 53 days to film across two separate trips to Bhuj, Gujarat — the longest single-sequence shoot in Bollywood at the time.",
        filmReference: "Lagaan (2001)",
      },
      {
        day: 7,
        fact:
          "Aamir Khan produced the film himself after every major studio passed. The total budget was ₹25 crore — unprecedented for its era.",
        filmReference: "Lagaan (2001)",
      },
    ],
  },

  // ─── SEPTEMBER — 3 IDIOTS ─────────────────────────────────────────
  {
    id: "three-idiots",
    monthIndex: 8,
    filmTitle: "3 Idiots",
    year: 2009,
    director: "Rajkumar Hirani",
    tagline: "All is well.",
    colors: {
      bg:          "#051828",
      surface:     "#0a2438",
      accent:      "#00b4d8",
      accentAlt:   "#0077a8",
      text:        "#e0f4ff",
      textMuted:   "#4a8aaa",
      border:      "#0f3050",
      highlight:   "#48cae4",
      heroOverlay: "linear-gradient(to bottom, rgba(5,24,40,0) 30%, rgba(5,24,40,0.97) 100%)",
    },
    fonts: {
      display: "Nunito",
      body:    "Nunito",
      notes:   "Kalam",
      style:   "collegiate",
    },
    grain: "none",
    heroGradient:
      "linear-gradient(135deg, #051828 0%, #0a4060 40%, #00b4d8 75%, #e0f4ff 100%)",
    goldenDates: [
      {
        day: 25,
        fact:
          "'All izz well' was added during post-production — the original script had no catchphrase. Hirani felt the film needed a unifying emotional anchor.",
        filmReference: "3 Idiots (2009)",
      },
      {
        day: 10,
        fact:
          "The Ladakh sequences were filmed at Pangong Lake at 14,000 feet altitude. Several crew members required oxygen tanks on set.",
        filmReference: "3 Idiots (2009)",
      },
    ],
  },

  // ─── OCTOBER — MUGHAL-E-AZAM ──────────────────────────────────────
  {
    id: "mughal-e-azam",
    monthIndex: 9,
    filmTitle: "Mughal-E-Azam",
    year: 1960,
    director: "K. Asif",
    tagline: "The emperor of all films.",
    colors: {
      bg:          "#0e0e0e",
      surface:     "#1a1a1a",
      accent:      "#c9a84c",
      accentAlt:   "#7a6020",
      text:        "#f0ead8",
      textMuted:   "#706050",
      border:      "#2a2a2a",
      highlight:   "#e8c86a",
      heroOverlay: "linear-gradient(to bottom, rgba(14,14,14,0) 30%, rgba(14,14,14,0.97) 100%)",
    },
    fonts: {
      display: "Playfair Display",
      body:    "EB Garamond",
      notes:   "Kalam",
      style:   "classical",
    },
    grain: "heavy",
    heroGradient:
      "linear-gradient(135deg, #0e0e0e 0%, #2a2a2a 40%, #7a6020 70%, #c9a84c 100%)",
    startsGrayscale: true,
    goldenDates: [
      {
        day: 5,
        fact:
          "K. Asif built actual marble sets — he refused painted backdrops entirely. One set used 500 tonnes of real marble shipped from Rajasthan.",
        filmReference: "Mughal-E-Azam (1960)",
      },
      {
        day: 19,
        fact:
          "The film took 9 years to complete and used over 8,000 extras in the war sequence — the largest ever assembled for an Indian film at the time.",
        filmReference: "Mughal-E-Azam (1960)",
      },
    ],
  },

  // ─── NOVEMBER — DIL CHAHTA HAI ────────────────────────────────────
  {
    id: "dil-chahta-hai",
    monthIndex: 10,
    filmTitle: "Dil Chahta Hai",
    year: 2001,
    director: "Farhan Akhtar",
    tagline: "Three friends. One summer. No rules.",
    colors: {
      bg:          "#0a1428",
      surface:     "#121e38",
      accent:      "#2ecc71",
      accentAlt:   "#1a8a4a",
      text:        "#e8f0ff",
      textMuted:   "#4a6090",
      border:      "#1a2840",
      highlight:   "#50e890",
      heroOverlay: "linear-gradient(to bottom, rgba(10,20,40,0) 30%, rgba(10,20,40,0.97) 100%)",
    },
    fonts: {
      display: "Bebas Neue",
      body:    "Raleway",
      notes:   "Kalam",
      style:   "modern",
    },
    grain: "none",
    heroGradient:
      "linear-gradient(135deg, #0a1428 0%, #0a3060 40%, #1a8a4a 70%, #2ecc71 100%)",
    goldenDates: [
      {
        day: 10,
        fact:
          "DCH is credited with ending Bollywood's family-drama era and launching modern urban Hindi cinema — Farhan Akhtar was 26 when he wrote and directed it.",
        filmReference: "Dil Chahta Hai (2001)",
      },
      {
        day: 23,
        fact:
          "The Goa sequences were entirely improvised on location. Akhtar gave the three leads one rule: act like you actually are on a road trip together.",
        filmReference: "Dil Chahta Hai (2001)",
      },
    ],
  },

  // ─── DECEMBER — BAJIRAO MASTANI ───────────────────────────────────
  {
    id: "bajirao",
    monthIndex: 11,
    filmTitle: "Bajirao Mastani",
    year: 2015,
    director: "Sanjay Leela Bhansali",
    tagline: "A warrior. A lover. A legend.",
    colors: {
      bg:          "#120800",
      surface:     "#1e1000",
      accent:      "#d4a017",
      accentAlt:   "#8b1a1a",
      text:        "#f5e8d0",
      textMuted:   "#8a6840",
      border:      "#2e1800",
      highlight:   "#f0c840",
      heroOverlay: "linear-gradient(to bottom, rgba(18,8,0,0) 30%, rgba(18,8,0,0.97) 100%)",
    },
    fonts: {
      display: "Playfair Display",
      body:    "EB Garamond",
      notes:   "Kalam",
      style:   "ornate",
    },
    grain: "medium",
    heroGradient:
      "linear-gradient(135deg, #120800 0%, #3a1800 30%, #8b1a1a 60%, #d4a017 100%)",
    goldenDates: [
      {
        day: 18,
        fact:
          "Deepika Padukone's ghungroo training began 8 months before the shoot — she practiced 6 hours daily to perform the Mohe Rang Do Laal sequence live.",
        filmReference: "Bajirao Mastani (2015)",
      },
      {
        day: 4,
        fact:
          "Bhansali spent ₹2 crore on a single set of Mastani's palace — it was demolished immediately after filming and never reused.",
        filmReference: "Bajirao Mastani (2015)",
      },
    ],
  },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getThemeByMonth(monthIndex: number): FilmTheme {
  const theme = FILM_THEMES.find((t) => t.monthIndex === monthIndex);
  if (!theme) throw new Error(`No theme found for monthIndex: ${monthIndex}`);
  return theme;
}

export function getGoldenDaysForMonth(monthIndex: number): Set<number> {
  const theme = getThemeByMonth(monthIndex);
  return new Set(theme.goldenDates.map((g) => g.day));
}

export function getGoldenFact(
  monthIndex: number,
  day: number
): { fact: string; filmReference: string } | null {
  const theme = getThemeByMonth(monthIndex);
  const golden = theme.goldenDates.find((g) => g.day === day);
  return golden
    ? { fact: golden.fact, filmReference: golden.filmReference }
    : null;
}