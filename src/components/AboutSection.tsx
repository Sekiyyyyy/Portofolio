import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Watermark subtle vertical parallax drift (Centered via CSS text-align: center)
      gsap.to(watermarkRef.current, {
        y: -36,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Heading slide-up reveal
      gsap.fromTo(
        '.about-heading-word',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Top Tag reveal
      gsap.fromTo(
        '.about-tag-reveal',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Editorial Story Entrance Animation (Clean, crisp, immediate 100% readability)
      gsap.fromTo(
        '.about-story-para',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.18,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Highlighter pen sweep on scroll
      ScrollTrigger.create({
        trigger: '.highlighter-pen',
        start: 'top 75%',
        onEnter: () => {
          document.querySelector('.highlighter-pen')?.classList.add('active');
        },
        onLeaveBack: () => {
          document.querySelector('.highlighter-pen')?.classList.remove('active');
        },
      });

      // Philosophy pill reveal
      gsap.fromTo(
        '.about-pill-reveal',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-pill-reveal',
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="about-section" id="about">
      {/* Giant Faint Watermark Text */}
      <div ref={watermarkRef} className="about-watermark">
        {portfolioData.about.watermark}
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div ref={contentRef} className="about-editorial-wrap">
          {/* Top Tag & Header */}
          <div style={{ marginBottom: '36px' }}>
            <div className="about-tag-reveal">
              <span className="section-tag light">01 // ABOUT ME</span>
            </div>
            <h2 className="about-heading overflow-hidden" style={{ marginTop: '14px' }}>
              <span className="inline-block about-heading-word">PASSIONATE</span>{' '}
              <span className="inline-block about-heading-word" style={{ color: '#D96B27' }}>DEVELOPER</span>
            </h2>
          </div>

          {/* Clean Editorial Story Layout with Smooth Entrance Animation */}
          <div className="about-text-column about-body-text-block max-w-[840px]">
            <p className="about-story-para text-[clamp(1.15rem,1.75vw,1.42rem)] font-medium leading-[1.7] text-[#0F172A]">
              Hello, I am{' '}
              <span className="highlighter-pen font-bold text-[#0F172A]">{portfolioData.about.nameHighlight}</span>{' '}
              <span className="text-[#64748B] font-normal">(a.k.a {portfolioData.about.aliasHighlight})</span>. {portfolioData.about.bioPart1}
            </p>

            <p className="about-story-para text-[clamp(0.98rem,1.35vw,1.16rem)] leading-[1.8] mt-6 text-[#334155]">
              {portfolioData.about.bioPart2}
            </p>

            {/* Core Philosophy Tag */}
            <div
              className="about-pill-reveal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '40px',
                padding: '12px 24px',
                borderRadius: '9999px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: '#1E293B',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D96B27' }} />
              <span>CLEAN CODE • FLUID INTERACTION • MODERN WEB ARCHITECTURE</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about-section {
          position: relative;
          background-color: #FFFFFF;
          color: #0A0A0A;
          padding: 120px 0 130px 0;
          overflow: hidden;
          margin-top: -2px;
        }
        .about-watermark {
          position: absolute;
          top: 35px;
          left: 0;
          right: 0;
          width: 100%;
          text-align: center;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: clamp(1.8rem, 5vw, 3.8rem);
          font-weight: 800;
          color: rgba(0, 0, 0, 0.035);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          pointer-events: none;
          white-space: nowrap;
          user-select: none;
          z-index: 1;
        }
        .about-heading {
          font-family: var(--font-display);
          font-size: clamp(1.85rem, 3.4vw, 2.65rem);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: #0F172A;
          margin: 0;
        }
        .about-story-para {
          font-family: var(--font-body);
        }
        .highlighter-pen {
          position: relative;
          display: inline-block;
          padding: 0 4px;
          border-radius: 4px;
          color: #0F172A;
        }
        .highlighter-pen::before {
          content: '';
          position: absolute;
          inset: 2px -2px 2px -2px;
          background-color: #FEF08A;
          z-index: -1;
          border-radius: 4px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .highlighter-pen.active::before {
          transform: scaleX(1);
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
