import React, { useRef, useMemo } from 'react';
import { portfolioData } from '../data/portfolioData';
import { GitBranch, ArrowUpRight } from 'lucide-react';

export const GitHubSection: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate simulated GitHub contribution matrix (52 weeks x 7 days)
  const contributionGrid = useMemo(() => {
    const cells = [];
    // Seeded random distribution to match ~215 contributions
    for (let i = 0; i < 364; i++) {
      const rand = Math.sin(i * 999) * 10000;
      const val = Math.abs(rand - Math.floor(rand));
      let level = 0;
      if (val > 0.82) level = 4;
      else if (val > 0.68) level = 3;
      else if (val > 0.52) level = 2;
      else if (val > 0.38) level = 1;
      cells.push(level);
    }
    return cells;
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    }
  };

  return (
    <section className="architectural-grid-subtle" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }} id="github">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <span className="section-tag dark">// OPEN SOURCE & CODE COMMITS</span>
            <h2 className="section-title">CODE CADENCE</h2>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#71717A' }}>
            ACTIVITY LOG
          </div>
        </div>

        {/* GitHub Bento Card */}
        <div
          ref={cardRef}
          className="github-card spotlight-card"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header Row */}
          <div className="github-header">
            <div className="github-user-info">
              <div className="github-avatar-circle">
                <GitBranch size={26} />
              </div>
              <div>
                <div className="github-name">{portfolioData.github.name}</div>
                <div className="github-handle">{portfolioData.github.handle}</div>
              </div>
            </div>

            <div className="github-stats-row">
              <span className="github-stat-pill">{portfolioData.github.repos}</span>
              <span className="github-stat-pill">{portfolioData.github.followers}</span>
              <span className="github-stat-pill">{portfolioData.github.following}</span>
            </div>
          </div>

          {/* Contributions Count */}
          <div className="github-contrib-banner">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#39d353', display: 'inline-block' }} />
            <span>{portfolioData.github.contributions}</span>
          </div>

          {/* Minimalist Contribution Matrix */}
          <div className="contrib-grid-wrapper">
            <div className="contrib-grid">
              {contributionGrid.map((lvl, index) => (
                <div
                  key={index}
                  className={`contrib-cell ${lvl > 0 ? `lvl-${lvl}` : ''}`}
                  title={`Activity level ${lvl}`}
                />
              ))}
            </div>
          </div>

          {/* Profile link */}
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <a
              href={portfolioData.github.url}
              target="_blank"
              rel="noreferrer"
              className="magnetic-btn"
            >
              <span>VISIT GITHUB REPOSITORY</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
