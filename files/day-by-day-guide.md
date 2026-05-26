# 📅 Day-by-Day Tactical Guide: #30WebAppsIn30Days

Use this guide for each day. Copy/paste the day's section and check off features as you build.

---

## 🗓️ WEEK 1: FOUNDATION WEEK (Days 1-7)

### DAY 1: Todo List
**Tech Stack**: React + LocalStorage  
**Estimated Time**: 6 hours  
**Difficulty**: ⭐ Easy  

**Features to Build**:
- [ ] Input field to add new todos
- [ ] Display list of todos
- [ ] Mark todo as complete (checkbox)
- [ ] Delete todo functionality
- [ ] Persist data in localStorage
- [ ] Clear all completed button
- [ ] Visual feedback (strikethrough for completed)

**Learning Focus**:
- React hooks (useState)
- Conditional rendering
- LocalStorage API
- Array methods (filter, map)

**Design Tips**:
- Keep it minimal but clean
- Use subtle colors for complete vs incomplete
- Add smooth transitions

**GitHub README Should Cover**:
- What localStorage is and why
- How to run locally
- Key react patterns used

**Time Breakdown**:
- Setup (20 min)
- Core functionality (3 hours)
- Polish + styling (1.5 hours)
- Testing + README (1 hour)

---

### DAY 2: Calculator
**Tech Stack**: Vanilla JavaScript + HTML/CSS  
**Estimated Time**: 5 hours  
**Difficulty**: ⭐ Easy  

**Features to Build**:
- [ ] Basic operations (+, -, *, /)
- [ ] Display current input
- [ ] Calculation logic
- [ ] Clear/Reset button
- [ ] Decimal support
- [ ] Delete last digit
- [ ] Keyboard support (0-9, +, -, *, /, Enter, Backspace)
- [ ] History of recent calculations

**Learning Focus**:
- DOM manipulation
- Event listeners
- String/number conversions
- Keyboard events
- CSS Grid/Flexbox layout

**Design Tips**:
- Buttons should feel clicky
- Large display for readability
- Dark mode friendly design

**GitHub README Should Cover**:
- Why vanilla JS (good exercise!)
- How keyboard input works
- Edge cases handled (divide by zero, etc)

**Time Breakdown**:
- HTML structure (30 min)
- Styling (1.5 hours)
- JavaScript logic (2 hours)
- Testing + polish (1 hour)

---

### DAY 3: Weather App
**Tech Stack**: Vue.js + OpenWeatherMap API  
**Estimated Time**: 7 hours  
**Difficulty**: ⭐ Easy-Medium  

**Features to Build**:
- [ ] Search by city name
- [ ] Display current temperature
- [ ] Show weather description
- [ ] Display humidity, wind speed
- [ ] Show weather icon/emoji
- [ ] Geolocation-based weather (optional)
- [ ] Temperature toggle (Celsius/Fahrenheit)
- [ ] Recent searches dropdown

**Learning Focus**:
- Vue basics (v-if, v-for, event handling)
- API calls (fetch/axios)
- Async/await
- Vue data binding
- Error handling (city not found)

**Getting Started**:
1. Sign up for free OpenWeatherMap API
2. Get API key
3. Test API with Postman first

**GitHub README Should Cover**:
- How to get API key
- What data the API returns
- Temperature conversion formula

**Time Breakdown**:
- Setup + API key (20 min)
- Vue template (1 hour)
- API integration (2 hours)
- Styling (2 hours)
- Testing + README (1.5 hours)

---

### DAY 4: Expense Tracker
**Tech Stack**: React + Chart.js  
**Estimated Time**: 7 hours  
**Difficulty**: ⭐ Easy-Medium  

**Features to Build**:
- [ ] Add expense (amount, category, description, date)
- [ ] Display list of expenses
- [ ] Delete expense
- [ ] Filter by category
- [ ] Show total spending
- [ ] Chart visualization (pie or bar)
- [ ] Export to CSV (optional)
- [ ] LocalStorage persistence

**Learning Focus**:
- React forms and controlled components
- Chart.js library
- Array filtering and aggregation
- Date handling
- Categorization logic

**Design Tips**:
- Different colors for different categories
- Clear visual hierarchy
- Make chart interactive if possible

