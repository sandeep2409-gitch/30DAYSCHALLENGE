#!/bin/bash

# 30 WebApps in 30 Days - GitHub Setup Script
# Run this ONCE to initialize your repository structure

echo "🚀 Setting up 30-WebApps-30-Days repository..."

# Create main folders for each day
for i in {01..30}; do
  mkdir -p "0$i-app-$i"
done

# Create documentation folders
mkdir -p docs
mkdir -p .github/workflows

# Create root README
cat > README.md << 'EOF'
# 🚀 30 WebApps in 30 Days Challenge

A progressive journey building 30 fully functional web applications in 30 days using varied tech stacks. Showcasing full-stack development, APIs, databases, machine learning, and real-time applications.

## 📊 Challenge Overview

- **Start Date**: [Your Start Date]
- **Duration**: 30 consecutive days
- **Goal**: Build, deploy, and document 30 web applications
- **Audience**: Developers, recruiters, tech enthusiasts
- **Status**: 🔄 In Progress

## 📈 Progress Tracker

| Week | Apps | Status | Notes |
|------|------|--------|-------|
| Week 1 | Days 1-7 | ⏳ Upcoming | Foundation Week |
| Week 2 | Days 8-14 | ⏳ Upcoming | Interactivity Week |
| Week 3 | Days 15-21 | ⏳ Upcoming | Full-Stack Week |
| Week 4 | Days 22-30 | ⏳ Upcoming | Advanced Week |

---

## 📱 All 30 Apps at a Glance

