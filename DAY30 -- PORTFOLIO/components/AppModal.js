"use client";

import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { X, Copy, Check, Terminal, FileCode2, Award, Share2, Loader2, AlertCircle } from 'lucide-react';
import { marked } from 'marked';

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

const getWeekColor = (week) => {
  switch (week) {
    case 1: return 'var(--accent-w1)';
    case 2: return 'var(--accent-w2)';
    case 3: return 'var(--accent-w3)';
    case 4: return 'var(--accent-w4)';
    default: return 'var(--primary)';
  }
};

export default function AppModal({ app, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('readme'); // 'readme' or 'overview'
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Fetch README content
    if (app && app.folderName) {
      setLoading(true);
      setError('');
      fetch(`/api/readme?folder=${encodeURIComponent(app.folderName)}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load README.md');
          return res.json();
        })
        .then(data => {
          setReadme(data.content || '');
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError(err.message || 'Error loading README.md');
          setLoading(false);
        });
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [app]);

  if (!app) return null;

  const weekColor = getWeekColor(app.week);
  const primaryBadge = getPrimaryTechBadge(app.techStack);
  const ModalIconComponent = primaryBadge.icon === 'Github' ? GithubIcon : (LucideIcons[primaryBadge.icon] || LucideIcons.HelpCircle);
  const primaryColor = primaryBadge.color;


  // Build the LinkedIn Post dynamic string
  const nextAppText = app.day < 28 ? `Day ${app.day + 1}` : 'Day 30: Portfolio Capstone';
  const linkedinPost = `🚀 Day ${app.day} / 30 WebApps in 30 Days

Building ${app.name} today! 

Tech Stack: ${app.techStack.join(' + ')}
Key Feature: ${app.keyFeature}

What I learned:
${app.learnings.map(learning => `✨ ${learning}`).join('\n')}

Code: github.com/sandeep2409-gitch/30-DAYS-CHALLENGE/tree/main/${encodeURIComponent(app.folderName)}

Building in public! Next up: ${nextAppText}

#BuildInPublic #WebDevelopment #30WebAppsIn30Days #CodingChallenge`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(linkedinPost);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getReadmeHtml = () => {
    if (!readme) return '';
    try {
      return { __html: marked.parse(readme) };
    } catch (e) {
      console.error(e);
      return { __html: '<p style="color: var(--text-muted)">Error compiling markdown</p>' };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(5, 7, 12, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '24px',
        position: 'relative',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '2.5rem',
        border: `1px solid rgba(${weekColor === 'var(--accent-w1)' ? '16, 185, 129' : weekColor === 'var(--accent-w2)' ? '59, 130, 246' : weekColor === 'var(--accent-w3)' ? '139, 92, 246' : '244, 63, 94'}, 0.15)`,
        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(${weekColor === 'var(--accent-w1)' ? '16, 185, 129' : weekColor === 'var(--accent-w2)' ? '59, 130, 246' : weekColor === 'var(--accent-w3)' ? '139, 92, 246' : '244, 63, 94'}, 0.05)`
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: primaryBadge.bg,
            border: `1px solid ${primaryColor.startsWith('#') ? `${primaryColor}40` : 'var(--border-color)'}`,
            color: primaryColor,
            boxShadow: `0 0 15px ${primaryColor.startsWith('#') ? `${primaryColor}30` : 'rgba(255,255,255,0.05)'}`,
            flexShrink: 0
          }}>
            <ModalIconComponent size={28} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: weekColor }}>
                Day {app.day}
              </span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Week {app.week} Challenge
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', marginBottom: '0.75rem' }}>
              {app.name}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {app.techStack.map((tech, idx) => {
                const meta = getTechBadgeMeta(tech);
                const TechIcon = meta.icon === 'Github' ? GithubIcon : (LucideIcons[meta.icon] || LucideIcons.Code2);
                const borderCol = meta.color.startsWith('#') ? `${meta.color}25` : 'var(--border-color)';
                return (
                  <span 
                    key={idx} 
                    className="badge-pill" 
                    style={{ 
                      fontSize: '0.75rem',
                      color: meta.color,
                      backgroundColor: meta.bg,
                      borderColor: borderCol,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px'
                    }}
                  >
                    <TechIcon size={12} strokeWidth={2.5} />
                    {tech}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Tab Bar */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '2rem',
          gap: '24px'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'overview' ? `2px solid ${weekColor}` : '2px solid transparent',
              color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Award size={16} style={{ color: activeTab === 'overview' ? weekColor : 'inherit' }} /> Project Overview
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'readme' ? `2px solid ${weekColor}` : '2px solid transparent',
              color: activeTab === 'readme' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FileCode2 size={16} style={{ color: activeTab === 'readme' ? weekColor : 'inherit' }} /> README.md
          </button>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {activeTab === 'overview' ? (
            /* Tab 1: Project Overview */
            <div>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} style={{ color: weekColor }} /> Project Summary
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {app.description}
              </p>

              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCode2 size={16} style={{ color: weekColor }} /> Key Learnings
              </h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {app.learnings.map((learning, idx) => (
                  <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {learning}
                  </li>
                ))}
              </ul>

              {/* Run environment details */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '700', marginBottom: '8px' }}>
                  <Terminal size={14} style={{ color: weekColor }} /> Workspace Run Specifications
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>Folder:</strong> <code style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{app.folderName}</code>
                  <strong>Run Command:</strong> <code style={{ color: weekColor, fontFamily: 'monospace' }}>{app.runCommand}</code>
                </div>

                {app.githubUrl && (
                  <a 
                    href={app.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      textDecoration: 'none',
                      marginTop: '1rem',
                      transition: 'var(--transition-smooth)',
                      width: '100%',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = weekColor;
                      e.currentTarget.style.color = '#05070c';
                      e.currentTarget.style.borderColor = weekColor;
                      e.currentTarget.style.boxShadow = `0 0 15px rgba(${weekColor === 'var(--accent-w1)' ? '16, 185, 129' : weekColor === 'var(--accent-w2)' ? '59, 130, 246' : weekColor === 'var(--accent-w3)' ? '139, 92, 246' : '244, 63, 94'}, 0.2)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <GithubIcon size={16} /> Open Repository on GitHub
                  </a>
                )}
              </div>

              {/* LinkedIn Compiler Area */}
              <div style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Share2 size={16} style={{ color: 'var(--primary)' }} /> LinkedIn Post Compiler
                  </h3>
                  <button 
                    onClick={handleCopy}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: copied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                      border: copied ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                      color: copied ? 'var(--accent-w1)' : 'var(--primary)',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {copied ? (
                      <>
                        <Check size={14} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy Post
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={linkedinPost}
                  style={{
                    width: '100%',
                    height: '150px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '1rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    resize: 'none',
                    outline: 'none',
                    cursor: 'text'
                  }}
                  onClick={(e) => e.currentTarget.select()}
                />
              </div>
            </div>
          ) : (
            /* Tab 2: README.md */
            <div>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
                  <Loader2 className="animate-spin" size={32} style={{ color: weekColor }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading project README...</p>
                </div>
              ) : error ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', gap: '1rem', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.02)' }}>
                  <AlertCircle size={32} style={{ color: 'var(--accent-w4)' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{error}</p>
                </div>
              ) : (
                <div>
                  {readme ? (
                    <div 
                      className="readme-content" 
                      dangerouslySetInnerHTML={getReadmeHtml()} 
                      style={{ 
                        maxHeight: '58vh', 
                        overflowY: 'auto', 
                        paddingRight: '12px',
                        paddingBottom: '1.5rem'
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', gap: '1rem' }}>
                      <AlertCircle size={32} style={{ color: 'var(--text-muted)' }} />
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No README.md content found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

