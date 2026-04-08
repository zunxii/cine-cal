Phase 1 — Foundation
  ├── Theme config (12 film themes as TS objects)
  ├── Zustand store (activeMonth, selectedRange, notes)
  └── CSS custom property injection per theme

Phase 2 — Core UI
  ├── Calendar grid (date math, week rows)
  ├── Range selection (start/end/in-between states)
  └── Month navigation (prev/next)

Phase 3 — Cinematic Layer
  ├── Hero panel (per-month SVG scene / styled bg)
  ├── GSAP projector flicker on month change
  └── Golden date markers (✦) + hover tooltip cards

Phase 4 — Notes
  ├── Director's notebook UI
  ├── Auto-stamp header from date range
  └── localStorage per month

Phase 5 — Responsive
  ├── Desktop split-panel layout
  └── Mobile stacked layout

Phase 6 — Polish
  ├── Film grain overlays (CSS noise texture)
  ├── Per-month font switching
  ├── Mughal-E-Azam grayscale → color on hover
  └── Transition refinement