**GitHub README Should Cover**:
- How Chart.js works
- How filtering logic works
- Data structure for expenses

**Time Breakdown**:
- Setup (20 min)
- React components (2 hours)
- Chart integration (2 hours)
- Styling (1.5 hours)
- Testing + README (1 hour)

---

### DAY 5: Countdown Timer (Pomodoro)
**Tech Stack**: Vanilla JavaScript  
**Estimated Time**: 4 hours  
**Difficulty**: ⭐ Easy  

**Features to Build**:
- [ ] Input for minutes/seconds
- [ ] Start/Pause/Reset buttons
- [ ] Display time remaining
- [ ] Progress bar
- [ ] Sound notification when done
- [ ] Break timer option
- [ ] Save favorite durations

**Learning Focus**:
- setInterval/clearInterval
- Time calculations
- DOM manipulation
- Audio API
- State management without framework

**GitHub README Should Cover**:
- How setInterval works
- Why you need clearInterval
- Audio API basics

**Time Breakdown**:
- HTML/CSS (45 min)
- Timer logic (1.5 hours)
- Notifications (45 min)
- Polish + README (45 min)

---

### DAY 6: Color Palette Generator
**Tech Stack**: React  
**Estimated Time**: 4 hours  
**Difficulty**: ⭐ Easy  

**Features to Build**:
- [ ] Generate random colors
- [ ] Lock specific colors
- [ ] Copy hex code to clipboard
- [ ] Export palette as JSON
- [ ] Display color name
- [ ] Save favorite palettes
- [ ] Export as CSS variables

**Learning Focus**:
- Color manipulation
- Clipboard API
- localStorage for favorites
- React state management
- HSL vs RGB vs Hex conversions

**Design Tips**:
- Each color should be clickable
- Show hex + RGB + HSL values
- Nice animations on generation

**GitHub README Should Cover**:
- How color generation works
- Color naming library used (if any)
- How to export palettes

**Time Breakdown**:
- Setup (15 min)
- Color generation logic (1 hour)
- UI + interactions (1.5 hours)
- Polish + features (1 hour)

---

### DAY 7: Markdown Previewer
**Tech Stack**: Vue.js + Marked.js  
**Estimated Time**: 5 hours  
**Difficulty**: ⭐ Easy  

**Features to Build**:
- [ ] Real-time markdown preview
- [ ] Split view (editor + preview)
- [ ] Syntax highlighting
- [ ] Auto-save to localStorage
- [ ] Reset to default markdown
- [ ] Dark/Light theme toggle
- [ ] Copy rendered HTML

**Learning Focus**:
- Vue watchers
- Marked.js library
- DOMPurify (sanitizing HTML)
- Syntax highlighting with Prism.js
- Real-time rendering

**GitHub README Should Cover**:
- What Marked.js does
- Why DOMPurify is important (XSS prevention)
- Supported markdown syntax

**Time Breakdown**:
- Setup with libraries (30 min)
- Vue template (1 hour)
- Marked.js integration (1 hour)
- Styling split view (1 hour)
- Polish + README (1.5 hours)

---

## 🗓️ WEEK 2: INTERACTIVITY WEEK (Days 8-14)

### DAY 8: URL Shortener
**Tech Stack**: Node.js + Express + MongoDB  
**Estimated Time**: 8 hours  
**Difficulty**: ⭐⭐ Medium  

**Features to Build**:
- [ ] Create short code from long URL
- [ ] Redirect short URL to long URL
- [ ] Display QR code of short URL
- [ ] View analytics (clicks, last accessed)
- [ ] Custom short codes (if available)
- [ ] Expiration option
- [ ] Copy link to clipboard

**Learning Focus**:
- Node.js/Express basics
- MongoDB collections + queries
- Middleware (body-parser, CORS)
- QR code generation library
- REST API principles

**Setup**:
1. Install MongoDB locally or use MongoDB Atlas
2. Install Express, mongoose, qrcode packages
3. Create .env for sensitive data

**GitHub README Should Cover**:
- How to set up MongoDB
- API endpoints (POST /shorten, GET /:shortCode)
- Database schema

**Time Breakdown**:
- Setup (1 hour)
- Express server + routes (2 hours)
- MongoDB integration (2 hours)
- QR code + analytics (1.5 hours)
- Testing + README (1.5 hours)

