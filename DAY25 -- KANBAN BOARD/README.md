# AtherBoard 🚀

**AtherBoard** is a premium, glassmorphic dark-themed Kanban board application built for **Day 25** of the 30-Day Web Development Challenge. It features a complete Trello-like task and workflow management system built from scratch, leveraging **React** and the **native HTML5 Drag and Drop API** for optimal performance, responsiveness, and zero dependency bloat.

---

## ✨ Features

- **Trello-like Drag & Drop**: Drag and drop cards within a column to reorder, drag across columns to update task progress, and drag column headers to arrange the swimlane ordering.
- **Task Details Modal**: Click any card to edit its description, manage priorities, set due dates, add subtask checklists, toggle assignees, post comments, and view card history.
- **Subtask Checklist**: Interactive subtasks inside each card equipped with a dynamic visual completion progress bar.
- **Analytics Dashboard**: Zero-dependency visual overlays displaying key metrics like total tasks, completion rates, checklist percentages, overdue task trackers, and column-load graphs.
- **Ambient Customization (Themes)**: Select from 6 pre-configured backdrop gradients (Northern Aurora, Deep Nebula, Cyberpunk Sunset) that persist automatically.
- **Advanced Filters & Search**: Search cards by title or description, and filter by priority, assigned team members, or due dates (Overdue, Due Today, Due Soon).
- **Activity Log**: Keep track of all column creations, card reorderings, task movements, and deletions in a slide-out sidebar feed.
- **LocalStorage Persistence**: Auto-saves your board configurations, cards, checklists, logs, and theme choices locally.

---

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/)
- **Scaffolding/Build Tool**: [Vite](https://vite.dev/)
- **Drag & Drop**: Native HTML5 Drag and Drop API
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (CSS Variables, Backdrop-filters, Custom Scrollbars, Keyframes)
- **State Management**: React State & LocalStorage Synchronization

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+ recommended) and **npm** installed.

### Installation

1. Clone or navigate to the directory:
   ```bash
   cd "DAY25 -- KANBAN BOARD"
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To launch the local development server:
```bash
npm run dev
```
Open your browser and navigate to: **`http://localhost:5173/`**

### Building for Production

To compile and optimize the app for production:
```bash
npm run build
```
This builds static assets into the `dist/` directory, which can be deployed to any hosting service.

---

## 📁 Project Structure

```
DAY25 -- KANBAN BOARD/
├── index.html          # HTML Root Entry
├── package.json        # Node dependencies & Scripts
├── vite.config.js      # Vite Configurations
├── src/
│   ├── main.jsx        # React DOM Renderer
│   ├── App.jsx         # Core Application State
│   ├── App.css         # Empty layout styling
│   ├── index.css       # Global design system & theme variables
│   ├── components/
│   │   ├── Board.jsx         # Column layout grid & Column Drag-Drop
│   │   ├── Column.jsx        # Swimlane column component
│   │   ├── Card.jsx          # Draggable task card item
│   │   ├── CardModal.jsx     # Rich detail overlay for subtasks & comments
│   │   ├── Sidebar.jsx       # Activity feed sidebar
│   │   ├── Analytics.jsx     # CSS data dashboard graphs
│   │   └── ThemeSelector.jsx # Background theme settings
│   ├── hooks/
│   │   └── useLocalStorage.js # LocalStorage sync hook
│   └── utils/
│       └── mockData.js        # Starter cards, priorities, and themes
```
