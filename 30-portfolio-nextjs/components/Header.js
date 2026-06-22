"use client";

import React from 'react';
import { Calendar, Cpu, Layers, Trophy } from 'lucide-react';

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

export default function Header() {
  const stats = [
    { label: 'Completed Apps', value: '28 / 28', icon: Trophy, color: 'var(--primary)' },
    { label: 'Weeks of Code', value: '4 Weeks', icon: Calendar, color: 'var(--accent-w2)' },
    { label: 'Tech Stack Variety', value: '12+ Techs', icon: Cpu, color: 'var(--accent-w3)' },
    { label: 'Challenge Status', value: '100% Done', icon: Layers, color: 'var(--accent-w1)' },
  ];

  return (
    <header style={{ marginBottom: '3rem', position: 'relative' }}>
      {/* Title section */}
      <div style={{ textAlign: 'center', padding: '4rem 1rem 3rem 1rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          🚀 The Final Milestone: Day 30 (Capstone)
        </div>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          background: 'linear-gradient(to right, #f8fafc, #cbd5e1, #6366f1, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
          lineHeight: '1.1'
        }}>
          30-Days Web Apps Challenge
        </h1>
        <p style={{
          maxWidth: '680px',
          margin: '0 auto',
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          fontFamily: 'var(--font-sans)',
          marginBottom: '2rem'
        }}>
          A hands-on journey of building a web application every single day. Explore 28 self-contained apps spanning React, Vue, Svelte, Flask, WebSockets, Canvas, and Machine Learning.
        </p>
        
        {/* GitHub Repository Redirection Button */}
        <div>
          <a
            href="https://github.com/sandeep2409-gitch/30DAYSCHALLENGE"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '12px 28px',
              borderRadius: '9999px',
              fontSize: '0.95rem',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'var(--transition-smooth)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.color = '#05070c';
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
            }}
          >
            <GithubIcon size={18} /> View Challenge Repository
          </a>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel" style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              borderRadius: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `rgba(${stat.color === 'var(--primary)' ? '99, 102, 241' : stat.color === 'var(--accent-w2)' ? '59, 130, 246' : stat.color === 'var(--accent-w3)' ? '139, 92, 246' : '16, 185, 129'}, 0.1)`,
                border: `1px solid rgba(${stat.color === 'var(--primary)' ? '99, 102, 241' : stat.color === 'var(--accent-w2)' ? '59, 130, 246' : stat.color === 'var(--accent-w3)' ? '139, 92, 246' : '16, 185, 129'}, 0.25)`,
                color: stat.color
              }}>
                <Icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-title)', marginTop: '2px' }}>
                  {stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
}