---

### DAY 9: Quote Generator
**Tech Stack**: React + Quotable API  
**Estimated Time**: 4 hours  
**Difficulty**: ⭐ Easy  

**Features to Build**:
- [ ] Fetch random quote
- [ ] Display author
- [ ] Tweet quote (Twitter share)
- [ ] Copy quote to clipboard
- [ ] Filter by author or tag
- [ ] Show quote length
- [ ] Favorite quotes (localStorage)

**Learning Focus**:
- API integration
- Fetch with error handling
- Share APIs (Web Share API)
- localStorage for favorites
- Responsive design

**Free API to Use**:
- Quotable API (quotable.io) - no auth required

**GitHub README Should Cover**:
- Quotable API endpoints
- How Tweet sharing works
- Data structure of quotes

**Time Breakdown**:
- Setup (15 min)
- API integration (1 hour)
- UI components (1.5 hours)
- Features (1 hour)
- Polish + README (30 min)

---

### DAY 10: Drawing App (Canvas)
**Tech Stack**: Vanilla JavaScript + Canvas API  
**Estimated Time**: 6 hours  
**Difficulty**: ⭐⭐ Medium  

**Features to Build**:
- [ ] Draw with mouse
- [ ] Color picker
- [ ] Brush size slider
- [ ] Eraser tool
- [ ] Clear canvas
- [ ] Save drawing as PNG
- [ ] Undo/Redo (optional)
- [ ] Touch support for mobile

**Learning Focus**:
- Canvas API (getContext, drawing paths)
- Mouse events (mousedown, mousemove, mouseup)
- Touch events
- Image export (toDataURL)
- requestAnimationFrame for smooth drawing

**Design Tips**:
- Smooth, natural drawing feel
- Visual feedback for selected tool
- Good contrast for canvas

**GitHub README Should Cover**:
- How Canvas drawing works
- Mouse event coordinates
- Why requestAnimationFrame matters
- How to save canvas as image

**Time Breakdown**:
- Setup + HTML/CSS (45 min)
- Canvas drawing logic (2 hours)
- Tools (color, size, eraser) (1.5 hours)
- Save + features (1 hour)
- Polish + README (45 min)

---

### DAY 11: Password Generator
**Tech Stack**: Vue.js  
**Estimated Time**: 4 hours  
**Difficulty**: ⭐ Easy  

**Features to Build**:
- [ ] Configurable length
- [ ] Toggle: uppercase letters
- [ ] Toggle: lowercase letters
- [ ] Toggle: numbers
- [ ] Toggle: special characters
- [ ] Generate password
- [ ] Copy to clipboard
- [ ] Password strength indicator
- [ ] Exclude ambiguous characters (0, O, l, 1, etc)

**Learning Focus**:
- Vue computed properties
- String manipulation
- Random selection
- Password strength logic
- Vue checkboxes/sliders

**Design Tips**:
- Visual strength meter
- Color-coded strength levels
- Quick copy feedback

**GitHub README Should Cover**:
- Password generation algorithm
- How strength is calculated
- Security considerations

**Time Breakdown**:
- Setup (15 min)
- Vue template (1 hour)
- Generation logic (1.5 hours)
- Strength meter (1 hour)
- Polish + README (30 min)

---

### DAY 12: Music Playlist Builder
**Tech Stack**: React + Spotify Web API  
**Estimated Time**: 8 hours  
**Difficulty**: ⭐⭐ Medium  

**Features to Build**:
- [ ] Search songs
- [ ] Display search results (title, artist, album)
- [ ] Add songs to playlist
- [ ] Remove songs from playlist
- [ ] View playlist
- [ ] Play preview (30 seconds)
- [ ] Sort playlist
- [ ] Save playlist to localStorage
- [ ] Export playlist link

**Learning Focus**:
- OAuth 2.0 authentication
- Spotify API
- Debouncing search
- Audio playback
- State management (multiple playlists)

**Setup**:
1. Create Spotify Developer account
2. Get Client ID
3. Set up auth flow (or use Bearer token for simplified version)

**GitHub README Should Cover**:
- How to authenticate with Spotify
- Required scopes
- API rate limits
- How preview works

