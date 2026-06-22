import React, { useMemo } from 'react';
import { X, BarChart3, PieChart, CheckCircle2, AlertCircle, Files, ListTodo } from 'lucide-react';
import { PRIORITY_OPTIONS } from '../utils/mockData';

function Analytics({ boardData, onClose }) {
  // Memoize calculations
  const stats = useMemo(() => {
    const cards = Object.values(boardData.cards);
    const totalCards = cards.length;
    
    // Column distribution
    const colCounts = {};
    Object.keys(boardData.columns).forEach(colId => {
      colCounts[colId] = boardData.columns[colId].cardIds.length;
    });

    // Priority distribution
    const priorityCounts = { low: 0, medium: 0, high: 0 };
    cards.forEach(card => {
      if (priorityCounts[card.priority] !== undefined) {
        priorityCounts[card.priority]++;
      }
    });

    // Overdue tasks
    const today = new Date();
    today.setHours(0,0,0,0);
    let overdueCount = 0;
    
    // Completed column ID
    const completedCol = Object.values(boardData.columns).find(
      c => c.title.toLowerCase().includes('done') || c.title.toLowerCase().includes('completed')
    );
    const completedColId = completedCol ? completedCol.id : null;

    cards.forEach(card => {
      if (card.dueDate) {
        const due = new Date(card.dueDate);
        due.setHours(0,0,0,0);
        
        // Only count as overdue if not in the completed column
        const isCompleted = completedColId && boardData.columns[completedColId].cardIds.includes(card.id);
        
        if (due.getTime() < today.getTime() && !isCompleted) {
          overdueCount++;
        }
      }
    });

    // Checklist stats
    let totalSubtasks = 0;
    let completedSubtasks = 0;
    cards.forEach(card => {
      if (card.checklist) {
        card.checklist.forEach(item => {
          totalSubtasks++;
          if (item.completed) completedSubtasks++;
        });
      }
    });

    const checklistRate = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
    const completedCards = completedColId ? boardData.columns[completedColId].cardIds.length : 0;
    const completionRate = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

    return {
      totalCards,
      colCounts,
      priorityCounts,
      overdueCount,
      totalSubtasks,
      completedSubtasks,
      checklistRate,
      completionRate,
      completedCards
    };
  }, [boardData]);

  // Max card count in any column (for progress bar scaling)
  const maxColCount = useMemo(() => {
    const counts = Object.values(stats.colCounts);
    return counts.length > 0 ? Math.max(...counts, 1) : 1;
  }, [stats.colCounts]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '550px',
          borderRadius: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 15, 28, 0.95)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <BarChart3 size={18} color="#10b981" /> Board Performance Analytics
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              padding: '6px',
              borderRadius: '50%'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Analytics Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
          
          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {/* Total cards */}
            <div style={{
              padding: '1rem',
              borderRadius: '0.625rem',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <Files size={18} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Tasks</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>{stats.totalCards}</span>
              </div>
            </div>

            {/* Overdue */}
            <div style={{
              padding: '1rem',
              borderRadius: '0.625rem',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ 
                padding: '0.5rem', 
                borderRadius: '0.5rem', 
                background: stats.overdueCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', 
                color: stats.overdueCount > 0 ? '#ef4444' : '#22c55e' 
              }}>
                <AlertCircle size={18} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Overdue Tasks</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: stats.overdueCount > 0 ? '#f87171' : 'var(--text-primary)' }}>{stats.overdueCount}</span>
              </div>
            </div>

            {/* Board Completion */}
            <div style={{
              padding: '1rem',
              borderRadius: '0.625rem',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                <CheckCircle2 size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Task Completion</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>{stats.completionRate}%</span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)' }}>({stats.completedCards} / {stats.totalCards} cards)</span>
              </div>
            </div>

            {/* Checklist rate */}
            <div style={{
              padding: '1rem',
              borderRadius: '0.625rem',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <ListTodo size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Checklist Rate</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>{stats.checklistRate}%</span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)' }}>({stats.completedSubtasks} / {stats.totalSubtasks} items)</span>
              </div>
            </div>
          </div>

          {/* Column Distribution (Progress bar chart) */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', tracking: '0.05em' }}>
              Column Distribution
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {boardData.columnOrder.map(colId => {
                const column = boardData.columns[colId];
                if (!column) return null;
                const count = stats.colCounts[colId] || 0;
                const pct = Math.round((count / maxColCount) * 100);
                
                return (
                  <div key={colId} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>{column.title}</span>
                      <span style={{ fontWeight: '600' }}>{count}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: column.color,
                        borderRadius: '999px',
                        boxShadow: `0 0 6px ${column.color}50`,
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Breakdown (Stacked bar visual) */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', tracking: '0.05em' }}>
              Priority Segments
            </h4>
            {stats.totalCards === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No data to display</p>
            ) : (
              <div>
                {/* Horizontal ratio bar */}
                <div style={{
                  width: '100%',
                  height: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  display: 'flex',
                  marginBottom: '1rem'
                }}>
                  {/* High */}
                  {stats.priorityCounts.high > 0 && (
                    <div style={{
                      width: `${(stats.priorityCounts.high / stats.totalCards) * 100}%`,
                      height: '100%',
                      backgroundColor: '#ef4444',
                      transition: 'width 0.5s'
                    }} title={`High Priority: ${stats.priorityCounts.high}`} />
                  )}
                  {/* Medium */}
                  {stats.priorityCounts.medium > 0 && (
                    <div style={{
                      width: `${(stats.priorityCounts.medium / stats.totalCards) * 100}%`,
                      height: '100%',
                      backgroundColor: '#f59e0b',
                      transition: 'width 0.5s'
                    }} title={`Medium Priority: ${stats.priorityCounts.medium}`} />
                  )}
                  {/* Low */}
                  {stats.priorityCounts.low > 0 && (
                    <div style={{
                      width: `${(stats.priorityCounts.low / stats.totalCards) * 100}%`,
                      height: '100%',
                      backgroundColor: '#0ea5e9',
                      transition: 'width 0.5s'
                    }} title={`Low Priority: ${stats.priorityCounts.low}`} />
                  )}
                </div>

                {/* Priority Legend */}
                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                    <span style={{ color: 'var(--text-secondary)' }}>High ({stats.priorityCounts.high})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Medium ({stats.priorityCounts.medium})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9' }}></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Low ({stats.priorityCounts.low})</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Analytics;
