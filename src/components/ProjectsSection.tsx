import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';
import { Lock, ExternalLink, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  project: (typeof portfolioData.projects)[0];
  index: number;
  total: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, total }) => {
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
          {/* Left Column: Project Info */}
          <div className="project-info-holder">
            <div>
              <div className="project-meta-row">
                <span className="project-num">PROJECT // 0{index + 1}</span>
                <span className="project-domain-tag">
                  <Globe size={11} className="inline mr-1 text-[#D96B27]" />
                  {project.domain}
                </span>
              </div>

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

            <div className="project-action-row">
              <a
                href={project.link}
                className="project-action-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Buka Aplikasi</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Right Column: Clean Browser Mockup Frame */}
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
                  <Lock size={11} className="text-emerald-400 shrink-0" />
                  <span className="address-text">{project.domain}</span>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="address-link-icon"
                    title={`Kunjungi ${project.domain}`}
                  >
                    <ExternalLink size={11} />
                  </a>
                </div>

                <div className="domain-status-badge">
                  <span className="status-dot" />
                  <span>Live</span>
                </div>
              </div>

              {/* Image Preview with clean framing */}
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
                02 // PORTFOLIO
              </span>
            </div>
            <h2 className="section-title overflow-hidden mt-2">
              <span className="inline-block projects-title-word">FEATURED</span>{' '}
              <span
                className="inline-block projects-title-word"
                style={{ color: '#D96B27' }}
              >
                PROJECTS
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
              03 WEB APPLICATIONS
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