**Time Breakdown**:
- Setup + Spotify auth (2 hours)
- Search functionality (1.5 hours)
- Playlist management (2 hours)
- Audio player (1 hour)
- Polish + README (1.5 hours)

---

### DAY 13: Chat UI (Frontend Only)
**Tech Stack**: React + CSS Animations  
**Estimated Time**: 5 hours  
**Difficulty**: ⭐ Easy  

**Features to Build**:
- [ ] Message input
- [ ] Send message (UI only)
- [ ] Display messages in chat bubbles
- [ ] User vs other person bubbles (different styling)
- [ ] Typing indicator
- [ ] Timestamp for messages
- [ ] Emoji picker
- [ ] Smooth animations
- [ ] Scroll to latest message

**Learning Focus**:
- React component composition
- CSS animations
- Scroll behavior (useRef, useEffect)
- Message bubble layouts
- Responsive mobile design

**Design Tips**:
- Modern chat app aesthetic
- Smooth message animations
- Typing indicator animation
- Mobile-first responsive

**GitHub README Should Cover**:
- No backend, UI only
- How typing indicator works
- Message bubble CSS techniques

**Time Breakdown**:
- Setup + HTML (30 min)
- Chat components (1.5 hours)
- Styling + animations (2 hours)
- Features (emoji, timestamps) (1 hour)
- Polish + README (30 min)

---

### DAY 14: Journal/Diary App
**Tech Stack**: Svelte + IndexedDB  
**Estimated Time**: 6 hours  
**Difficulty**: ⭐⭐ Medium  

**Features to Build**:
- [ ] Create new journal entries
- [ ] Edit existing entries
- [ ] Delete entries
- [ ] Search by date
- [ ] Search by content
- [ ] Rich text editor
- [ ] Display entries in reverse chronological order
- [ ] Offline-first with IndexedDB
- [ ] Export entries as markdown/PDF

**Learning Focus**:
- Svelte basics (components, reactivity)
- IndexedDB (offline storage)
- Date manipulation
- Rich text editing
- File export

**GitHub README Should Cover**:
- What Svelte is and why
- How IndexedDB works
- Why offline-first matters

**Time Breakdown**:
- Setup Svelte (30 min)
- Components (1.5 hours)
- IndexedDB integration (1.5 hours)
- Rich text editor (1.5 hours)
- Features + README (1 hour)

---

## 🗓️ WEEK 3: FULL-STACK WEEK (Days 15-21)

### DAY 15: Notes App with Authentication
**Tech Stack**: React + Firebase  
**Estimated Time**: 8 hours  
**Difficulty**: ⭐⭐ Medium  

**Features to Build**:
- [ ] User signup/login
- [ ] Create notes
- [ ] Edit notes
- [ ] Delete notes
- [ ] Real-time sync
- [ ] Share notes (optional)
- [ ] Organize with folders/tags
- [ ] Search notes

**Learning Focus**:
- Firebase authentication
- Firestore database
- Real-time listeners
- User sessions
- Security rules

**Setup**:
1. Create Firebase project
2. Enable Authentication + Firestore
3. Install Firebase SDK

**GitHub README Should Cover**:
- Firebase setup steps
- How authentication works
- Database structure

**Time Breakdown**:
- Firebase setup (1 hour)
- Authentication (2 hours)
- Firestore integration (2 hours)
- UI components (2 hours)
- Testing + README (1 hour)

---

### DAY 16: GitHub User Finder
**Tech Stack**: Node.js + Express + GitHub API  
**Estimated Time**: 6 hours  
**Difficulty**: ⭐⭐ Medium  

**Features to Build**:
- [ ] Search GitHub users by username
- [ ] Display user profile info
- [ ] Show repositories
- [ ] Display followers/following
- [ ] Sort repos by stars/forks
- [ ] Link to GitHub profile
- [ ] Show user stats

**Learning Focus**:
- GitHub API (public, no auth needed)
- Express routing
- API proxying (avoid CORS issues)
- Error handling
- Data presentation

**GitHub README Should Cover**:
- GitHub API endpoints used
- How to avoid rate limiting
- CORS handling

**Time Breakdown**:
- Express setup (30 min)
- GitHub API integration (2 hours)
- Frontend (2 hours)
- Styling + features (1 hour)
- Testing + README (30 min)

