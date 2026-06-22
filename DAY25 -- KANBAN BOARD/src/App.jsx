import React, { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_BOARD_DATA, AVAILABLE_BACKGROUNDS } from './utils/mockData';
import Board from './components/Board';
import Sidebar from './components/Sidebar';
import Analytics from './components/Analytics';
import ThemeSelector from './components/ThemeSelector';
import CardModal from './components/CardModal';
import { 
  BarChart3, 
  History, 
  Search, 
  Palette, 
  Filter, 
  RotateCcw,
  Sparkles,
  CheckSquare,
  Plus
} from 'lucide-react';

function App() {
  // Persistence state
  const [boardData, setBoardData] = useLocalStorage('kanban_board_data', INITIAL_BOARD_DATA);
  const [activeBg, setActiveBg] = useLocalStorage('kanban_active_bg', 'bg-glass-dark');
  const [activityLog, setActivityLog] = useLocalStorage('kanban_activity_log', [
    { id: 'initial-1', text: 'System initialized with demo project.', timestamp: new Date().toISOString() }
  ]);

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterDueDate, setFilterDueDate] = useState('all');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null);

  // Drag and Drop Ref/State
  const [draggedItem, setDraggedItem] = useState(null); // { type: 'card'|'column', id, sourceColumnId, index }

  // Background styling
  const currentBgStyle = useMemo(() => {
    const bg = AVAILABLE_BACKGROUNDS.find(b => b.id === activeBg);
    return bg ? bg.style : AVAILABLE_BACKGROUNDS[0].style;
  }, [activeBg]);

  // Logging utility
  const logActivity = (text) => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      timestamp: new Date().toISOString()
    };
    setActivityLog(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  // Helper to get total checklist progress
  const getCardChecklistProgress = (card) => {
    if (!card.checklist || card.checklist.length === 0) return null;
    const completed = card.checklist.filter(item => item.completed).length;
    return { completed, total: card.checklist.length };
  };

  // Filtered Cards Memo
  const filteredCards = useMemo(() => {
    const results = {};
    Object.keys(boardData.cards).forEach(cardId => {
      const card = boardData.cards[cardId];
      
      // 1. Search Query Filter
      const matchesSearch = searchQuery === '' || 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 2. Priority Filter
      const matchesPriority = filterPriority === 'all' || card.priority === filterPriority;
      
      // 3. Assignee Filter
      const matchesAssignee = filterAssignee === 'all' || 
        (card.assignees && card.assignees.includes(filterAssignee));
      
      // 4. Due Date Filter
      let matchesDueDate = true;
      if (filterDueDate !== 'all' && card.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(card.dueDate);
        due.setHours(0, 0, 0, 0);
        
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (filterDueDate === 'overdue') {
          matchesDueDate = diffDays < 0;
        } else if (filterDueDate === 'today') {
          matchesDueDate = diffDays === 0;
        } else if (filterDueDate === 'upcoming') {
          matchesDueDate = diffDays > 0 && diffDays <= 3;
        }
      } else if (filterDueDate !== 'all' && !card.dueDate) {
        matchesDueDate = false; // Filter requested a date status, but card doesn't have one
      }

      if (matchesSearch && matchesPriority && matchesAssignee && matchesDueDate) {
        results[cardId] = card;
      }
    });
    return results;
  }, [boardData.cards, searchQuery, filterPriority, filterAssignee, filterDueDate]);

  // Reset board data
  const handleResetBoard = () => {
    if (window.confirm('Are you sure you want to reset the board? All your edits will be replaced with demo data.')) {
      setBoardData(INITIAL_BOARD_DATA);
      setActivityLog([
        { id: `log-${Date.now()}`, text: 'Board state reset to demo data.', timestamp: new Date().toISOString() }
      ]);
      setActiveCardId(null);
      setSearchQuery('');
      setFilterPriority('all');
      setFilterAssignee('all');
      setFilterDueDate('all');
    }
  };

  // --- Board Actions ---

  const addCard = (columnId, title) => {
    if (!title.trim()) return;
    const cardId = `task-${Date.now()}`;
    const newCard = {
      id: cardId,
      title: title.trim(),
      description: '',
      priority: 'low',
      dueDate: '',
      assignees: [],
      checklist: [],
      comments: [],
      activity: [{ id: `act-${Date.now()}`, text: 'Card created', timestamp: new Date().toISOString() }]
    };

    setBoardData(prev => {
      const updatedCards = { ...prev.cards, [cardId]: newCard };
      const column = prev.columns[columnId];
      const updatedColumns = {
        ...prev.columns,
        [columnId]: {
          ...column,
          cardIds: [...column.cardIds, cardId]
        }
      };

      return {
        ...prev,
        cards: updatedCards,
        columns: updatedColumns
      };
    });

    logActivity(`Added card "${title.trim()}" to column "${boardData.columns[columnId].title}"`);
  };

  const updateCard = (cardId, updatedCard) => {
    setBoardData(prev => {
      const oldCard = prev.cards[cardId];
      const updatedCards = { ...prev.cards, [cardId]: updatedCard };
      
      // Determine what changed for the logs
      if (oldCard.priority !== updatedCard.priority) {
        logActivity(`Priority of "${updatedCard.title}" changed to ${updatedCard.priority.toUpperCase()}`);
      } else if (oldCard.title !== updatedCard.title) {
        logActivity(`Card renamed from "${oldCard.title}" to "${updatedCard.title}"`);
      }
      
      return {
        ...prev,
        cards: updatedCards
      };
    });
  };

  const deleteCard = (columnId, cardId) => {
    const cardTitle = boardData.cards[cardId]?.title || 'Unknown Card';
    setBoardData(prev => {
      const updatedCards = { ...prev.cards };
      delete updatedCards[cardId];

      const column = prev.columns[columnId];
      const updatedColumns = {
        ...prev.columns,
        [columnId]: {
          ...column,
          cardIds: column.cardIds.filter(id => id !== cardId)
        }
      };

      return {
        ...prev,
        cards: updatedCards,
        columns: updatedColumns
      };
    });

    if (activeCardId === cardId) setActiveCardId(null);
    logActivity(`Deleted card "${cardTitle}" from column "${boardData.columns[columnId].title}"`);
  };

  const addColumn = (title) => {
    if (!title.trim()) return;
    const columnId = `col-${Date.now()}`;
    const colors = ['#3b82f6', '#eab308', '#a855f7', '#22c55e', '#f43f5e', '#06b6d4', '#f97316'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newColumn = {
      id: columnId,
      title: title.trim(),
      color: randomColor,
      cardIds: []
    };

    setBoardData(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: newColumn
      },
      columnOrder: [...prev.columnOrder, columnId]
    }));

    logActivity(`Created column "${title.trim()}"`);
  };

  const updateColumnTitle = (columnId, newTitle) => {
    if (!newTitle.trim()) return;
    setBoardData(prev => {
      const column = prev.columns[columnId];
      const oldTitle = column.title;
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [columnId]: { ...column, title: newTitle.trim() }
        }
      };
    });
    logActivity(`Column renamed from "${boardData.columns[columnId].title}" to "${newTitle.trim()}"`);
  };

  const deleteColumn = (columnId) => {
    const colTitle = boardData.columns[columnId]?.title || 'Unknown Column';
    if (!window.confirm(`Are you sure you want to delete "${colTitle}" column and all its tasks?`)) return;

    setBoardData(prev => {
      const column = prev.columns[columnId];
      const updatedColumns = { ...prev.columns };
      delete updatedColumns[columnId];

      const updatedCards = { ...prev.cards };
      column.cardIds.forEach(cardId => {
        delete updatedCards[cardId];
      });

      return {
        ...prev,
        columns: updatedColumns,
        cards: updatedCards,
        columnOrder: prev.columnOrder.filter(id => id !== columnId)
      };
    });

    logActivity(`Deleted column "${colTitle}" and all its tasks`);
  };

  const moveColumn = (columnId, direction) => {
    setBoardData(prev => {
      const index = prev.columnOrder.indexOf(columnId);
      if (index === -1) return prev;
      
      const newIndex = direction === 'left' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.columnOrder.length) return prev;
      
      const updatedOrder = [...prev.columnOrder];
      updatedOrder.splice(index, 1);
      updatedOrder.splice(newIndex, 0, columnId);
      
      return {
        ...prev,
        columnOrder: updatedOrder
      };
    });
  };

  const clearColumn = (columnId) => {
    const colTitle = boardData.columns[columnId].title;
    if (!window.confirm(`Are you sure you want to clear all tasks in "${colTitle}"?`)) return;

    setBoardData(prev => {
      const column = prev.columns[columnId];
      const updatedCards = { ...prev.cards };
      column.cardIds.forEach(cardId => {
        delete updatedCards[cardId];
      });

      return {
        ...prev,
        cards: updatedCards,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...column,
            cardIds: []
          }
        }
      };
    });

    logActivity(`Cleared all cards in column "${colTitle}"`);
  };

  // --- Drag and Drop Movement Triggers ---

  const moveCardState = (cardId, sourceColId, targetColId, sourceIdx, targetIdx) => {
    setBoardData(prev => {
      const sourceCol = prev.columns[sourceColId];
      const targetCol = prev.columns[targetColId];
      
      // If moving in same column
      if (sourceColId === targetColId) {
        const newCardIds = [...sourceCol.cardIds];
        newCardIds.splice(sourceIdx, 1);
        newCardIds.splice(targetIdx, 0, cardId);
        
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [sourceColId]: {
              ...sourceCol,
              cardIds: newCardIds
            }
          }
        };
      }

      // If moving to a different column
      const sourceCardIds = [...sourceCol.cardIds];
      sourceCardIds.splice(sourceIdx, 1);

      const targetCardIds = [...targetCol.cardIds];
      targetCardIds.splice(targetIdx, 0, cardId);

      // Add movement history to card activity log
      const card = prev.cards[cardId];
      const updatedCard = {
        ...card,
        activity: [
          {
            id: `act-${Date.now()}`,
            text: `Moved from ${sourceCol.title} to ${targetCol.title}`,
            timestamp: new Date().toISOString()
          },
          ...(card.activity || [])
        ]
      };

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: updatedCard
        },
        columns: {
          ...prev.columns,
          [sourceColId]: { ...sourceCol, cardIds: sourceCardIds },
          [targetColId]: { ...targetCol, cardIds: targetCardIds }
        }
      };
    });

    if (sourceColId !== targetColId) {
      logActivity(`Moved "${boardData.cards[cardId].title}" from "${boardData.columns[sourceColId].title}" to "${boardData.columns[targetColId].title}"`);
    }
  };

  const moveColumnState = (columnId, sourceIdx, targetIdx) => {
    setBoardData(prev => {
      const updatedOrder = [...prev.columnOrder];
      updatedOrder.splice(sourceIdx, 1);
      updatedOrder.splice(targetIdx, 0, columnId);
      
      return {
        ...prev,
        columnOrder: updatedOrder
      };
    });
    logActivity(`Reordered column "${boardData.columns[columnId].title}"`);
  };

  // Render
  return (
    <div 
      className="board-container" 
      style={{ 
        background: currentBgStyle,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        transition: 'background 0.5s ease'
      }}
    >
      {/* Top Header */}
      <header className="glass-panel" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.875rem 2rem',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        zIndex: 50,
      }}>
        {/* Brand Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            padding: '0.5rem', 
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', tracking: '-0.025em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              AetherBoard
              <span style={{ 
                fontSize: '0.65rem', 
                background: 'rgba(59, 130, 246, 0.15)', 
                color: '#60a5fa', 
                padding: '2px 6px', 
                borderRadius: '9999px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                fontWeight: '600'
              }}>Day 25</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Premium Kanban Dashboard</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search cards..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.25rem', height: '36px' }}
            />
          </div>

          {/* Priority Filter */}
          <div className="tooltip-container" style={{ display: 'flex', alignItems: 'center' }}>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input-field"
              style={{ height: '36px', padding: '0 0.5rem 0 2rem', fontSize: '0.8rem', width: '110px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%2394a3b8\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' }}
            >
              <option value="all" style={{background: '#0f172a'}}>All Priorities</option>
              <option value="low" style={{background: '#0f172a'}}>Low</option>
              <option value="medium" style={{background: '#0f172a'}}>Medium</option>
              <option value="high" style={{background: '#0f172a'}}>High</option>
            </select>
            <Filter size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <span className="tooltip-text">Filter by priority</span>
          </div>

          {/* Assignee Filter */}
          <div className="tooltip-container" style={{ display: 'flex', alignItems: 'center' }}>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="input-field"
              style={{ height: '36px', padding: '0 0.5rem 0 2rem', fontSize: '0.8rem', width: '115px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%2394a3b8\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' }}
            >
              <option value="all" style={{background: '#0f172a'}}>All Members</option>
              <option value="PA" style={{background: '#0f172a'}}>Pandu</option>
              <option value="JD" style={{background: '#0f172a'}}>John Doe</option>
              <option value="AM" style={{background: '#0f172a'}}>Alice Miller</option>
              <option value="EM" style={{background: '#0f172a'}}>Eric Mason</option>
            </select>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', pointerEvents: 'none' }}></span>
            <span className="tooltip-text">Filter by member</span>
          </div>

          {/* Date Filter */}
          <div className="tooltip-container" style={{ display: 'flex', alignItems: 'center' }}>
            <select
              value={filterDueDate}
              onChange={(e) => setFilterDueDate(e.target.value)}
              className="input-field"
              style={{ height: '36px', padding: '0 0.5rem 0 2rem', fontSize: '0.8rem', width: '110px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%2394a3b8\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' }}
            >
              <option value="all" style={{background: '#0f172a'}}>All Dates</option>
              <option value="overdue" style={{background: '#0f172a'}}>Overdue</option>
              <option value="today" style={{background: '#0f172a'}}>Due Today</option>
              <option value="upcoming" style={{background: '#0f172a'}}>Due Soon</option>
            </select>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', pointerEvents: 'none' }}></span>
            <span className="tooltip-text">Filter by date</span>
          </div>

          {/* Action buttons */}
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }}></div>

          <button 
            onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
            className={`btn btn-secondary ${isAnalyticsOpen ? 'btn-primary' : ''}`}
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            <BarChart3 size={16} />
          </button>

          <button 
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className={`btn btn-secondary ${isThemeOpen ? 'btn-primary' : ''}`}
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            <Palette size={16} />
          </button>

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`btn btn-secondary ${isSidebarOpen ? 'btn-primary' : ''}`}
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            <History size={16} />
          </button>

          <button 
            onClick={handleResetBoard}
            className="btn btn-secondary"
            style={{ width: '36px', height: '36px', padding: 0 }}
            title="Reset Board data"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* Main Board Area */}
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <Board 
          boardData={boardData}
          filteredCards={filteredCards}
          getChecklistProgress={getCardChecklistProgress}
          addCard={addCard}
          addColumn={addColumn}
          updateColumnTitle={updateColumnTitle}
          deleteColumn={deleteColumn}
          moveColumn={moveColumn}
          clearColumn={clearColumn}
          deleteCard={deleteCard}
          setActiveCardId={setActiveCardId}
          draggedItem={draggedItem}
          setDraggedItem={setDraggedItem}
          moveCardState={moveCardState}
          moveColumnState={moveColumnState}
        />
        
        {/* Slide-out Sidebar for Activity Feed */}
        {isSidebarOpen && (
          <Sidebar 
            activityLog={activityLog} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}

        {/* Theme customization panel */}
        {isThemeOpen && (
          <ThemeSelector
            activeBg={activeBg}
            setActiveBg={setActiveBg}
            onClose={() => setIsThemeOpen(false)}
          />
        )}
      </main>

      {/* Analytics overlay */}
      {isAnalyticsOpen && (
        <Analytics 
          boardData={boardData}
          onClose={() => setIsAnalyticsOpen(false)}
        />
      )}

      {/* Task Details Modal */}
      {activeCardId && (
        <CardModal
          card={boardData.cards[activeCardId]}
          column={Object.values(boardData.columns).find(c => c.cardIds.includes(activeCardId))}
          onClose={() => setActiveCardId(null)}
          updateCard={updateCard}
          deleteCard={deleteCard}
        />
      )}
    </div>
  );
}

export default App;
