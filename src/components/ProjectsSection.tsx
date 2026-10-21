import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';
import { ArrowUpRight } from 'lucide-react';
import { GlowCard } from '@/components/ui/spotlight-card';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  project: (typeof portfolioData.projects)[0];
  index: number;
  total: number;
}

const GLOW_COLORS: ('orange' | 'blue' | 'purple')[] = ['orange', 'blue', 'purple'];

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, total }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageHolderRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const currentGlow = GLOW_COLORS[index % GLOW_COLORS.length];

  // Cached geometry and RAF to eliminate layout thrashing
  const cardRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const imgRectRef = useRef<{ left: number; top: number } | null>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      cardRectRef.current = cardRef.current.getBoundingClientRect();
    }
    if (imageHolderRef.current) {
      imgRectRef.current = imageHolderRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafId.current !== null) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      const card = cardRef.current;
      if (!card) return;

      if (!cardRectRef.current) {
        cardRectRef.current = card.getBoundingClientRect();
      }
      const rect = cardRectRef.current;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Spotlight glow coordinates
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D Tilt calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      if (imageHolderRef.current) {
        imageHolderRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }

      // Floating cursor badge position
      if (badgeRef.current) {
        if (!imgRectRef.current && imageHolderRef.current) {
          imgRectRef.current = imageHolderRef.current.getBoundingClientRect();
        }
        if (imgRectRef.current) {
          const badgeX = clientX - imgRectRef.current.left;
          const badgeY = clientY - imgRectRef.current.top;
          badgeRef.current.style.transform = `translate3d(${badgeX}px, ${badgeY}px, 0) translate(-50%, -50%)`;
        }
      }
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    cardRectRef.current = null;
    imgRectRef.current = null;
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    const card = cardRef.current;
    if (card) {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    }
    if (imageHolderRef.current) {
      imageHolderRef.current.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: `${100 + index * 24}px`,
        zIndex: index + 1,
        marginBottom: index === total - 1 ? '40px' : '90px',
        transformOrigin: 'top center',
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
      className={`project-stack-card card-index-${index}`}
    >
      <GlowCard
        customSize
        glowColor={currentGlow}
        className="project-card spotlight-card w-full"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ width: '100%', position: 'relative' }}
        >
          <div className="project-grid relative z-[2]">
            {/* Project Image with 3D Perspective Tilt, Ambient Light Diffusion & Magnetic Floating Cursor */}
            <div className="tilt-card-wrapper">
              <div
                ref={imageHolderRef}
                className="project-image-holder tilt-card-inner genjutsu-container"
                style={{
                  borderRadius: '12px',
                  position: 'relative',
                  cursor: 'none',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Dashboard Image with calibrated contrast */}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className={isHovered ? 'genjutsu-chromatic' : ''}
                />

                {/* Subtle Clean Inner Rim */}
                <div className="absolute inset-0 pointer-events-none rounded-[12px] border border-white/10" />

                {/* Custom Magnetic Floating Cursor Badge */}
                <div
                  ref={badgeRef}
                  className={`magnetic-cursor-badge ${isHovered ? 'badge-visible' : ''}`}
                >
                  <span>EXPLORE ↗</span>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="project-info-holder">
              <div>
                <div className="project-num">// {project.number}</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-subtitle">{project.subtitle}</p>

                {/* Tech Stack Pills */}
                <div className="tech-pills">
                  {project.tech.map((t) => (
                    <span key={t} className="tech-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <a
                  href={project.link}
                  className="magnetic-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>VIEW ARCHITECTURE</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </GlowCard>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header text reveal on scroll
      gsap.fromTo(
        '.projects-title-word',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.projects-reveal-tag',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>('.project-stack-card');
      
      // Card stacking scrub: Previous card recedes smoothly as next card stacks on top
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];
          gsap.to(card, {
            scale: 0.95,
            opacity: 0.5,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: nextCard,
              start: 'top 80%',
              end: 'top 25%',
              scrub: true,
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="projects-section architectural-grid"
      id="projects"
      style={{ paddingBottom: '160px' }}
    >
      <div className="container">
        {/* Section Header with Scroll Text Reveal */}
        <div ref={headerRef} className="section-header-row mb-12">
          <div>
            <div className="overflow-hidden">
              <span className="section-tag dark projects-reveal-tag inline-block">02 // SELECTED WORK</span>
            </div>
            <h2 className="section-title overflow-hidden mt-2">
              <span className="inline-block projects-title-word">FEATURED</span>{' '}
              <span className="inline-block projects-title-word" style={{ color: '#D96B27' }}>ARCHITECTURE</span>
            </h2>
          </div>
          <div className="overflow-hidden">
            <div className="projects-reveal-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#71717A' }}>
              03 ARCHITECTURAL SYSTEMS
            </div>
          </div>
        </div>

        {/* Pinned Stacking Cards Container */}
        <div className="projects-stack-container">
          {portfolioData.projects.map((project, idx) => (
            <ProjectCard
              key={project.number}
              project={project}
              index={idx}
              total={portfolioData.projects.length}
            />
          ))}
        </div>
      </div>

      <style>{`
        .genjutsu-container {
          overflow: hidden;
        }
        .genjutsu-chromatic {
          filter: brightness(0.97) contrast(1.03);
          transition: filter 0.35s ease;
        }
        .magnetic-cursor-badge {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          background: rgba(13, 17, 26, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), 0 0 16px rgba(217, 107, 39, 0.35);
          color: #ffffff;
          padding: 7px 14px;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          white-space: nowrap;
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 0.25s ease, transform 0.15s ease-out;
          z-index: 30;
        }
        .badge-visible {
          opacity: 1 !important;
          transform: scale(1) translate(-50%, -50%);
        }
      `}</style>
    </section>
  );
};

export default ProjectsSection;
