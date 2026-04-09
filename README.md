# 🎬 Cine Calendar

A cinematic, interactive calendar web app with smooth page transitions, film-inspired themes, and note-taking features.

---

## ✨ Features

- 📅 Dynamic monthly calendar with smooth navigation  
- 🎞️ Cinematic page-flip animations (Framer Motion)  
- 🎨 Theme changes based on month (film-inspired aesthetics)  
- 📝 Notes system for each month  
- ⭐ Mark important dates  
- 🖱️ Right-click context menu for quick actions  
- 📱 Fully responsive (mobile + desktop)  
- ⌨️ Keyboard navigation (arrow keys)

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  
- **Animations:** Framer Motion  
- **State Management:** Zustand  
- **Icons:** Lucide React  

---

## 🧠 Architecture

The project is structured in a modular way for scalability:

```

app/
page.tsx        → Main calendar page

components/
calendar/
CalendarGrid
HeroSection
SidebarPanel
SpiralBinding
NoteDialog
DateContextMenu
EasterEggs
NotePreview

lib/
calendarUtils   → Calendar logic

store/
calendarStore   → Zustand state

data/
theme.ts        → Monthly themes

````

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/your-username/cine-calendar.git

# Navigate into project
cd cine-calendar

# Install dependencies
npm install

# Run development server
npm run dev
````

---

## 🏗️ Build

```bash
npm run build
npm start
```

---

## 🎮 Usage

* Use **arrow keys** or buttons to navigate months
* Click dates to select ranges
* Right-click a date for actions
* Add notes for each month
* Mark important dates

---

## 🎨 Highlights

* Custom **page transition system** using directional animations
* Theme injection system for dynamic styling
* Optimized rendering using `useMemo`, `useCallback`
* Clean separation of UI + logic

---

## 📸 Preview

> Live Demo - https://youtu.be/wt243nSVDBs

---

## 🛠️ Future Improvements

* 🔗 Export calendar as PDF
* ☁️ Cloud sync for notes
* 👥 User authentication
* 🎬 More cinematic themes

---

## 👤 Author

**Junaid**
---

## ⭐ Show your support

If you like this project, give it a ⭐ on GitHub!

```
```
