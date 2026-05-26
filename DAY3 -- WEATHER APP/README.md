# 🌤️ Day 3: Weather App — Secure Meteorological Dashboard

Welcome to Day 3 of the 30 WebApps in 30 Days Challenge! Today, I built a highly polished, responsive **Weather App** using **Vue 3** (loaded via CDN) and the **OpenWeatherMap REST API**. 

The app features a state-of-the-art **Glassmorphic Dark-Mode UI** with dynamic weather-responsive backgrounds, custom CSS particle systems, radial progress stats, and detailed 5-day forecasts with custom range meters.

---

## 🚀 Architectural Setup (100% Real Info & Secure)
To prevent private API keys from ever leaking on GitHub or being exposed in the browser's Network inspector, this application uses a **full-stack secure proxy architecture**:
* **Frontend**: Built using Vue 3 on the client. It makes zero requests to external third-party servers. All meteorological searches, autocompletes, and GPS reverse-lookups query your own domain's local backend at `/api/weather`.
* **Backend**: Powered by a **Vercel Serverless Function** in Node.js (`api/weather.js`). It reads the `OPENWEATHERMAP_API_KEY` securely from Vercel's backend environment variables, signs the request, calls OpenWeatherMap, and returns clean data.

This ensures **100% real-time data**, **zero mock dummy states**, and **absolute security** for your private credentials!

### 💖 Key Features
1. **Dynamic Ambient Backdrops**: The app's theme adapts in real-time to current weather conditions:
   - *Clear/Sunny*: Luminous orange-gold accents and rotating solar rays.
   - *Overcast*: Cool grey lavender mist with drifting cloud layers.
   - *Rain/Storms*: Electric dark blues, moving rain streaks, and flashing lightning overlays.
   - *Snow*: Freezing teal accents and drifting keyframe snowflakes.
2. **Advanced Visual Metrics**:
   - **Wind Compass**: A visual compass ring with a pointer arrow that dynamically rotates (`transform: rotate(Ndeg)`) to the exact direction degrees of the current city's wind velocity.
   - **Humidity Radial Arc**: A circular SVG progress bar showing moisture content.
   - **Sun Cycle Arc**: A parabolic dotted timeline showing sunrise, sunset, and a glowing sun node tracking the exact location of the sun based on local elapsed daytime hours.
   - **Atmospheric Scales**: Live progress bars for visibility indices and barometric pressure.
3. **Interactive 24-Hour & 5-Day Charts**:
   - **Hourly Scrolling Lane**: Slide-in temperature cards showing trends for the next 24 hours.
   - **Weekly Range Sliders**: An Apple Weather-inspired daily outlook displaying high/low temperature spreads mapped proportionally on horizontal visual lanes.
4. **Favorites & GPS Tracking**:
   - Save frequently searched cities in the top pill bar with the heart icon.
   - Live location services via `navigator.geolocation` that queries nearby weather data instantly.

---

## 🛠️ Tech Stack
- **Core Engine**: [Vue.js 3](https://vuejs.org/) (Global CDN version for lightweight, zero-configuration execution)
- **Backend Environment**: [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions) (Node.js runtime proxying requests)
- **Styling**: Vanilla CSS (Premium Glassmorphic effects, backdrop filters, Custom HSL properties, keyframe particle animations)
- **Data Source**: [OpenWeatherMap API v2.5](https://openweathermap.org/api) (Current Weather + 5-day/3-hour Forecast endpoints)
- **Icons**: Inline Custom SVGs and Typography via Google Fonts (Outfit & Inter)

---

## 🧠 What I Learned Today
- **Serverless API Proxying on Vercel**: Implementing Vercel Serverless Functions by placing an endpoint file in `api/weather.js`. This creates a secure server-side bridge that completely shields private API keys from the client-side browser.
- **Trigonometric Coordinate Tracking**: Figuring out the sun's position along the visual sunset/sunrise parabolic curve:
  $$\text{progress} = \frac{\text{currentTime} - \text{sunrise}}{\text{sunset} - \text{sunrise}}$$
  $$\text{angle} = \pi \times (1 - \text{progress})$$
  $$x = 50 + 40 \times \cos(\text{angle})$$
  $$y = 45 - 40 \times \sin(\text{angle})$$
  Mapping this directly to reactive properties bound to SVG node `cx`/`cy` results in an extremely premium tracking experience.
- **Proportional Apple-Style Range Sliders**: Building relative temperature sliders in the 5-day outlook. Calculating where the current day's min/max values sit relative to the week's overarching extremes allows rendering horizontal highlight pills representing proportional daily ranges.

---

## ⚙️ How to Deploy Securely to Vercel

To host this Weather App securely with real-time data:

1. **Upload your code to GitHub**:
   Push this directory (`DAY3 -- WEATHER APP`) to your GitHub account. Your files are completely safe to share as they contain **no hardcoded keys**!
   
2. **Import into Vercel**:
   - Go to your [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
   - Import your repository.
   - If deploying this folder as a standalone app, configure the **Root Directory** as `DAY3 -- WEATHER APP`.

3. **Configure Environment Variables**:
   - In Vercel's build settings under **Environment Variables**, add a new entry:
     - **Key**: `OPENWEATHERMAP_API_KEY`
     - **Value**: `[Your actual OpenWeatherMap API Key]` (Generate a free key at [openweathermap.org](https://openweathermap.org/))
   - Click **Deploy**!

4. **Add to Home Screen (PWA usage)**:
   - Once deployed, open your live Vercel URL on your mobile browser (Safari/Chrome).
   - Click **Share** -> **Add to Home Screen** to install it as a full-screen standalone application on your mobile device!

---

## ⚙️ Running Locally (With Serverless APIs)

To run the full backend proxy environment on your computer:
1. Install Vercel CLI: `npm install -g vercel`
2. Create a `.env` file inside this folder:
   ```env
   OPENWEATHERMAP_API_KEY=your_key_here
   ```
3. Run the development server: `vercel dev`
4. Open the local address provided (usually `http://localhost:3000`) to test the app locally with full API connectivity!

---

## 📁 Repository Structure
```
DAY3 -- WEATHER APP/
├── api/
│   └── weather.js   # Secure Vercel Serverless Function Proxy (Node.js)
├── index.html       # Dynamic Vue template structure & layout grids
├── style.css        # Premium glassmorphic styles & weather anim particles
├── app.js           # Vue controller, caching layer, & mock weather profiles
├── .gitignore       # Git configurations for static development
├── .env.example     # Reference variables sheet for development
└── README.md        # Documentation, learnings, & instruction manual
```
