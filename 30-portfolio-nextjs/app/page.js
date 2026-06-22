import React from 'react';
import Header from '../components/Header';
import StatsCloud from '../components/StatsCloud';
import ProjectGrid from '../components/ProjectGrid';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Dynamic Animated Space Background */}
      <div className="bg-glow-container">
        <div className="bg-glow-orb-1" />
        <div className="bg-glow-orb-2" />
      </div>

      {/* Main Content Area */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header />
        <StatsCloud />
        <ProjectGrid />
      </div>
    </main>
  );
}
