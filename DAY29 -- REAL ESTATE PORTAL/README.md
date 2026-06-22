# Day 29: Real Estate Portal

Welcome to **Day 29** of my 30 Days of Web Development Challenge! Today's project is a fully-functional **Real Estate Portal** showcasing property listings with an elegant, modern UI and dynamic backend filtering.

## 🚀 Features

- **Dynamic Property Filtering:** Users can filter real estate listings seamlessly by Location, Property Type, Minimum Bedrooms, and Price Range.
- **Premium User Interface:** A sleek, responsive design featuring glassmorphism, beautiful gradients, micro-animations, and hover effects built entirely with vanilla CSS.
- **Unified Full-Stack Architecture:** 
  - **Frontend:** A blazingly fast React interface powered by Vite.
  - **Backend:** A robust Express.js API handling complex SQL queries.
  - **Database:** A lightweight SQLite database (`realestate.db`) to handle structured relational data efficiently.

## 🛠️ Technologies Used

- **Frontend:** React, Vite, Lucide-react (Icons), Vanilla CSS
- **Backend:** Node.js, Express, dotenv
- **Database:** SQLite (sqlite3)

## 📂 Project Structure

```text
DAY29 -- REAL ESTATE PORTAL/
├── src/                  # React Application
│   ├── components/       # PropertyCard, Filters
│   ├── App.jsx           # Main frontend logic & state
│   └── index.css         # Premium glassmorphism styling
├── public/               # Static assets
├── server.js             # Express.js API and DB endpoints
├── setup_db.js           # Database seeding script
├── realestate.db         # SQLite Database file
├── vite.config.js        # Vite configuration & API proxy
└── package.json          # Combined dependencies & scripts
```

## ⚙️ How to Run Locally

### Setup
Open a terminal in the root folder and install dependencies:
```bash
npm install
```

### Seed Database
To populate the SQLite database with mock properties, run:
```bash
node setup_db.js
```

### Start Development Server
Start the unified application (both the frontend and backend run concurrently):
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser to explore the portal!

## 💡 What I Learned
Building this portal reinforced my understanding of combining a modern React frontend with a relational database in a unified workspace. I practiced proxying API requests through Vite, creating dynamic SQL queries based on user inputs, and utilizing glassmorphism to create a truly premium user interface.
# PrimeRealestate
