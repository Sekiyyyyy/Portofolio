import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';
import { TechIcon } from './TechIcon';

gsap.registerPlugin(ScrollTrigger);

interface TechItem {
  num: string;
  name: string;
  category: string;
}

const TechCard: React.FC<{ item: TechItem; index: number }> = ({ item }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 3D Magnetic Tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const card = cardRef.current;
    if (card) {
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
  };

  return (
    <div
      ref={cardRef}
      className="tech-card-light"
      style={{
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Index Watermark Zoom */}
      <span
        style={{
          position: 'absolute',
          right: '18px',
          bottom: '-10px',
          fontFamily: 'var(--font-display)',
          fontSize: '5rem',
          color: isHovered ? 'rgba(217, 107, 39, 0.12)' : 'rgba(0, 0, 0, 0.04)',
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'transform 0.4s ease, color 0.3s ease',
          transform: isHovered ? 'scale(1.2) translateY(-4px)' : 'scale(1) translateY(0)',
          lineHeight: 1,
        }}
      >
        {item.num.replace(/\s+/g, '')}
      </span>

      <div className="tech-card-left" style={{ position: 'relative', zIndex: 2 }}>
        <span className="tech-num" style={{ color: '#94A3B8' }}>{item.num}</span>
        <h3 className="tech-name" style={{ color: '#0F172A' }}>{item.name}</h3>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span className="tech-category-light">{item.category}</span>
        <div
          style={{
            transform: isHovered ? 'scale(1.18)' : 'scale(1)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TechIcon name={item.name} size={30} />
        </div>
      </div>
    </div>
  );
};

export const TechStackSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.tech-card-light');
      cards.forEach((card, i) => {
        const offset = (i % 3 - 1) * 24; // alternating dynamic parallax shift
        gsap.to(card, {
          y: offset,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="tech-section-light"
      style={{
        padding: '130px 0',
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        position: 'relative',
      }}
      id="tech"
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <span className="section-tag light">03 // TOOLS & TECHNOLOGIES</span>
            <h2 className="section-title" style={{ color: '#0F172A' }}>TECH STACK</h2>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: '#64748B',
            }}
          >
            {String(portfolioData.techStack.length).padStart(2, '0')} CORE PROFICIENCIES
          </div>
        </div>

        {/* 21st Minimalist Bento Grid with 3D Tilt & Official Grayscale Logos */}
        <div className="tech-grid">
          {portfolioData.techStack.map((item, idx) => (
            <TechCard key={item.num} item={item} index={idx} />
          ))}
        </div>
      </div>

      <style>{`
        .tech-card-light {
          position: relative;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }
        .tech-card-light:hover {
          border-color: #CBD5E1;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }
        .tech-category-light {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          color: #64748B;
          background: #F1F5F9;
          padding: 4px 10px;
          border-radius: 6px;
        }
      `}</style>
    </section>
  );
};

export default TechStackSection;
