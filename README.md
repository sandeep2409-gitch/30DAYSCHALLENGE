# 30‑Days Web Apps Challenge 🚀

Welcome to the **30‑Days Web Apps Challenge** – a hands‑on learning journey where we build a fresh web application every day for 30 days. Each day focuses on a different use‑case, technology stack, and design pattern, helping you sharpen your front‑end skills, explore modern tooling, and build a portfolio of polished projects.

---

## 📚 About the Challenge

- **Goal**: Create 30 small yet fully functional web apps (React, Vite, vanilla JS, etc.) in 30 days.
- **Daily workflow** (≈30 min):
  1️⃣ **Build** – Code the app (6‑8 h total per day, but the core implementation fits in a few hours).
  2️⃣ **Document** – Add a README, screenshots, and a brief description (≈15 min).
  3️⃣ **Push** – Commit and push to GitHub (≈5 min).
  4️⃣ **Post** – Share on LinkedIn or Twitter with a link to the repo (≈10 min).
- **Tools**:
  - Node / npm (React, Vite, Chart.js, etc.)
  - Python/Flask for optional back‑ends
  - VS Code, Postman, Git

> For the full daily checklist and optional tooling, see `files/30‑webapps‑challenge‑guide.md`.

---

## 📂 Repository Structure

```
30‑DAYS‑CHALLENGE/
├─ DAY1 – <app‑name>/
├─ DAY2 – <app‑name>/
├─ DAY3 – WEATHER APP/
│   ├─ src/ …
│   └─ .env.example   # (removed secret before push)
├─ DAY4 – EXPENSE TRACKER/
│   ├─ src/ …
│   └─ student_expenses_5000.json
├─ DAY5 – …
│   …
├─ files/
│   └─ 30‑webapps‑challenge‑guide.md
└─ README.md   ← (this file)
```

Each **DAY‑** folder contains a self‑contained project with its own `package.json`. The top‑level repo is a plain Git workspace that aggregates all daily apps.

---

## ⚡ Getting Started

### Prerequisites

- **Node.js ≥ 20** (recommended) – install from <https://nodejs.org/>.
- **Git** – already set up for this repository.
- Optionally **Python 3** if you experiment with the Flask back‑ends.

### Clone the repository

```bash
git clone https://github.com/sandeep2409-gitch/30-DAYS-CHALLENGE.git
cd 30-DAYS-CHALLENGE
```

### Run a specific day’s app

Navigate into the day folder, install dependencies, and start the dev server:

```bash
# Example: Day 4 – Expense Tracker
cd "DAY4 -- EXPENSE TRACKER"
npm install
npm run dev
# Open http://localhost:5173 in your browser
```

Repeat the same steps for any other day (e.g., `DAY3 -- WEATHER APP`).

---

## 📅 Highlighted Apps (so far)

| Day | App | Description | Run Command |
|-----|-----|-------------|-------------|
| **Day 3** | **Weather App** | Minimal weather forecast UI using the OpenWeatherMap API (API key removed for security). | `cd "DAY3 -- WEATHER APP" && npm install && npm run dev` |
| **Day 4** | **Expense Tracker** | Premium‑looking expense tracker with Chart.js visualisations, local‑storage persistence, and a sample Indian‑student budget (≤ ₹5 000). | `cd "DAY4 -- EXPENSE TRACKER" && npm install && npm run dev` |

*(Add additional rows as new days are completed.)*

---

## 📸 Screenshots

> Add screenshots for each day in the corresponding folder’s `README.md` or a central `docs/` folder. Use the markdown image syntax, e.g.:
>
> ```markdown
> ![Expense Tracker dashboard](DAY4%20--%20EXPENSE%20TRACKER/screenshots/dashboard.png)
> ```

---

## 🤝 Contributing

1. **Fork** the repository.
2. Create a new branch for your day’s app:
   ```bash
   git checkout -b day5‑my‑new‑app
   ```
3. Add your project under a new `DAY5 – <App Name>` folder.
4. Follow the same **README + screenshot** pattern as existing days.
5. Open a **Pull Request** – we’ll review and merge!

Please keep the repo clean: no API keys or secrets should be committed. If you need environment variables, add them to `.env.example` with placeholder values and list the real keys in a private location.

---

## 📄 License

This repository is licensed under the **MIT License** – feel free to clone, modify, and share the projects.

---

## 📣 Stay Connected

- Follow the author on **LinkedIn** and **Twitter** for daily updates.
- Share your own builds using the hashtag `#30DaysWebApps`.

Happy coding! 🎉
