import React from 'react';
import { X, History, Clock } from 'lucide-react';

function Sidebar({ activityLog, onClose }) {
  return (
    <div 
      className="glass-panel"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '320px',
        height: '100%',
        zIndex: 40,
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        background: 'rgba(10, 15, 30, 0.88)',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Sidebar Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
          <History size={18} color="#60a5fa" /> Activity Log
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <X size={18} />
        </button>
      </div>

      {/* Sidebar Feed Body */}
      <div style={{
        flex: 1,
        padding: '1.25rem 1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {activityLog.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic', marginTop: '2rem' }}>
            No activity logged yet.
          </p>
        ) : (
          activityLog.map((log) => (
            <div 
              key={log.id} 
              style={{
                display: 'flex',
                gap: '0.75rem',
                fontSize: '0.8rem',
                lineHeight: '1.4',
                paddingBottom: '0.875rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
              }}
            >
              <div style={{
                marginTop: '3px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                boxShadow: '0 0 8px #3b82f6',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: '#e2e8f0' }}>{log.text}</p>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  fontSize: '0.65rem', 
                  color: 'var(--text-muted)',
                  marginTop: '0.25rem' 
                }}>
                  <Clock size={10} />
                  {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Slide Animation CSS style block */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
