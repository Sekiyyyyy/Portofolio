import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  project: (typeof portfolioData.projects)[0];
  index: number;
  total: number;
}

const PROJECT_SPECS: Record<
  string,
  { domain: string; arch: string; metric: string; role: string }
> = {
  '01': {
    domain: 'cbt.smkn1beringin.sch.id',
    arch: 'High-Concurrency Engine',
    metric: '1,400+ Active Students',
    role: 'School Digitalization',
  },
  '02': {
    domain: 'sidata.smkn1beringin.sch.id',
    arch: 'Academic Data Architecture',
    metric: 'Multi-Role RBAC & Audit',
    role: 'Centralized Portal',
  },
  '03': {
    domain: 'ejurnal.smkn1beringin.sch.id',
    arch: 'Vocational Activity Ledger',
    metric: 'Digital Proof Verification',
    role: 'Classroom Workflow',
  },
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, total }) => {
  const spec = PROJECT_SPECS[project.number] || {
    domain: 'system.smkn1beringin.sch.id',
    arch: 'Full Stack Architecture',
    metric: 'Production System',
    role: 'Web Application',
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: `${96 + index * 26}px`,
        zIndex: index + 1,
        marginBottom: index === total - 1 ? '40px' : '85px',
      }}
      className={`project-stack-card card-index-${index}`}
    >
      <div className="project-card w-full">
        <div className="project-grid">
          {/* Left Column: Project Architectural Info */}
          <div className="project-info-holder">
            <div>
              <div className="project-meta-row">
                <span className="project-num">SYS // {project.number}</span>
                <span className="project-role-badge">{spec.role}</span>
              </div>

              <h3 className="project-title">{project.title}</h3>
              <p className="project-subtitle">{project.subtitle}</p>

              {/* Architectural Technical Specs */}
              <div className="arch-specs-grid">
                <div className="arch-spec-item">
                  <span className="spec-label">ARCHITECTURE</span>
                  <span className="spec-value">{spec.arch}</span>
                </div>
                <div className="arch-spec-item">
                  <span className="spec-label">CAPACITY & SCOPE</span>
                  <span className="spec-value">{spec.metric}</span>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="tech-pills">
                {project.tech.map((t) => (
                  <span key={t} className="tech-pill">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="project-action-row">
              <a
                href={project.link}
                className="workstation-action-btn"
                target="_blank"
                rel="noreferrer"
              >
                <span>VIEW ARCHITECTURE</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          {/* Right Column: Workstation Browser Mockup Frame (Frames the bright photo) */}
          <div className="workstation-wrapper">
            <div className="workstation-window">
              {/* Window Header */}
              <div className="workstation-header">
                <div className="traffic-lights">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="workstation-address-bar">
                  <span className="lock-icon">🔒</span>
                  <span className="address-text">{spec.domain}</span>
                </div>
                <div className="workstation-status">
                  <span className="live-dot" />
                  <span className="status-text">ONLINE</span>
                </div>
              </div>

              {/* Image Preview with calibrated brightness */}
              <div className="workstation-screen">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="workstation-img"
                />
                <div className="workstation-overlay" />
              </div>
            </div>
          </div>
        </div>
      </div>
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
              <span className="section-tag dark projects-reveal-tag inline-block">
                02 // SELECTED WORK
              </span>
            </div>
            <h2 className="section-title overflow-hidden mt-2">
              <span className="inline-block projects-title-word">FEATURED</span>{' '}
              <span
                className="inline-block projects-title-word"
                style={{ color: '#D96B27' }}
              >
                ARCHITECTURE
              </span>
            </h2>
          </div>
          <div className="overflow-hidden">
            <div
              className="projects-reveal-tag"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: '#71717A',
              }}
            >
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
    </section>
  );
};

export default ProjectsSection;
