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
      // Watermark subtle parallax drift
      gsap.to(watermarkRef.current, {
        y: -60,
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

      // Progressive Scroll-Scrub Word Reveal (Apple / Awwwards Editorial Effect)
      gsap.fromTo(
        '.about-scrub-word',
        {
          color: 'rgba(15, 23, 42, 0.18)',
        },
        {
          color: '#0F172A',
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-body-text-block',
            start: 'top 75%',
            end: 'bottom 50%',
            scrub: 0.8,
          },
        }
      );

      // Highlighter pen sweep on scroll
      ScrollTrigger.create({
        trigger: '.highlighter-pen',
        start: 'top 68%',
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

  const bioPart1 = `Hello, I am ${portfolioData.about.nameHighlight} (a.k.a ${portfolioData.about.aliasHighlight}). ${portfolioData.about.bioPart1}`;
  const bioPart2 = portfolioData.about.bioPart2;

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

          {/* Clean Editorial Story Layout with Word-by-Word Scroll Reveal */}
          <div className="about-text-column about-body-text-block max-w-[840px]">
            <p className="about-body-text text-[clamp(1.18rem,1.85vw,1.48rem)] font-medium leading-[1.7] text-[#0F172A]">
              <span className="about-scrub-word">Hello, </span>
              <span className="about-scrub-word">I </span>
              <span className="about-scrub-word">am </span>
              <span className="about-scrub-word">
                <span className="highlighter-pen">{portfolioData.about.nameHighlight}</span>{' '}
              </span>
              <span className="about-scrub-word">(a.k.a </span>
              <span className="about-scrub-word">{portfolioData.about.aliasHighlight}). </span>
              {portfolioData.about.bioPart1.split(' ').map((word, i) => (
                <span key={i} className="about-scrub-word">
                  {word}{' '}
                </span>
              ))}
            </p>

            <p className="about-body-text text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.75] mt-6">
              {portfolioData.about.bioPart2.split(' ').map((word, i) => (
                <span key={i} className="about-scrub-word">
                  {word}{' '}
                </span>
              ))}
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
          padding: 130px 0;
          overflow: hidden;
        }
        .about-watermark {
          position: absolute;
          top: 8%;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-display);
          font-size: clamp(6rem, 18vw, 16rem);
          font-weight: 800;
          color: rgba(0, 0, 0, 0.03);
          letter-spacing: 0.05em;
          pointer-events: none;
          white-space: nowrap;
          z-index: 1;
        }
        .about-heading {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 5.5vw, 4.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: #0F172A;
          margin: 0;
        }
        .about-body-text {
          font-family: var(--font-body);
        }
        .about-scrub-word {
          display: inline;
          transition: color 0.15s ease;
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
