import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ExternalLink, Terminal } from 'lucide-react';

const GithubIcon = ({ size = 16, ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function AppCard({ app, onClick }) {
  // Determine week-based variables
  const getWeekColor = (week) => {
    switch (week) {
      case 1: return 'var(--accent-w1)';
      case 2: return 'var(--accent-w2)';
      case 3: return 'var(--accent-w3)';
      case 4: return 'var(--accent-w4)';
      default: return 'var(--primary)';
    }
  };

  const getWeekGlow = (week) => {
    switch (week) {
      case 1: return 'neon-border-w1';
      case 2: return 'neon-border-w2';
      case 3: return 'neon-border-w3';
      case 4: return 'neon-border-w4';
      default: return '';
    }
  };

  const weekColor = getWeekColor(app.week);
  const glowClass = getWeekGlow(app.week);

  // Tech Badge Logo & Color Resolver
  const getTechBadgeMeta = (tech) => {
    const t = tech.toLowerCase();
    if (t.includes('react')) return { icon: 'Atom', color: '#61dafb', bg: 'rgba(97, 218, 251, 0.08)' };
    if (t.includes('vue')) return { icon: 'Code2', color: '#4fc08d', bg: 'rgba(79, 192, 141, 0.08)' };
    if (t.includes('svelte')) return { icon: 'Flame', color: '#ff3e00', bg: 'rgba(255, 62, 0, 0.08)' };
    if (t.includes('node') || t.includes('express')) return { icon: 'Server', color: '#339933', bg: 'rgba(51, 153, 51, 0.08)' };
    if (t.includes('mongo')) return { icon: 'Database', color: '#47a248', bg: 'rgba(71, 162, 72, 0.08)' };
    if (t.includes('postgres') || t.includes('sqlite') || t.includes('sql')) return { icon: 'Database', color: '#4169e1', bg: 'rgba(65, 105, 225, 0.08)' };
    if (t.includes('firebase')) return { icon: 'Flame', color: '#ffca28', bg: 'rgba(255, 202, 40, 0.08)' };
    if (t.includes('python') || t.includes('flask')) return { icon: 'Terminal', color: '#3776ab', bg: 'rgba(55, 118, 171, 0.08)' };
    if (t.includes('chart') || t.includes('vantage') || t.includes('stock')) return { icon: 'LineChart', color: '#ff6384', bg: 'rgba(255, 99, 132, 0.08)' };
    if (t.includes('canvas')) return { icon: 'Brush', color: '#e5c158', bg: 'rgba(229, 193, 88, 0.08)' };
    if (t.includes('tensorflow') || t.includes('nlp') || t.includes('hugging') || t.includes('sentiment') || t.includes('summarizer') || t.includes('textblob')) return { icon: 'Cpu', color: '#ff6f00', bg: 'rgba(255, 111, 0, 0.08)' };
    if (t.includes('socket')) return { icon: 'Radio', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.08)' };
    if (t.includes('three')) return { icon: 'Boxes', color: '#ffffff', bg: 'rgba(255, 255, 255, 0.08)' };
    if (t.includes('spotify') || t.includes('audio') || t.includes('playlist')) return { icon: 'Music', color: '#1db954', bg: 'rgba(29, 185, 84, 0.08)' };
    if (t.includes('tmdb') || t.includes('movie')) return { icon: 'Film', color: '#01b4e4', bg: 'rgba(1, 180, 228, 0.08)' };
    if (t.includes('github')) return { icon: 'Github', color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.08)' };
    if (t.includes('localstorage') || t.includes('indexeddb') || t.includes('dexie') || t.includes('offline')) return { icon: 'HardDrive', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.08)' };
    return { icon: 'Code2', color: 'var(--text-secondary)', bg: 'rgba(255, 255, 255, 0.03)' };
  };

  const getPrimaryTechBadge = (stack) => {
    const primaryTech = stack.find(t => {
      const lower = t.toLowerCase();
      return lower.includes('react') || lower.includes('vue') || lower.includes('svelte') || lower.includes('node') || lower.includes('express') || lower.includes('python') || lower.includes('flask');
    }) || stack[0];
    return getTechBadgeMeta(primaryTech);
  };

  const primaryBadge = getPrimaryTechBadge(app.techStack);
  const IconComponent = primaryBadge.icon === 'Github' ? GithubIcon : (LucideIcons[primaryBadge.icon] || LucideIcons.HelpCircle);
  const primaryColor = primaryBadge.color;

  return (
    <div 
      className={`glass-panel ${glowClass} scroll-reveal`}
      onClick={() => onClick(app)}
      style={{
        padding: '1.75rem',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '340px',
      }}
    >
      {/* Week Accent Strip */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: weekColor
      }} />

      <div>
        {/* Header: Day, Tech Logos row & Main Tech Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', maxWidth: '75%' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              color: weekColor,
              background: `rgba(${weekColor === 'var(--accent-w1)' ? '16, 185, 129' : weekColor === 'var(--accent-w2)' ? '59, 130, 246' : weekColor === 'var(--accent-w3)' ? '139, 92, 246' : '244, 63, 94'}, 0.08)`,
              padding: '4px 10px',
              borderRadius: '9999px',
              border: `1px solid rgba(${weekColor === 'var(--accent-w1)' ? '16, 185, 129' : weekColor === 'var(--accent-w2)' ? '59, 130, 246' : weekColor === 'var(--accent-w3)' ? '139, 92, 246' : '244, 63, 94'}, 0.25)`
            }}>
              Day {app.day}
            </span>
            {app.githubUrl && (
              <a 
                href={app.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
                title="View GitHub Repository"
              >
                <GithubIcon size={12} />
              </a>
            )}
            {/* Tech logos row next to Day Badge (Option B) */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {app.techStack.map((tech, idx) => {
                const meta = getTechBadgeMeta(tech);
                const TechIcon = meta.icon === 'Github' ? GithubIcon : (LucideIcons[meta.icon] || LucideIcons.Code2);
                const borderCol = meta.color.startsWith('#') ? `${meta.color}25` : 'var(--border-color)';
                return (
                  <div 
                    key={idx} 
                    title={tech}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      background: meta.bg,
                      border: `1px solid ${borderCol}`,
                      color: meta.color
                    }}
                  >
                    <TechIcon size={11} strokeWidth={2.2} />
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Primary Tech Logo container (Option A) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: primaryBadge.bg,
            border: `1px solid ${primaryColor.startsWith('#') ? `${primaryColor}40` : 'var(--border-color)'}`,
            color: primaryColor,
            boxShadow: `0 0 12px ${primaryColor.startsWith('#') ? `${primaryColor}20` : 'rgba(255,255,255,0.05)'}`
          }}>
            <IconComponent size={20} strokeWidth={2.2} />
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-title)'
        }}>
          {app.name}
        </h3>

        {/* Description / Feature */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {app.keyFeature}
        </p>
      </div>

      {/* Footer: Run Command & Action Buttons */}
      <div>
        {/* Terminal Run Snippet */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          color: 'var(--text-muted)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: '1rem'
        }}>
          <Terminal size={12} style={{ color: weekColor, flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.runCommand}</span>
        </div>

        {/* Action Button Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick(app);
            }}
            style={{
              flexGrow: 1,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--border-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            Details
          </button>
          
          {app.githubUrl && (
            <a 
              href={app.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: `rgba(${weekColor === 'var(--accent-w1)' ? '16, 185, 129' : weekColor === 'var(--accent-w2)' ? '59, 130, 246' : weekColor === 'var(--accent-w3)' ? '139, 92, 246' : '244, 63, 94'}, 0.08)`,
                border: `1px solid rgba(${weekColor === 'var(--accent-w1)' ? '16, 185, 129' : weekColor === 'var(--accent-w2)' ? '59, 130, 246' : weekColor === 'var(--accent-w3)' ? '139, 92, 246' : '244, 63, 94'}, 0.25)`,
                color: weekColor,
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'var(--transition-smooth)',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = weekColor;
                e.currentTarget.style.color = '#05070c';
                e.currentTarget.style.borderColor = weekColor;
                e.currentTarget.style.boxShadow = `0 0 10px ${weekColor}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `rgba(${weekColor === 'var(--accent-w1)' ? '16, 185, 129' : weekColor === 'var(--accent-w2)' ? '59, 130, 246' : weekColor === 'var(--accent-w3)' ? '139, 92, 246' : '244, 63, 94'}, 0.08)`;
                e.currentTarget.style.color = weekColor;
                e.currentTarget.style.borderColor = `rgba(${weekColor === 'var(--accent-w1)' ? '16, 185, 129' : weekColor === 'var(--accent-w2)' ? '59, 130, 246' : weekColor === 'var(--accent-w3)' ? '139, 92, 246' : '244, 63, 94'}, 0.25)`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <GithubIcon size={12} /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
