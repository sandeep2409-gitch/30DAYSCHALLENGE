# 🚀 Day 2: CalcuFrost — Premium Glassmorphic Calculator

Part of the **30 WebApps in 30 Days Challenge**. An ultra-premium, interactive glassmorphic calculator built entirely with Vanilla HTML, CSS, and JavaScript. 

CalcuFrost features a custom, safe recursive descent mathematical parsing engine (completely avoiding dangerous `eval`), smart live calculation previews, nested parenthetical implicit multiplication, localized haptic audio synthesis, full keyboard bindings with visual keypad flashes, and a persistent calculation history workspace.

---

## 📱 Live Demo Screen Overview

* **Desktop View**: A beautiful side-by-side frosted-glass dashboard featuring the active calculator keypad on the left and a continuous scrolling history log card stream on the right.
* **Mobile View**: A centered responsive keypad with an elegant sliding drawer overlay that slides in from the right to reveal history logs on demand.
* **Themes**: Implements dark-mode (default, deep midnight space obsidian theme with glowing neon accent buttons) and light-mode (frosted silver, soft lavenders, and pastel violet gradients).

---

## 🛠️ Tech Stack & Architecture

* **Core Structure**: Semantic HTML5 with accessibility attributes (`aria-live`, `role="grid"`, `aria-label`).
* **Visual Layer**: Modern Vanilla CSS3 utilizing:
  * Dense `backdrop-filter: blur(24px) saturate(180%)` for premium glassmorphism.
  * Pulsing background gradient orb glows (`@keyframes` animations).
  * Tactile transitions (`transform: scale(0.93)` on press, custom CSS variable themes).
  * Responsive Flex/Grid breakpoints that scale seamlessly from 320px viewports up to desktop resolutions.
* **Logic & Math Engine**: Vanilla ES6 JavaScript featuring:
  * Safe recursive descent mathematical parser (no `eval()` usage).
  * Synthesized key-tap feedback using the **Web Audio API** (local click synthesis).
  * Comprehensive physical keyboard bindings.
  * Browser-native `localStorage` integration for persistent history records and theme alignment.

---

## ✨ Key Features

1. **Safe & Robust Mathematical Parser**:
   - Parses floating-point decimals, positive/negative operations (`±`), nested brackets, and basic arithmetic (`+`, `-`, `*`, `/`, `%`).
   - Supports **implicit multiplication**, allowing inputs like `2(3+4)` to parse as `14`, or `(5+5)2` to parse as `20`.
   - Elegant error boundaries that catch syntax issues, unclosed brackets, and division-by-zero errors gracefully.

2. **Smart Live Calculation Preview**:
   - As you type, the lower screen displays an active result preview (e.g. `= 12`) in a dimmed layout.
   - Intelligent preprocessing: Before evaluating the preview, CalcuFrost automatically slices off incomplete trailing operators (e.g. typing `5 + 2 ×` displays `= 7`) and virtually completes unclosed parentheses (e.g. `10 ÷ (2 + 3` displays `= 2`).

3. **Double-Pane Workspace & sliding Drawer History**:
   - Desktop view keeps your previous 50 calculations easily visible side-by-side.
   - History logs persist across browser tabs and refreshes.
   - **Interactive History Modal**: Clicking any calculation card in the history log presents a pop-up dialog with options:
     - *Restore Formula*: Reloads the entire equation back into the editor to continue building.
     - *Insert Result at Cursor*: Places the numerical result (without display commas) into your current equation, appending implicit multiplication if placed adjacent to a number.

4. **Web Audio Haptic Synthesis**:
   - Synthesizes a soft, organic, high-frequency sine-wave decay click locally on every key click or physical keypress.
   - Instantly responsive, requiring zero external MP3 network requests or assets.

5. **Physical Keyboard Mappings**:
   - Fully interactive desktop typing matching native standards:
     * `0` - `9` and `.` (Decimal) -> Digits
     * `+`, `-`, `*`, `/`, `%` -> Operators
     * `(`, `)` -> Parentheses
     * `Enter` or `=` -> Evaluate & Push to History
     * `Backspace` -> Delete character
     * `Escape` or `c` / `C` -> Clear screen
   - **Visual Keyboard Feedback**: Pressing a physical key temporarily adds a `.keyboard-active` CSS class to the corresponding screen button, making it flash visually and mimic tactile hardware.

---

## ⚙️ How to Run Locally

Since this app is built purely with standard client-side web technologies, no builders or servers are strictly required!

1. Clone or navigate to the folder:
   ```bash
   cd "DAY2 -- CALCULATOR APP"
   ```
2. Double-click `index.html` to open it directly in any modern browser, or run a simple local development server:
   ```bash
   # Using VS Code: Right-click index.html -> Open with Live Server
   # Using Python (built-in):
   python3 -m http.server 8000
   # Using Node.js (npx):
   npx serve .
   ```
3. Open your browser and go to `http://localhost:8000` (or the server's provided address) to interact!

---

## 💡 What I Learned

* **Compilers & Parsing Grammars**: Writing a safe LL(1) recursive descent compiler for expressions in JavaScript. Moving beyond dangerous `eval()` patterns forces a deep understanding of tokens, lexing, parser ASTs, and binding operator precedence (`*`, `/`, `%` over `+`, `-`).
* **Progressive Enhancement**: Auto-correcting mathematical inputs dynamically in the background. Synthetically completing brackets or stripping operators for the live preview creates a highly responsive, polished interface.
* **Audio Synthesis on the Web**: The **Web Audio API** is incredibly light and powerful. Instead of serving audio static assets, generating clean sound waves programmatically yields instant, zero-latency micro-interactions.
* **Responsive Layout Paradigms**: Designing CSS grids that naturally transition from desktop dashboard systems down to hidden sliding drawers on mobile devices, maintaining a single clean, accessible DOM structure.
