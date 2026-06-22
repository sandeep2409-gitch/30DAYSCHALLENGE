import React from 'react';
import { Sparkles, Terminal, Code2 } from 'lucide-react';

export default function StatsCloud() {
  const technologies = [
    { name: 'React', count: 11, percentage: 80, color: '#61dafb' },
    { name: 'Node.js/Express', count: 6, percentage: 55, color: '#339933' },
    { name: 'Vue.js', count: 4, percentage: 40, color: '#4fc08d' },
    { name: 'Python/Flask', count: 4, percentage: 40, color: '#3776ab' },
    { name: 'MongoDB', count: 3, percentage: 30, color: '#47a248' },
    { name: 'PostgreSQL/SQLite', count: 2, percentage: 20, color: '#4169e1' },
    { name: 'Firebase', count: 2, percentage: 20, color: '#ffca28' },
    { name: 'Svelte', count: 1, percentage: 10, color: '#ff3e00' },
    { name: 'Socket.io', count: 1, percentage: 10, color: '#010101' },
    { name: 'Three.js', count: 1, percentage: 10, color: '#ffffff' },
  ];

  const weeks = [
    { num: 1, title: 'Foundation', desc: 'HTML5, CSS, React, Vue', progress: 100, color: 'var(--accent-w1)' },
    { num: 2, title: 'Interactivity', desc: 'Canvas, OAuth, APIs, Dexie', progress: 100, color: 'var(--accent-w2)' },
    { num: 3, title: 'Full-Stack', desc: 'Firebase, SQLite, Node, ChartJS', progress: 100, color: 'var(--accent-w3)' },
    { num: 4, title: 'Advanced', desc: 'TensorFlow, WebSockets, ThreeJS', progress: 100, color: 'var(--accent-w4)' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto 3rem auto',
      padding: '0 1rem'
    }}>
      {/* Tech Stack Distribution */}
      <div className="glass-panel scroll-reveal" style={{ padding: '2rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <Code2 size={20} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Tech Stack Frequency</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {technologies.slice(0, 6).map((tech, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: tech.color }} />
                  {tech.name}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{tech.count} {tech.count === 1 ? 'app' : 'apps'}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  width: `${tech.percentage}%`,
                  height: '100%',
                  background: `linear-gradient(to right, var(--primary), ${tech.color})`,
                  borderRadius: '9999px'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Narrative Milestones */}
      <div className="glass-panel scroll-reveal" style={{ padding: '2rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-w3)' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Weekly Progress</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {weeks.map((week, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: `rgba(${week.color === 'var(--accent-w1)' ? '16, 185, 129' : week.color === 'var(--accent-w2)' ? '59, 130, 246' : week.color === 'var(--accent-w3)' ? '139, 92, 246' : '244, 63, 94'}, 0.1)`,
                border: `1px solid ${week.color}`,
                color: week.color,
                fontSize: '0.85rem',
                fontWeight: '800',
                flexShrink: 0
              }}>
                W{week.num}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>{week.title}</h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: week.color }}>{week.progress}% Done</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{week.desc}</p>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', marginTop: '6px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${week.progress}%`,
                    height: '100%',
                    backgroundColor: week.color,
                    borderRadius: '9999px'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
