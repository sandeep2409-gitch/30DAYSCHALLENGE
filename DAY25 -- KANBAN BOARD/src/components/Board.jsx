import React, { useState } from 'react';
import Column from './Column';
import { Plus, X } from 'lucide-react';

function Board({ 
  boardData, 
  filteredCards, 
  getChecklistProgress, 
  addCard, 
  addColumn, 
  updateColumnTitle, 
  deleteColumn, 
  moveColumn, 
  clearColumn,
  deleteCard, 
  setActiveCardId,
  draggedItem,
  setDraggedItem,
  moveCardState,
  moveColumnState
}) {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleCreateColumn = (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    addColumn(newColumnTitle);
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  // --- Column Drag Handlers ---
  const handleColDragStart = (e, columnId, index) => {
    setDraggedItem({ type: 'column', id: columnId, index });
    e.dataTransfer.effectAllowed = 'move';
    // Create a generic ghost image if needed, or rely on browser default
    e.target.style.opacity = '0.5';
  };

  const handleColDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleColDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleColDrop = (e, targetIdx) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== 'column') return;
    
    const sourceIdx = draggedItem.index;
    if (sourceIdx !== targetIdx) {
      moveColumnState(draggedItem.id, sourceIdx, targetIdx);
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1.25rem',
        padding: '1.5rem 2rem',
        overflowX: 'auto',
        overflowY: 'hidden',
        height: '100%',
        width: '100%',
        alignSelf: 'stretch'
      }}
    >
      {/* Column List */}
      {boardData.columnOrder.map((columnId, idx) => {
        const column = boardData.columns[columnId];
        if (!column) return null;

        return (
          <div
            key={columnId}
            draggable
            onDragStart={(e) => handleColDragStart(e, columnId, idx)}
            onDragEnd={handleColDragEnd}
            onDragOver={(e) => handleColDragOver(e, idx)}
            onDrop={(e) => handleColDrop(e, idx)}
            style={{ height: '100%', display: 'flex' }}
          >
            <Column
              column={column}
              filteredCards={filteredCards}
              getChecklistProgress={getChecklistProgress}
              addCard={addCard}
              updateColumnTitle={updateColumnTitle}
              deleteColumn={deleteColumn}
              moveColumn={moveColumn}
              clearColumn={clearColumn}
              deleteCard={deleteCard}
              setActiveCardId={setActiveCardId}
              draggedItem={draggedItem}
              setDraggedItem={setDraggedItem}
              moveCardState={moveCardState}
            />
          </div>
        );
      })}

      {/* Add Column Card */}
      <div style={{ minWidth: '280px', width: '280px', flexShrink: 0 }}>
        {isAddingColumn ? (
          <form 
            onSubmit={handleCreateColumn}
            className="glass-panel" 
            style={{ 
              padding: '1rem', 
              borderRadius: '0.75rem',
              borderStyle: 'solid',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          >
            <input 
              type="text" 
              placeholder="Enter column name..."
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="input-field"
              autoFocus
              style={{ marginBottom: '0.75rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setIsAddingColumn(false)}
                className="btn btn-secondary"
                style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
              >
                <X size={14} style={{ marginRight: '2px' }} /> Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
              >
                <Plus size={14} style={{ marginRight: '2px' }} /> Add Column
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsAddingColumn(true)}
            className="glass-panel"
            style={{ 
              width: '100%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              padding: '1rem', 
              borderRadius: '0.75rem',
              borderStyle: 'dashed',
              borderWidth: '2px',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              background: 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Plus size={16} /> Add Column
          </button>
        )}
      </div>
    </div>
  );
}

export default Board;