### Week 1: Foundation Week
- **Day 1**: [Todo App](#) — React + LocalStorage
- **Day 2**: [Calculator](#) — Vanilla JS
- **Day 3**: [Weather App](#) — Vue + API
- **Day 4**: [Expense Tracker](#) — React + Charts
- **Day 5**: [Timer](#) — Vanilla JS
- **Day 6**: [Color Palette](#) — React
- **Day 7**: [Markdown Previewer](#) — Vue

### Week 2: Interactivity Week
- **Day 8**: [URL Shortener](#) — Node.js + MongoDB
- **Day 9**: [Quote Generator](#) — React + API
- **Day 10**: [Drawing App](#) — Canvas + JS
- **Day 11**: [Password Generator](#) — Vue
- **Day 12**: [Music Playlist](#) — React + API
- **Day 13**: [Chat UI](#) — React
- **Day 14**: [Journal App](#) — Svelte + IndexedDB

### Week 3: Full-Stack Week
- **Day 15**: [Notes App](#) — React + Firebase
- **Day 16**: [GitHub Finder](#) — Node.js + API
- **Day 17**: [Movie Search](#) — React + TMDB
- **Day 18**: [E-commerce Cart](#) — Vue
- **Day 19**: [Book Finder](#) — Flask + SQLite
- **Day 20**: [Food Delivery UI](#) — React
- **Day 21**: [Stock Tracker](#) — Node.js + API

### Week 4: Advanced Week
- **Day 22**: [Handwriting Recognition](#) — Flask + TensorFlow
- **Day 23**: [Real-time Chat](#) — Node.js + Socket.io
- **Day 24**: [Text Summarizer](#) — Python + Hugging Face
- **Day 25**: [Kanban Board](#) — React + Drag-Drop
- **Day 26**: [Music Visualizer](#) — Web Audio API
- **Day 27**: [Code Snippets Manager](#) — MERN Stack
- **Day 28**: [Sentiment Analysis](#) — Flask + NLP
- **Day 29**: [Real Estate Portal](#) — Full-Stack
- **Day 30**: [Portfolio Website](#) — React + Next.js

---

## 🛠️ Tech Stack Breakdown

| Category | Technologies Used |
|----------|-------------------|
| **Frontend** | React, Vue.js, Svelte, Vanilla JavaScript, HTML5/CSS3 |
| **Backend** | Node.js/Express, Python/Flask |
| **Databases** | MongoDB, Firebase, SQLite, PostgreSQL, IndexedDB |
| **APIs** | OpenWeather, GitHub, TMDB, Spotify, Alpha Vantage |
| **ML/AI** | TensorFlow, Hugging Face, scikit-learn |
| **Styling** | CSS3, Tailwind CSS, Bootstrap |
| **Tools** | Git, GitHub, Postman, VSCode |

---

## 📚 How to Use This Repository

### 1. Navigate to Any Day's App
```bash
cd 01-todo-app
npm install
npm start
```

### 2. View the README for Each App
Each app has its own `README.md` with:
- What was built
- How to run locally
- Key learnings
- Screenshots/GIFs

### 3. Track Progress
- Check the `docs/progress.md` for daily updates
- See LinkedIn post summaries in `docs/posts.md`

---

## 🔗 Daily Posts & Documentation

All daily LinkedIn posts and detailed learning notes are in:
- 📝 **Posts**: `docs/linkedin-posts.md`
- 📖 **Learnings**: `docs/learning-log.md`
- ✅ **Checklist**: `docs/daily-checklist.md`

---

## 🎯 Key Features Across All Apps

✅ **30 Different Tech Stacks**  
✅ **Well-Documented Code**  
✅ **Progressive Difficulty**  
✅ **Portfolio-Ready Projects**  
✅ **Real APIs Integration**  
✅ **Database Usage**  
✅ **ML/AI Implementation** (Days 22-24, 28)  
✅ **Real-Time Features** (Day 23)  
✅ **Responsive Design**  

---

## 📊 Stats & Metrics

- **Total Lines of Code**: [Will Update]
- **GitHub Commits**: [Will Update]
- **Average Build Time**: 6-8 hours per app
- **Technologies Learned**: 20+
- **APIs Integrated**: 10+
- **LinkedIn Engagement**: [Tracking]

---

## 🚀 Getting Started

1. **Clone this repo**
   ```bash
   git clone https://github.com/yourname/30-webapps-30-days.git
   cd 30-webapps-30-days
   ```

2. **Check out Day 1**
   ```bash
   cd 01-todo-app
   cat README.md
   ```

3. **Follow along on LinkedIn**
   - Daily posts with screenshots & learnings
   - Engage with the community
   - Share your own building journey!

4. **Star ⭐ this repo** if you find it helpful!

---

## 📞 Connect With Me

- **LinkedIn**: [Your LinkedIn URL]
- **GitHub**: [Your GitHub URL]
- **Email**: [Your Email]

---

## 📄 License

This project is open source. Feel free to use, modify, and share!

---

## 🙏 Acknowledgments

- [Inspiration sources]
- [Resources used]
- Thanks to everyone following along!

---

**Last Updated**: May 23, 2026  
**Challenge Status**: 🚀 LIVE

*Built with passion, code, and coffee ☕*
EOF

echo "✅ README.md created!"

# Create SETUP.md
cat > SETUP.md << 'EOF'
# 🛠️ Setup Guide - Run Each App Locally

## Prerequisites

Before running any app, ensure you have:

```bash
# Node.js & npm
node --version  # Should be v16+
npm --version

# Python & pip
python --version  # Should be 3.8+
pip --version

# Git
git --version
```

## React Apps Setup

```bash
cd [app-folder]
npm install
npm start
```

The app will open at `http://localhost:3000`

## Vue Apps Setup

```bash
cd [app-folder]
npm install
npm run dev
```

The app will open at `http://localhost:5173`

## Node.js/Express Apps Setup

```bash
cd [app-folder]
npm install
npm start
# or
node server.js
```

Server typically runs at `http://localhost:5000`

## Python/Flask Apps Setup

```bash
cd [app-folder]
pip install -r requirements.txt
python app.py
```

Server typically runs at `http://localhost:5000`

## Environment Variables

Many apps use `.env` files. Check each app's README for required variables:

```bash
# Example
API_KEY=your_key_here
DATABASE_URL=your_database_url
```

Copy `.env.example` to `.env` and fill in your values.

## Troubleshooting

**Port Already in Use?**
```bash
# Change the port in the app config
# React: PORT=3001 npm start
# Flask: python app.py --port 5001
```

**Modules Not Found?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Python Virtual Environment Error?**
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
```

---

For app-specific setup, check each day's README.md!
EOF

echo "✅ SETUP.md created!"

# Create .gitignore
cat > .gitignore << 'EOF'
# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
venv/
env/
*.egg-info/
dist/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# OS
Thumbs.db
.DS_Store

# Logs
logs/
*.log

# Build outputs
dist/
build/
out/

# Misc
.cache/
temp/
EOF

echo "✅ .gitignore created!"

# Create docs folder structure
mkdir -p docs
touch docs/linkedin-posts.md
touch docs/learning-log.md
touch docs/daily-checklist.md
touch docs/progress.md

cat > docs/daily-checklist.md << 'EOF'
# Daily Build Checklist

Use this checklist each day to stay organized:

## Before Building
- [ ] Decide on the app for today
- [ ] Research tech stack choice
- [ ] Sketch rough UI design
- [ ] Check for API requirements/credentials

## During Building
- [ ] Create folder: `0X-app-name`
- [ ] Initialize git repo
- [ ] Set up boilerplate (React/Vue/Node)
- [ ] Build core features (focus on MVP)
- [ ] Test in browser/API client
- [ ] Fix bugs and test edge cases

## After Building
- [ ] Create comprehensive README.md
- [ ] Add demo screenshots/GIFs
- [ ] Add "What I Learned" section
- [ ] Commit to git with descriptive message
- [ ] Push to GitHub
- [ ] Write LinkedIn post
- [ ] Post on LinkedIn with hashtags
- [ ] Respond to comments/engagement

## End of Day
- [ ] Update progress tracker
- [ ] Plan tomorrow's app
- [ ] Review what went well/challenges faced
- [ ] Get some rest! 💤

---

Track your daily completion here:
- Day 1: [ ] 
- Day 2: [ ] 
- Day 3: [ ] 
... (continue for all 30)
EOF

echo "✅ Documentation templates created!"

echo ""
echo "🎉 Setup complete! Here's what's ready:"
echo "   ✅ 30 app folders (01-30)"
echo "   ✅ Root README.md"
echo "   ✅ SETUP.md (how to run apps)"
echo "   ✅ .gitignore"
echo "   ✅ Documentation templates"
echo ""
echo "Next steps:"
echo "   1. git init"
echo "   2. git remote add origin <your-repo-url>"
echo "   3. git add ."
echo "   4. git commit -m 'Initial setup: 30 WebApps in 30 Days'"
echo "   5. git push -u origin main"
echo ""
echo "Happy building! 🚀"
EOF

chmod +x 30-webapps-setup.sh

# Also create a simpler text version for just folder setup
mkdir -p 01-todo-app 02-calculator 03-weather-app 04-expense-tracker 05-timer \
         06-color-palette 07-markdown 08-url-shortener 09-quotes 10-drawing \
         11-password 12-playlist 13-chat-ui 14-journal 15-notes \
         16-github-finder 17-movies 18-ecommerce 19-books 20-food-delivery \
         21-stocks 22-handwriting 23-realtime-chat 24-summarizer 25-kanban \
         26-visualizer 27-snippets 28-sentiment 29-realestate 30-portfolio

echo "✅ All 30 app folders created!"
echo ""
echo "🎉 Repository structure is ready to go!"
