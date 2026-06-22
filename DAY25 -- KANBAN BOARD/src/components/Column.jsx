import React, { useState, useRef } from 'react';
import Card from './Card';
import { MoreHorizontal, Plus, Trash2, X, AlertTriangle, ArrowLeft, ArrowRight, EyeOff } from 'lucide-react';

function Column({
  column,
  filteredCards,
  getChecklistProgress,
  addCard,
  updateColumnTitle,
  deleteColumn,
  moveColumn,
  clearColumn,
  deleteCard,
  setActiveCardId,
  draggedItem,
  setDraggedItem,
  moveCardState
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const menuRef = useRef(null);

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (!columnTitle.trim()) {
      setColumnTitle(column.title);
      setIsEditingTitle(false);
      return;
    }
    updateColumnTitle(column.id, columnTitle);
    setIsEditingTitle(false);
  };

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    addCard(column.id, newCardTitle);
    setNewCardTitle('');
    setIsAddingCard(false);
  };

  // --- Drag and Drop: Cards entering/leaving Column ---
  const handleColumnDragOver = (e) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === 'card') {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleColumnDragEnter = (e) => {
    if (draggedItem && draggedItem.type === 'card') {
      setIsDragOver(true);
    }
  };

  const handleColumnDragLeave = (e) => {
    setIsDragOver(false);
  };

  const handleColumnDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!draggedItem || draggedItem.type !== 'card') return;

    const { id: cardId, sourceColumnId, index: sourceIdx } = draggedItem;
    
    // If we drop in an empty space of a column or at the end
    // we move it to the end of this column's cards
    const targetIdx = column.cardIds.length;
    
    // Only trigger if column is different, or we drag to the end of the same column
    if (sourceColumnId !== column.id) {
      moveCardState(cardId, sourceColumnId, column.id, sourceIdx, targetIdx);
    }
  };

  // --- Drop Card at specific index inside Column ---
  const handleCardDropAtIndex = (draggedCardId, sourceColId, sourceIdx, targetIdx) => {
    moveCardState(draggedCardId, sourceColId, column.id, sourceIdx, targetIdx);
  };

  // Filter column cards based on active searches/filters
  const visibleCardIds = column.cardIds.filter(id => filteredCards[id]);

  return (
    <div 
      className={`glass-panel ${isDragOver ? 'drag-over-column' : ''}`}
      style={{
        width: '290px',
        minWidth: '290px',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0.85rem',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
        background: isDragOver ? 'rgba(59, 130, 246, 0.04)' : 'rgba(13, 18, 30, 0.45)',
        transition: 'background 0.2s, border-color 0.2s',
        overflow: 'hidden'
      }}
      onDragOver={handleColumnDragOver}
      onDragEnter={handleColumnDragEnter}
      onDragLeave={handleColumnDragLeave}
      onDrop={handleColumnDrop}
    >
      {/* Column Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(255, 255, 255, 0.01)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '80%' }}>
          <span 
            className="glow-indicator" 
            style={{ 
              backgroundColor: column.color,
              boxShadow: `0 0 10px ${column.color}` 
            }} 
          />
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} style={{ width: '100%' }}>
              <input
                type="text"
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                className="input-field"
                onBlur={handleTitleSubmit}
                autoFocus
                style={{
                  padding: '2px 6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  height: '28px',
                  fontFamily: 'var(--font-heading)'
                }}
              />
            </form>
          ) : (
            <h3 
              onClick={() => setIsEditingTitle(true)}
              style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'var(--text-primary)'
              }}
              title="Click to rename"
            >
              {column.title}
            </h3>
          )}
          <span 
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '1px 6px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-secondary)',
              marginLeft: '2px'
            }}
          >
            {column.cardIds.length}
          </span>
        </div>

        {/* Options Menu Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <MoreHorizontal size={18} />
          </button>
          
          {showMenu && (
            <>
              {/* Overlay Backdrop to close menu */}
              <div 
                onClick={() => setShowMenu(false)}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
              />
              <div
                ref={menuRef}
                className="glass-panel"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '1.75rem',
                  width: '170px',
                  borderRadius: '0.5rem',
                  zIndex: 100,
                  padding: '0.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  borderColor: 'rgba(255,255,255,0.1)'
                }}
              >
                <button
                  onClick={() => { moveColumn(column.id, 'left'); setShowMenu(false); }}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start', padding: '0.375rem 0.5rem', fontSize: '0.75rem', border: 'none', background: 'transparent', width: '100%' }}
                >
                  <ArrowLeft size={14} /> Move Left
                </button>
                <button
                  onClick={() => { moveColumn(column.id, 'right'); setShowMenu(false); }}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start', padding: '0.375rem 0.5rem', fontSize: '0.75rem', border: 'none', background: 'transparent', width: '100%' }}
                >
                  <ArrowRight size={14} /> Move Right
                </button>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '2px 0' }} />
                <button
                  onClick={() => { clearColumn(column.id); setShowMenu(false); }}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start', padding: '0.375rem 0.5rem', fontSize: '0.75rem', border: 'none', background: 'transparent', width: '100%', color: '#fbbf24' }}
                >
                  <EyeOff size={14} /> Clear Tasks
                </button>
                <button
                  onClick={() => { deleteColumn(column.id); setShowMenu(false); }}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start', padding: '0.375rem 0.5rem', fontSize: '0.75rem', border: 'none', background: 'transparent', width: '100%', color: '#ef4444' }}
                >
                  <Trash2 size={14} /> Delete Column
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cards List Body */}
      <div 
        style={{
          flex: 1,
          padding: '0.75rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          minHeight: '100px'
        }}
      >
        {visibleCardIds.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            textAlign: 'center',
            border: '1px dashed rgba(255,255,255,0.03)',
            borderRadius: '0.5rem',
            background: 'rgba(0,0,0,0.05)',
            userSelect: 'none'
          }}>
            Drop tasks here
          </div>
        ) : (
          visibleCardIds.map((cardId, index) => {
            const card = filteredCards[cardId];
            if (!card) return null;

            return (
              <Card
                key={cardId}
                card={card}
                columnId={column.id}
                index={index}
                getChecklistProgress={getChecklistProgress}
                deleteCard={deleteCard}
                setActiveCardId={setActiveCardId}
                draggedItem={draggedItem}
                setDraggedItem={setDraggedItem}
                handleCardDropAtIndex={handleCardDropAtIndex}
              />
            );
          })
        )}
      </div>

      {/* Column Footer: Inline Card Form */}
      <div 
        style={{
          padding: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.03)',
          background: 'rgba(0,0,0,0.08)'
        }}
      >
        {isAddingCard ? (
          <form onSubmit={handleCreateCard} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <textarea
              placeholder="Task title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="input-field"
              rows={2}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCreateCard(e);
                }
              }}
              style={{ resize: 'none', padding: '0.5rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              >
                Add Card
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.375rem 0.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.8rem',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Plus size={14} /> Add Card
          </button>
        )}
      </div>
    </div>
  );
}

export default Column;
