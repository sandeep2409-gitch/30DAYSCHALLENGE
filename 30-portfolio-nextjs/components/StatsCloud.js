import React from 'react';
import { Sparkles, Terminal, Code2 } from 'lucide-react';
import appsData from '../data/appsData.json';

export default function StatsCloud() {
  // Calculate tech frequencies dynamically from JSON dataset
  const techCounts = {};
  appsData.forEach(app => {
    app.techStack.forEach(tech => {
      let name = tech;
      const lower = tech.toLowerCase();
      if (lower.includes('react')) name = 'React';
      else if (lower.includes('vue')) name = 'Vue.js';
      else if (lower.includes('svelte')) name = 'Svelte';
      else if (lower.includes('node') || lower.includes('express')) name = 'Node.js/Express';
      else if (lower.includes('python') || lower.includes('flask')) name = 'Python/Flask';
      else if (lower.includes('mongo')) name = 'MongoDB';
      else if (lower.includes('postgres') || lower.includes('sqlite') || lower.includes('sql')) name = 'PostgreSQL/SQLite';
      else if (lower.includes('firebase')) name = 'Firebase';
      else if (lower.includes('socket')) name = 'Socket.io';
      else if (lower.includes('three')) name = 'Three.js';
      
      techCounts[name] = (techCounts[name] || 0) + 1;
    });
  });

  const techMeta = {
    'React': '#61dafb',
    'Node.js/Express': '#339933',
    'Vue.js': '#4fc08d',
    'Python/Flask': '#3776ab',
    'MongoDB': '#47a248',
    'PostgreSQL/SQLite': '#4169e1',
    'Firebase': '#ffca28',
    'Svelte': '#ff3e00',
    'Socket.io': '#6366f1',
    'Three.js': '#ffffff'
  };

  const technologies = Object.keys(techCounts).map(name => {
    const count = techCounts[name];
    const color = techMeta[name] || '#cbd5e1';
    return { name, count, color };
  }).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...technologies.map(t => t.count), 1);
  technologies.forEach(t => {
    t.percentage = Math.round((t.count / maxCount) * 100);
  });

  // Calculate week milestones dynamically
  const weekCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  appsData.forEach(app => {
    if (app.week >= 1 && app.week <= 4) {
      weekCounts[app.week]++;
    }
  });

  const weeks = [
    { num: 1, title: 'Foundation', desc: 'HTML5, CSS, React, Vue', count: weekCounts[1], progress: 100, color: 'var(--accent-w1)' },
    { num: 2, title: 'Interactivity', desc: 'Canvas, OAuth, APIs, Dexie', count: weekCounts[2], progress: 100, color: 'var(--accent-w2)' },
    { num: 3, title: 'Full-Stack', desc: 'Firebase, SQLite, Node, ChartJS', count: weekCounts[3], progress: 100, color: 'var(--accent-w3)' },
    { num: 4, title: 'Advanced & Capstone', desc: 'TensorFlow, WebSockets, ThreeJS, Next.js', count: weekCounts[4], progress: 100, color: 'var(--accent-w4)' },
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
