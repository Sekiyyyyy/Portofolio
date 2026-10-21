import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

const JourneyCard: React.FC<{ item: (typeof portfolioData.journey)[0]; index: number }> = ({ item, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className={`timeline-item-light journey-card-${index}`}
    >
      <div className="timeline-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#D96B27', fontWeight: 600 }}>
            [{item.num}]
          </span>
          <h3 className="timeline-role" style={{ color: '#0F172A' }}>{item.role}</h3>
        </div>
        <span className="timeline-period" style={{ color: '#D96B27' }}>{item.period}</span>
      </div>

      <p className="timeline-desc" style={{ color: '#475569' }}>{item.desc}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {item.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              padding: '5px 12px',
              borderRadius: '9999px',
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              color: '#334155',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export const JourneySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.timeline-item-light');
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 25 * (i + 1) },
          {
            y: -20 * (i + 1),
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '140px 0',
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        position: 'relative',
      }}
      id="journey"
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <span className="section-tag light">04 // EXPERIENCE & EDUCATION</span>
            <h2 className="section-title" style={{ color: '#0F172A' }}>JOURNEY & MILESTONES</h2>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#64748B' }}>
            2023 — PRESENT
          </div>
        </div>

        {/* Chronological Timeline */}
        <div className="timeline-list">
          {portfolioData.journey.map((item, idx) => (
            <JourneyCard key={item.num} item={item} index={idx} />
          ))}
        </div>
      </div>

      <style>{`
        .timeline-item-light {
          position: relative;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 32px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .timeline-item-light:hover {
          border-color: #CBD5E1;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </section>
  );
};
