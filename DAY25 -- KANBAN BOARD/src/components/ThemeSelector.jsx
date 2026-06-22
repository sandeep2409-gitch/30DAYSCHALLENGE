import React from 'react';
import { X, Palette, Check } from 'lucide-react';
import { AVAILABLE_BACKGROUNDS } from '../utils/mockData';

function ThemeSelector({ activeBg, setActiveBg, onClose }) {
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
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
          <Palette size={18} color="#a855f7" /> Custom Backdrop
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

      {/* Body List */}
      <div style={{
        flex: 1,
        padding: '1.25rem 1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Choose a premium ambient backdrop style for your workspace. Settings will persist automatically.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {AVAILABLE_BACKGROUNDS.map((bg) => {
            const isSelected = activeBg === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => setActiveBg(bg.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 0.2s, background 0.2s',
                  boxShadow: isSelected ? '0 0 10px rgba(59, 130, 246, 0.15)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                {/* Visual Thumbnail */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.375rem',
                  background: bg.style,
                  backgroundSize: 'cover',
                  flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isSelected && <Check size={16} color="#fff" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />}
                </div>

                {/* Name */}
                <div style={{ flex: 1 }}>
                  <span style={{ 
                    display: 'block', 
                    fontSize: '0.8rem', 
                    fontWeight: isSelected ? '600' : '500',
                    color: isSelected ? '#fff' : 'var(--text-secondary)'
                  }}>
                    {bg.name}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {bg.id === 'bg-solid-slate' ? 'Solid Shade' : 'Ambient Gradient'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;