---

### DAY 17: Movie Search Engine
**Tech Stack**: React + TMDB API  
**Estimated Time**: 7 hours  
**Difficulty**: ⭐⭐ Medium  

**Features to Build**:
- [ ] Search movies by title
- [ ] Display movie posters
- [ ] Show ratings/reviews
- [ ] Display genre, release date, runtime
- [ ] Watchlist feature (localStorage)
- [ ] Filter by year
- [ ] Pagination
- [ ] Movie details modal

**Learning Focus**:
- TMDB API
- Image optimization
- Modal components
- Filter/search logic
- Pagination

**Setup**:
1. Sign up for TMDB API (free)
2. Get API key

**GitHub README Should Cover**:
- TMDB API key setup
- Image URL structure
- Pagination logic

**Time Breakdown**:
- Setup + API key (20 min)
- Search functionality (2 hours)
- Display movies (1.5 hours)
- Details + watchlist (2 hours)
- Polish + README (1 hour)

---

### DAY 18: E-commerce Shopping Cart
**Tech Stack**: Vue.js  
**Estimated Time**: 7 hours  
**Difficulty**: ⭐⭐ Medium  

**Features to Build**:
- [ ] Display products
- [ ] Add to cart
- [ ] Remove from cart
- [ ] Update quantities
- [ ] Calculate total price
- [ ] Apply coupon code
- [ ] Checkout flow (UI)
- [ ] Order summary

**Learning Focus**:
- Vue state management
- Component communication
- Form handling
- Responsive design
- Shopping cart logic

**Design Tips**:
- Clear product cards
- Visual cart feedback
- Smooth animations
- Mobile-optimized checkout

**GitHub README Should Cover**:
- How cart logic works
- Price calculations
- Product data structure

**Time Breakdown**:
- Setup (15 min)
- Product display (1.5 hours)
- Cart management (2 hours)
- Checkout flow (1.5 hours)
- Styling + features (1 hour)
- Polish + README (30 min)

---

### DAY 19: Book Recommendation System
**Tech Stack**: Python + Flask + SQLite  
**Estimated Time**: 8 hours  
**Difficulty**: ⭐⭐⭐ Hard  

**Features to Build**:
- [ ] Database of books
- [ ] Search by title/author
- [ ] Filter by genre/rating
- [ ] User accounts
- [ ] Rate books
- [ ] Get recommendations
- [ ] Create reading list

**Learning Focus**:
- Flask basics
- SQLAlchemy ORM
- Database design
- Simple recommendation algorithm
- REST API principles

**Setup**:
```bash
pip install flask sqlalchemy
```

**Recommendation Algorithm** (simple):
- Find books with similar genres
- Sort by average rating
- Exclude already read books

**GitHub README Should Cover**:
- How to set up SQLite database
- Recommendation algorithm explained
- API endpoints
- How to populate books data

**Time Breakdown**:
- Flask setup (1 hour)
- Database design (1 hour)
- API endpoints (2 hours)
- Recommendation logic (1.5 hours)
- Testing + README (1.5 hours)

---

### DAY 20: Food Delivery App UI
**Tech Stack**: React + React Router  
**Estimated Time**: 7 hours  
**Difficulty**: ⭐⭐ Medium  

**Features to Build**:
- [ ] Browse restaurants
- [ ] View menu items
- [ ] Add items to cart
- [ ] Customize items (options)
- [ ] Delivery details form
- [ ] Order summary
- [ ] Payment method selection (UI only)
- [ ] Order confirmation

**Learning Focus**:
- React Router for multi-page feel
- Form handling
- Complex state management
- Responsive mobile design
- UI/UX patterns for food delivery

**Design Tips**:
- Modern, clean aesthetic
- Mobile-first (this is a mobile app!)
- Smooth transitions
- Clear visual hierarchy

**GitHub README Should Cover**:
- App flow/routes
- Component architecture
- No backend - UI only
- How state flows through app

**Time Breakdown**:
- Setup + routing (1 hour)
- Page components (2 hours)
- Shopping cart logic (1.5 hours)
- Forms (1 hour)
- Styling + animations (1 hour)
- Polish + README (30 min)

---

