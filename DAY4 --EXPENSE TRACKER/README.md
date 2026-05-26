# 🪙 Capitally — Premium Expense Tracker

Welcome to **Capitally**, a high-fidelity personal finance dashboard and smart budget visualizer. This project was built as **Day 4** of the **30 WebApps in 30 Days Challenge**.

It features a stunning modern glassmorphism user interface, dynamic background aurora glows, custom interactive charts powered by **Chart.js**, budget limitation indicators, searchable transaction tables, and full local backup/restore options.

---

## ✨ Features

1. **Frosted Glass UI & Visual Aesthetics:**
   - Soft background grid mesh auroras animating in the background.
   - Glass cards styled using `backdrop-filter: blur(16px)` and customizable CSS glowing drop-shadows.
   - Customized rounded neon scrollbars.
   - **Three Curated Themes:**
     - 🌌 **Space Indigo (Dark):** Default deep space palette with vibrant purple and indigo accents.
     - ❄️ **Frosted Glass (Light):** Professional bright theme with ice-blue blurs and clean dark-slate lettering.
     - ⚡ **Cyberpunk Gold (Cyber):** Dark black high-contrast theme featuring neon-gold borders and bright pink highlights.

2. **Interactive Chart.js Insights:**
   - 📈 **Spending Chronology (Area/Line Chart):** Visualizes day-to-day spending with smooth cubic bezier tension and glowing accent color gradients.
   - 🍩 **Category Allocation (Doughnut Chart):** Inner rings showing percentage share per category with hover offsets and a custom-centered total sum.
   - 📊 **Monthly Cash Flow (Grouped Bar Chart):** Side-by-side comparison of total Income vs Expenses.

3. **Smart Budget Controls:**
   - Set monthly limits on specific spending categories.
   - Smooth progress bars that transition colors based on budget utilization (Green $\le$ 80%, Orange &gt; 80% to 100%, Vibrant Warning Red when exceeded).
   - Instant Dashboard metrics monitoring alerts.

4. **Robust Transaction Ledger:**
   - Log income and expenses with descriptions, notes, and group tags.
   - Custom relative date helpers ("Today", "Yesterday") in the pop-up transaction form.
   - Real-time search across descriptions, notes, and tags.
   - Sort by Date or Amount and filter by Category, Flow type, or Payment Method (Card, Transfer, Cash).
   - Inline Quick Edit and Delete hooks.

5. **State Persistence & Data Portability:**
   - Instant persistence utilizing browser `LocalStorage`.
   - **Backup JSON:** Save your entire record list + budgets in a single JSON backup.
   - **Import Backup:** Restore past records by uploading a valid JSON file.
   - **Export CSV:** Output all transactions into a clean spreadsheet format compatible with Excel or Google Sheets.

---

## 🛠️ Tech Stack

- **Core Framework:** React 19 (TypeScript)
- **Bundler & Tooling:** Vite
- **Visual Charting:** Chart.js + `react-chartjs-2`
- **Icons:** `lucide-react`
- **Design & Layouts:** HSL Vanilla CSS (Frosted theme grid styles)

---

## 🚀 Getting Started

Follow these steps to run the application locally:

### 1. Install Dependencies
Navigate into the Day 4 folder and install packages:
```bash
npm install
```

### 2. Start Development Server
Run the local dev server:
```bash
npm run dev
```
Open the local URL displayed in your terminal (typically `http://localhost:5173`) in your browser.

### 3. Production Build
Compile and bundle the project for optimal production performance:
```bash
npm run build
```

---

## 🎓 Indian Student Expense Example (Under ₹5,000)

We have bundled a pre-populated dataset demonstrating a typical **Indian Student Monthly Budget under ₹5,000** (totaling **₹4,478** in expenses against **₹6,000** in part-time/allowance incomes).

To import this scenario:
1. Ensure the app is running (`npm run dev`).
2. Click **"Import Backup"** in the sidebar.
3. Select the file **`student_expenses_5000.json`** located in the root of this project folder.
4. The charts, warning gauges, and ledger list will automatically load and animate to visualize the student budget dataset.
