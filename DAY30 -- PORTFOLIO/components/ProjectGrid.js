"use client";

import React, { useState, useEffect } from 'react';
import AppCard from './AppCard';
import AppModal from './AppModal';
import appsData from '../data/appsData.json';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function ProjectGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 means All Weeks
  const [selectedApp, setSelectedApp] = useState(null);

  // Fallback Scroll Animations for Unsupported Browsers
  useEffect(() => {
    if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0) scale(1)';
            } else {
              entry.target.style.opacity = '0.15';
              entry.target.style.transform = 'translateY(30px) scale(0.95)';
            }
          });
        },
        { threshold: 0.05 }
      );

      document.querySelectorAll('.scroll-reveal').forEach((el) => {
        // Set initial state
        el.style.opacity = '0.15';
        el.style.transform = 'translateY(30px) scale(0.95)';
        observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, [searchQuery, selectedWeek]);

  const weeks = [
    { value: 0, label: 'All Projects', color: 'var(--primary)' },
    { value: 1, label: 'Week 1: Foundations', color: 'var(--accent-w1)' },
    { value: 2, label: 'Week 2: Interactive', color: 'var(--accent-w2)' },
    { value: 3, label: 'Week 3: Full-Stack', color: 'var(--accent-w3)' },
    { value: 4, label: 'Week 4: Advanced & Capstone', color: 'var(--accent-w4)' },
  ];

  // Filtering Logic
  const filteredApps = appsData.filter((app) => {
    const matchesWeek = selectedWeek === 0 || app.week === selectedWeek;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      app.name.toLowerCase().includes(searchLower) ||
      app.keyFeature.toLowerCase().includes(searchLower) ||
      app.techStack.some((tech) => tech.toLowerCase().includes(searchLower));

    return matchesWeek && matchesSearch;
  });

  const getWeekColor = (week) => {
    switch (week) {
      case 1: return 'var(--accent-w1)';
      case 2: return 'var(--accent-w2)';
      case 3: return 'var(--accent-w3)';
      case 4: return 'var(--accent-w4)';
      default: return 'var(--primary)';
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedWeek(0);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 5rem 1rem' }}>
      {/* Search & Filters Header */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        borderRadius: '24px',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '1.25rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            placeholder="Search by app name, features, or technologies (e.g. React, socket, canvas)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3.25rem',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              background: 'rgba(0,0,0,0.2)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              transition: 'var(--transition-smooth)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        {/* Week Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginRight: '8px'
          }}>
            <SlidersHorizontal size={14} /> Filter:
          </span>

          {weeks.map((week) => {
            const isActive = selectedWeek === week.value;
            const weekColor = getWeekColor(week.value);
            return (
              <button
                key={week.value}
                onClick={() => setSelectedWeek(week.value)}
                style={{
                  background: isActive ? weekColor : 'rgba(255, 255, 255, 0.02)',
                  color: isActive ? '#05070c' : 'var(--text-secondary)',
                  border: isActive ? `1px solid ${weekColor}` : '1px solid var(--border-color)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = weekColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                {week.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* App Grid */}
      {filteredApps.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredApps.map((app) => (
            <AppCard 
              key={app.day} 
              app={app} 
              onClick={setSelectedApp} 
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel" style={{
          padding: '4rem 2rem',
          borderRadius: '24px',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '2rem auto'
        }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No apps match your criteria
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Try adjusting your search terms or selecting another week filter.
          </p>
          <button 
            onClick={handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: 'var(--primary)',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            <RefreshCw size={14} /> Clear Search & Filters
          </button>
        </div>
      )}

      {/* Details Modal */}
      {selectedApp && (
        <AppModal 
          app={selectedApp} 
          onClose={() => setSelectedApp(null)} 
        />
      )}
    </div>
  );
}