### DAY 21: Stock Market Tracker
**Tech Stack**: Node.js + Express + Alpha Vantage API  
**Estimated Time**: 8 hours  
**Difficulty**: ⭐⭐⭐ Hard  

**Features to Build**:
- [ ] Search stocks by symbol
- [ ] Display current price
- [ ] Show price change
- [ ] Chart historical data
- [ ] Portfolio tracking
- [ ] Buy/sell stocks (simulated)
- [ ] Calculate gains/losses
- [ ] Watchlist

**Learning Focus**:
- Financial API integration
- Chart.js for financial data
- Time-series data
- Caching (stocks don't change every second)
- Portfolio calculations

**Free API**: Alpha Vantage (free tier available)

**GitHub README Should Cover**:
- How to get Alpha Vantage API key
- Rate limits
- How stock data is retrieved
- Portfolio calculation logic

**Time Breakdown**:
- Alpha Vantage setup (1 hour)
- Express routes (1.5 hours)
- Frontend (2 hours)
- Charts + calculations (2 hours)
- Features + README (1.5 hours)

---

## 🗓️ WEEK 4: ADVANCED WEEK (Days 22-30)

### DAY 22: Handwriting Recognition (ML)
**Tech Stack**: Flask + TensorFlow + MNIST Model  
**Estimated Time**: 9 hours  
**Difficulty**: ⭐⭐⭐ Hard  

**Features to Build**:
- [ ] Canvas drawing interface
- [ ] Real-time prediction
- [ ] Show confidence scores
- [ ] Train/test model (optional)
- [ ] Accuracy metrics
- [ ] Improve prediction with more samples

**Learning Focus**:
- TensorFlow/Keras
- ML model loading and inference
- Canvas to tensor conversion
- Flask + ML integration
- Model confidence scores

**Setup**:
```bash
pip install tensorflow flask numpy pillow
```

**Pre-trained Model**: Use MNIST model (trained on digit dataset)

**GitHub README Should Cover**:
- What MNIST is
- How model inference works
- Data preprocessing (canvas → tensor)
- Accuracy limitations

**Time Breakdown**:
- Setup + model loading (1.5 hours)
- Flask server (1 hour)
- Drawing canvas (1.5 hours)
- Prediction integration (1.5 hours)
- Frontend + styling (2 hours)
- Testing + README (1 hour)

---

### DAY 23: Real-Time Chat Application
**Tech Stack**: Node.js + Express + Socket.io  
**Estimated Time**: 9 hours  
**Difficulty**: ⭐⭐⭐ Hard  

**Features to Build**:
- [ ] User authentication
- [ ] Send/receive messages in real-time
- [ ] Typing indicator
- [ ] Online user list
- [ ] Message history
- [ ] Rooms/channels (optional)
- [ ] User notifications
- [ ] Emoji support

**Learning Focus**:
- WebSockets (Socket.io)
- Real-time event handling
- User session management
- Message persistence
- Namespace/rooms

**Setup**:
```bash
npm install express socket.io
```

**GitHub README Should Cover**:
- How WebSockets work
- Socket.io events
- Authentication strategy
- Database schema for messages

**Time Breakdown**:
- Socket.io setup (1 hour)
- Backend events (2 hours)
- User management (1.5 hours)
- Frontend (2 hours)
- Features (typing, notifications) (1.5 hours)
- Testing + README (1 hour)

---

### DAY 24: AI Text Summarizer
**Tech Stack**: Python + Flask + Hugging Face Transformers  
**Estimated Time**: 7 hours  
**Difficulty**: ⭐⭐⭐ Hard  

**Features to Build**:
- [ ] Paste long text
- [ ] Generate summary
- [ ] Adjust summary length
- [ ] Multiple summary attempts
- [ ] Show word count before/after
- [ ] Copy summary to clipboard
- [ ] Save summaries history

**Learning Focus**:
- Hugging Face transformers
- Pre-trained summarization models
- Text preprocessing
- API response handling
- Performance optimization

**Setup**:
```bash
pip install transformers torch flask
```

**Model**: facebook/bart-large-cnn (pre-trained)

**GitHub README Should Cover**:
- How transformer models work
- Why BART is good for summarization
- Token limits and text handling
- API latency expectations

**Time Breakdown**:
- Setup + model loading (1.5 hours)
- Flask API (1 hour)
- Text preprocessing (1 hour)
- Frontend (1.5 hours)
- Features (1 hour)
- Testing + README (1 hour)

---

### DAY 25: Kanban Board (Trello Clone)
**Tech Stack**: React + React-Beautiful-DnD  
**Estimated Time**: 8 hours  
**Difficulty**: ⭐⭐⭐ Hard  

**Features to Build**:
- [ ] Create columns/lists
- [ ] Add cards
- [ ] Drag-drop between columns
- [ ] Edit card title/description
- [ ] Delete cards/columns
- [ ] Assign labels/colors
- [ ] Due dates
- [ ] Persistence (localStorage)

**Learning Focus**:
- React-Beautiful-DnD library
- Complex state management
- Drag-drop UX
- Component composition
- LocalStorage optimization

**Setup**:
```bash
npm install react-beautiful-dnd
```

**Design Tips**:
- Smooth drag animations
- Visual feedback during dragging
- Responsive layout
- Card hover states

**GitHub README Should Cover**:
- react-beautiful-dnd basics
- State structure for board
- How persistence works

**Time Breakdown**:
- Setup (30 min)
- Board components (2 hours)
- Drag-drop logic (2 hours)
- Features (cards, labels) (2 hours)
- Styling + polish (1 hour)
- Testing + README (30 min)

---

### DAY 26: Music Visualizer
**Tech Stack**: Vanilla JS + Web Audio API + Three.js  
**Estimated Time**: 9 hours  
**Difficulty**: ⭐⭐⭐ Hard  

**Features to Build**:
- [ ] Upload or play audio file
- [ ] Real-time frequency visualization
- [ ] Animated 3D shapes
- [ ] Particle effects
- [ ] Different visualizer modes
- [ ] Sync with music beat
- [ ] Color schemes

**Learning Focus**:
- Web Audio API
- Three.js 3D graphics
- FFT (Fast Fourier Transform) for frequency data
- requestAnimationFrame
- Audio synchronization

**Setup**:
```bash
npm install three
```

**GitHub README Should Cover**:
- How Web Audio API works
- What FFT does
- Three.js basics
- Audio file handling

**Time Breakdown**:
- Setup Three.js (30 min)
- Web Audio API (1.5 hours)
- Frequency data processing (1.5 hours)
- 3D visualization (3 hours)
- Different modes (1.5 hours)
- Polish + README (1 hour)

---

### DAY 27: Code Snippet Manager
**Tech Stack**: React + Node.js + MongoDB + Express  
**Estimated Time**: 9 hours  
**Difficulty**: ⭐⭐⭐⭐ Very Hard  

**Features to Build**:
- [ ] Create/edit code snippets
- [ ] Syntax highlighting
- [ ] Multiple languages
- [ ] Tags/categories
- [ ] Search functionality
- [ ] Copy snippet
- [ ] Export snippets
- [ ] User authentication
- [ ] Share snippets (optional)

**Learning Focus**:
- Full MERN stack
- Prism.js for syntax highlighting
- User authentication
- Full database CRUD
- Search algorithms

**Setup**:
```bash
npm install express mongoose prismjs
```

**GitHub README Should Cover**:
- Full MERN architecture
- Database schema
- Authentication flow
- How syntax highlighting works

**Time Breakdown**:
- Backend setup (2 hours)
- Database + models (1 hour)
- API endpoints (2 hours)
- Frontend (2 hours)
- Syntax highlighting + features (1 hour)
- Testing + README (1 hour)

---

### DAY 28: Sentiment Analysis Tool
**Tech Stack**: Python + Flask + VADER/TextBlob  
**Estimated Time**: 6 hours  
**Difficulty**: ⭐⭐ Medium  

**Features to Build**:
- [ ] Input text
- [ ] Analyze sentiment (positive/negative/neutral)
- [ ] Show confidence scores
- [ ] Visualize sentiment distribution
- [ ] Analyze multiple texts
- [ ] Save analyses
- [ ] Export results

**Learning Focus**:
- NLP sentiment analysis
- VADER (Valence Aware Dictionary)
- Text preprocessing
- Visualization
- Score interpretation

**Setup**:
```bash
pip install flask textblob nltk
```

**GitHub README Should Cover**:
- How sentiment analysis works
- VADER scoring system
- Accuracy and limitations
- Use cases

**Time Breakdown**:
- Flask setup (30 min)
- VADER integration (1 hour)
- API endpoint (30 min)
- Frontend (2 hours)
- Visualization + features (1 hour)
- Testing + README (30 min)

---

### DAY 29: Real Estate Portal
**Tech Stack**: React + Node.js + PostgreSQL + Express  
**Estimated Time**: 10 hours  
**Difficulty**: ⭐⭐⭐⭐ Very Hard  

**Features to Build**:
- [ ] Property listings
- [ ] Search/filter (price, location, bedrooms)
- [ ] Property detail pages
- [ ] Map integration
- [ ] Image gallery
- [ ] Contact agent
- [ ] Favorite properties
- [ ] Admin panel for adding properties

**Learning Focus**:
- Full-stack with PostgreSQL
- Maps integration (Google/Mapbox)
- Image management
- Complex filtering
- Database relationships

**Setup**:
```bash
npm install express sequelize pg
```

**GitHub README Should Cover**:
- Database schema (properties, agents)
- How maps work
- Filter logic
- Image storage strategy

**Time Breakdown**:
- Backend setup + database (2 hours)
- Models + relations (1.5 hours)
- API endpoints (2 hours)
- Frontend (2 hours)
- Maps + features (1.5 hours)
- Admin panel (30 min)
- Testing + README (1 hour)

---

### DAY 30: Personal Portfolio Website
**Tech Stack**: React + Next.js  
**Estimated Time**: 8 hours  
**Difficulty**: ⭐⭐⭐ Hard  

**Features to Build**:
- [ ] About section
- [ ] Showcase all 29 apps
- [ ] Links to GitHub repos
- [ ] Skills section
- [ ] Contact form
- [ ] Responsive design
- [ ] Smooth scrolling
- [ ] Dark/light theme
- [ ] Blog section (optional)

**Learning Focus**:
- Next.js framework
- Server-side rendering
- Static generation
- Performance optimization
- Portfolio best practices

**Design Tips**:
- Professional aesthetic
- Portfolio pieces prominently featured
- Good call-to-action (contact, GitHub, LinkedIn)
- Mobile-optimized
- Fast loading

**GitHub README Should Cover**:
- Next.js deployment
- How portfolio is structured
- How to add new projects
- SEO considerations

**Time Breakdown**:
- Next.js setup (1 hour)
- Layouts + components (2 hours)
- Content sections (2 hours)
- Featured projects (1 hour)
- Styling + animations (1 hour)
- Deployment setup (30 min)
- Polish + README (30 min)

---

## 📊 Daily Time Management

**Best Daily Schedule**:
```
8:00 AM  - Morning standup + plan the day
9:00 AM  - 11:00 AM = Code (2 hours)
11:00 AM - 12:00 PM = Break/Lunch
12:00 PM - 5:00 PM = Code (5 hours)
5:00 PM  - 6:00 PM = Testing + screenshots
6:00 PM  - 7:00 PM = README + documentation
7:00 PM  - 8:00 PM = LinkedIn post + GitHub push
8:00 PM  - Dinner/Rest
```

**Total Daily Time**: 8-9 hours

---

## ✅ Daily Pre-Build Checklist

Before you start each day, copy this:

- [ ] Read the day's section from this guide
- [ ] Understand all required features
- [ ] Gather API keys/setup if needed
- [ ] Create folder: `0X-app-name`
- [ ] Initialize git repo + create README template
- [ ] Set up boilerplate (React, Vue, Flask, etc)
- [ ] Code the core features first
- [ ] Add "nice-to-haves" if time permits
- [ ] Write comprehensive README
- [ ] Take screenshots/GIFs
- [ ] Push to GitHub
- [ ] Write LinkedIn post
- [ ] Post on LinkedIn
- [ ] Celebrate! 🎉

---

## 🚨 If You Fall Behind

**What to do**:
1. Don't panic - it happens!
2. Pick up where you left off
3. Simplify the next app features (MVP only)
4. Use your 2 "buffer days" (day 31-32)
5. Keep the momentum going

**Don't**: Skip days or give up. Even if behind, finish the challenge!

---

**Remember**: The goal isn't perfection, it's consistency and growth. You got this! 🚀
