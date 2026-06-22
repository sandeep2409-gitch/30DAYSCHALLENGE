import React, { useState } from 'react';
import { AlignLeft, CheckSquare, Calendar, Trash2 } from 'lucide-react';
import { TEAM_MEMBERS, PRIORITY_OPTIONS } from '../utils/mockData';

function Card({
  card,
  columnId,
  index,
  getChecklistProgress,
  deleteCard,
  setActiveCardId,
  draggedItem,
  setDraggedItem,
  handleCardDropAtIndex
}) {
  const [isDragOverCard, setIsDragOverCard] = useState(false);

  // Drag and drop event handlers for cards
  const handleDragStart = (e) => {
    setDraggedItem({ 
      type: 'card', 
      id: card.id, 
      sourceColumnId: columnId, 
      index 
    });
    e.dataTransfer.effectAllowed = 'move';
    
    // Slight delay to hide original element preview when dragging starts
    setTimeout(() => {
      e.target.classList.add('drag-ghost');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('drag-ghost');
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === 'card' && draggedItem.id !== card.id) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragEnter = () => {
    if (draggedItem && draggedItem.type === 'card' && draggedItem.id !== card.id) {
      setIsDragOverCard(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOverCard(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOverCard(false);
    
    if (!draggedItem || draggedItem.type !== 'card') return;

    const { id: draggedCardId, sourceColumnId, index: sourceIdx } = draggedItem;
    
    if (draggedCardId !== card.id) {
      // Drop card at this card's current index
      handleCardDropAtIndex(draggedCardId, sourceColumnId, sourceIdx, index);
    }
  };

  // Format and prioritize date styling
  const getDateStatus = (dueDate) => {
    if (!dueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Formatting date label
    const parts = dueDate.split('-');
    const label = `${parts[1]}/${parts[2]}`; // MM/DD
    
    if (diffDays < 0) {
      return { label, color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)', text: 'Overdue' };
    } else if (diffDays === 0) {
      return { label: 'Today', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)', text: 'Due Today' };
    } else if (diffDays === 1) {
      return { label: 'Tomorrow', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)', text: 'Due Tomorrow' };
    } else {
      return { label, color: '#94a3b8', bg: 'rgba(255, 255, 255, 0.05)', text: 'On track' };
    }
  };

  const dateStatus = getDateStatus(card.dueDate);
  const checklist = getChecklistProgress(card);
  const priorityObj = PRIORITY_OPTIONS.find(p => p.value === card.priority) || PRIORITY_OPTIONS[0];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => setActiveCardId(card.id)}
      className={`glass-panel-interactive ${isDragOverCard ? 'drag-over-card' : ''}`}
      style={{
        padding: '0.875rem',
        borderRadius: '0.625rem',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(30, 41, 59, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        userSelect: 'none',
        position: 'relative'
      }}
    >
      {/* Card Header: Priority Pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span 
          className="pill" 
          style={{ 
            color: priorityObj.color, 
            backgroundColor: priorityObj.bg,
            border: `1px solid ${priorityObj.color}25`
          }}
        >
          {priorityObj.label}
        </span>
        
        {/* Quick delete option */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Are you sure you want to delete "${card.title}"?`)) {
              deleteCard(columnId, card.id);
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Card Title */}
      <h4 
        style={{ 
          fontSize: '0.875rem', 
          fontWeight: '500', 
          lineHeight: '1.4', 
          color: 'var(--text-primary)' 
        }}
      >
        {card.title}
      </h4>

      {/* Card Indicators (Checklist, Due Date, Description) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        {card.description && (
          <div className="tooltip-container" style={{ display: 'flex', alignItems: 'center' }}>
            <AlignLeft size={14} color="var(--text-muted)" />
            <span className="tooltip-text">Description added</span>
          </div>
        )}

        {checklist && (
          <div 
            className="tooltip-container"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem',
              color: checklist.completed === checklist.total ? '#22c55e' : 'var(--text-secondary)'
            }}
          >
            <CheckSquare size={12} />
            <span>{checklist.completed}/{checklist.total}</span>
            <span className="tooltip-text">Checklist progress</span>
          </div>
        )}

        {dateStatus && (
          <div 
            className="tooltip-container"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem', 
              color: dateStatus.color,
              backgroundColor: dateStatus.bg,
              padding: '2px 6px',
              borderRadius: '4px',
              border: `1px solid ${dateStatus.color}15`
            }}
          >
            <Calendar size={12} />
            <span>{dateStatus.label}</span>
            <span className="tooltip-text">{dateStatus.text}</span>
          </div>
        )}

        {/* Assignees Circle Icons */}
        {card.assignees && card.assignees.length > 0 && (
          <div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }}>
            {card.assignees.map((assigneeId, idx) => {
              const member = TEAM_MEMBERS.find(m => m.id === assigneeId);
              if (!member) return null;
              
              return (
                <div
                  key={assigneeId}
                  className="tooltip-container"
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: member.avatarColor,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: '600',
                    border: '1.5px solid #0f172a',
                    marginLeft: idx > 0 ? '-6px' : '0',
                    zIndex: 5 - idx
                  }}
                >
                  {member.initials}
                  <span className="tooltip-text">{member.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
