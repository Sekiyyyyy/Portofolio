import React, { useEffect, useRef } from 'react';
import { portfolioData } from '../data/portfolioData';
import OrbitingCirclesGlobe from '@/components/ui/orbiting-circles-02';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);

  // Parallax Layer Refs (Pure 2.5D Layer Engine)
  const layerDeepRef = useRef<HTMLDivElement>(null);    // Layer 1: Stars, Aurora & Blueprint Grid
  const layerBackRef = useRef<HTMLDivElement>(null);    // Layer 2: Distant Topographic Horizon Ridge
  const layerTextRef = useRef<HTMLDivElement>(null);    // Layer 3: Left-Aligned Typography Stage
  const layerFrontRef = useRef<HTMLDivElement>(null);   // Layer 4: Foreground Sweeping Silhouette
  const layerMotesRef = useRef<HTMLDivElement>(null);   // Layer 5: Ambient Floating Motes

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      mouseY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const { innerWidth, innerHeight } = window;
        mouseX = ((touch.clientX - innerWidth / 2) / (innerWidth / 2)) * 0.6;
        mouseY = ((touch.clientY - innerHeight / 2) / (innerHeight / 2)) * 0.6;
      }
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
    };

    const render = () => {
      // Silky inertia spring lerp
      curX += (mouseX - curX) * 0.065;
      curY += (mouseY - curY) * 0.065;

      // Layer 1: Deep Cosmos & Blueprint Grid (16px)
      if (layerDeepRef.current) {
        layerDeepRef.current.style.transform = `translate3d(${-curX * 16}px, ${-curY * 10}px, 0)`;
      }

      // Layer 2: Distant Topographic Horizon Ridge (32px)
      if (layerBackRef.current) {
        layerBackRef.current.style.transform = `translate3d(${-curX * 32}px, ${-curY * 18}px, 0)`;
      }

      // Layer 3: Central Left-Aligned Typography Stage (50px - The Focal Plane)
      if (layerTextRef.current) {
        layerTextRef.current.style.transform = `translate3d(${-curX * 50}px, ${-curY * 26}px, 0)`;
      }

      // Layer 4: Foreground Sweeping Silhouette (76px - Passes in front with depth)
      if (layerFrontRef.current) {
        layerFrontRef.current.style.transform = `translate3d(${-curX * 76}px, ${-curY * 38}px, 0)`;
      }

      // Layer 5: Extreme Foreground Ambient Motes (110px)
      if (layerMotesRef.current) {
        layerMotesRef.current.style.transform = `translate3d(${-curX * 110}px, ${-curY * 55}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Marquee Continuous Loop
  useEffect(() => {
    let xPos = 0;
    let animationId: number;
    const speed = 1.0;

    const marqueeLoop = () => {
      xPos -= speed;
      if (marqueeInnerRef.current) {
        const halfWidth = marqueeInnerRef.current.scrollWidth / 2;
        if (Math.abs(xPos) >= halfWidth) {
          xPos = 0;
        }
        marqueeInnerRef.current.style.transform = `translateX(${xPos}px)`;
      }
      animationId = requestAnimationFrame(marqueeLoop);
    };

    animationId = requestAnimationFrame(marqueeLoop);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-viewport relative w-full h-screen overflow-hidden bg-[#07090E] select-none flex flex-col justify-between"
      id="home"
    >
      {/* 2.5D Full-Width Parallax Depth Stage */}
      <div className="hero-stage relative w-full flex-1 flex items-center overflow-hidden">
        
        {/* ============================================================ */}
        {/* LAYER 1: Deep Cosmos, Blueprint Grid & Aurora Glow (zIndex 1) */}
        {/* ============================================================ */}
        <div ref={layerDeepRef} className="parallax-layer layer-deep pointer-events-none">
          <div className="blueprint-matrix" />
          <div className="ambient-aurora-glow" />
          <div className="deep-laser-horizon" />
        </div>

        {/* ============================================================ */}
        {/* LAYER 2: Distant Digital Topographic Ridge (zIndex 5)         */}
        {/* (Smooth architectural contour rolling behind the typography) */}
        {/* ============================================================ */}
        <div ref={layerBackRef} className="parallax-layer layer-back-ridge pointer-events-none">
          <svg
            className="w-full h-[320px] absolute bottom-12 left-0"
            viewBox="0 0 1440 320"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-40,190 C220,100 480,240 760,160 C1040,80 1260,200 1480,140 L1480,340 L-40,340 Z"
              fill="url(#backRidgeGrad)"
            />
            <path
              d="M-40,190 C220,100 480,240 760,160 C1040,80 1260,200 1480,140"
              stroke="rgba(217, 107, 39, 0.22)"
              strokeWidth="1.5"
            />
            <defs>
              <linearGradient id="backRidgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0C121F" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#07090E" stopOpacity="0.95" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ============================================================ */}
        {/* LAYER 3: The Left-Aligned Typography Stage (zIndex 15)       */}
        {/* (Sandwiched cleanly in depth, perfectly proportioned)        */}
        {/* ============================================================ */}
        <div ref={layerTextRef} className="parallax-layer layer-typography pointer-events-auto flex items-center">
          <div className="container mx-auto px-6 lg:px-16 w-full pt-16 lg:pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[500px]">

              {/* Left Column: Monumental Typography */}
              <div className="lg:col-span-7 flex flex-col items-start text-left z-20">
                {/* Monumental Name Title (Cleanly Scaled, Never Cuts Off) */}
                <h1 className="hero-name-heading">
                  <span className="name-silver">{portfolioData.hero.firstName}</span>
                  <br />
                  <span className="name-copper">{portfolioData.hero.lastName}</span>
                </h1>

                {/* Role Line: Confident & Prominent Directly Beneath Name */}
                <div className="hero-role-row">
                  <span className="role-prefix">//</span>
                  <span className="role-text">FULL STACK DEVELOPER</span>
                </div>

                {/* Tagline: 1 Clean, Focused Sentence */}
                <p className="hero-tagline-para">
                  Crafting scalable full-stack web applications, school digitalization platforms, and interactive digital experiences.
                </p>

                {/* Action Buttons */}
                <div className="hero-cta-wrap">
                  <a href="#projects" className="hero-primary-btn">
                    <span>View Projects</span>
                    <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-y-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3.5V12.5M8 12.5L12 8.5M8 12.5L4 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a href="#about" className="hero-secondary-btn">
                    <span>About Me</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Orbiting Circles 3D Particle Globe Centerpiece */}
              <div className="lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end z-10 pointer-events-auto">
                <div className="w-full max-w-[420px] sm:max-w-[440px] relative flex items-center justify-center">
                  <OrbitingCirclesGlobe centered={true} className="w-full" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* LAYER 4: Foreground Sweeping Silhouette (zIndex 25)          */}
        {/* (Rises gracefully from bottom-right, framing the scene)      */}
        {/* ============================================================ */}
        <div ref={layerFrontRef} className="parallax-layer layer-front-ridge pointer-events-none">
          <svg
            className="w-full h-[240px] absolute bottom-0 left-0"
            viewBox="0 0 1440 240"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-40,160 C320,230 650,130 980,180 C1220,210 1380,130 1480,160 L1480,260 L-40,260 Z"
              fill="url(#frontRidgeGrad)"
            />
            <path
              d="M-40,160 C320,230 650,130 980,180 C1220,210 1380,130 1480,160"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.2"
            />
            <defs>
              <linearGradient id="frontRidgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#080C14" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#07090E" stopOpacity="0.98" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ============================================================ */}
        {/* LAYER 5: Foreground Ambient Luminous Motes (zIndex 35)       */}
        {/* ============================================================ */}
        <div ref={layerMotesRef} className="parallax-layer layer-motes pointer-events-none">
          <span className="mote mote-a" />
          <span className="mote mote-b" />
          <span className="mote mote-c" />
        </div>

      </div>

      {/* ============================================================== */}
      {/* BASE MARQUEE TICKER (Single Source for Tech Keywords with Logos) */}
      {/* ============================================================== */}
      <div className="relative z-40 w-full">
        <div className="marquee-strip">
          <div ref={marqueeInnerRef} className="marquee-content">
            {[...portfolioData.hero.marquee, ...portfolioData.hero.marquee].map((item, i) => (
              <div key={`${item}-${i}`} className="marquee-token">
                <span className="token-dot" />
                <span className="token-text">{item}</span>
                <span className="token-sep">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component Styles */}
      <style>{`
        .hero-viewport {
          background-color: #07090E;
        }

        .hero-stage {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .parallax-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          will-change: transform;
        }

        /* Layer 1: Cosmos Deep */
        .layer-deep {
          z-index: 1;
        }

        .blueprint-matrix {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .ambient-aurora-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 65% 55% at 65% 45%, rgba(217, 107, 39, 0.15) 0%, transparent 65%),
            radial-gradient(circle 35% at 80% 30%, rgba(56, 189, 248, 0.06) 0%, transparent 60%);
        }

        .deep-laser-horizon {
          position: absolute;
          top: 55%;
          left: 5%;
          right: 5%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(217, 107, 39, 0.2) 30%, rgba(255, 255, 255, 0.1) 50%, rgba(56, 189, 248, 0.15) 70%, transparent);
          opacity: 0.6;
        }

        /* Layer 2: Back Ridge */
        .layer-back-ridge {
          z-index: 5;
        }

        /* Layer 3: Typography Stage (Left-Aligned) */
        .layer-typography {
          z-index: 15;
        }

        .hero-name-heading {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: clamp(2.6rem, 5.8vw, 4.4rem);
          font-weight: 800;
          line-height: 0.98;
          letter-spacing: -0.035em;
          margin: 0 0 16px 0;
          text-shadow: 0 12px 40px rgba(0, 0, 0, 0.95);
        }

        .name-silver {
          color: #FFFFFF;
        }

        .name-copper {
          background: linear-gradient(135deg, #FFFFFF 10%, #FFB07D 55%, #D96B27 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-role-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .role-prefix {
          font-family: var(--font-mono, monospace);
          font-size: 0.95rem;
          font-weight: 700;
          color: #D96B27;
        }

        .role-text {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: clamp(1.05rem, 1.8vw, 1.35rem);
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #D96B27;
          text-shadow: 0 2px 20px rgba(217, 107, 39, 0.35);
        }

        .hero-tagline-para {
          font-family: var(--font-body, sans-serif);
          font-size: clamp(0.96rem, 1.2vw, 1.12rem);
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.75);
          max-width: 520px;
          margin: 0 0 28px 0;
          text-wrap: pretty;
        }

        .hero-cta-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .hero-primary-btn {
          display: inline-flex;
          align-items: center;
          background: #D96B27;
          color: #FFFFFF;
          font-family: var(--font-display, sans-serif);
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 11px 24px;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 4px 22px rgba(217, 107, 39, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25);
          transition: all 0.25s ease;
        }
        .hero-primary-btn:hover {
          background: #E87A36;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(217, 107, 39, 0.55);
        }

        .hero-secondary-btn {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.85);
          font-family: var(--font-display, sans-serif);
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 11px 22px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          text-decoration: none;
          backdrop-filter: blur(10px);
          transition: all 0.25s ease;
        }
        .hero-secondary-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          transform: translateY(-2px);
        }

        /* Layer 4: Front Ridge */
        .layer-front-ridge {
          z-index: 25;
        }

        /* Layer 5: Motes */
        .layer-motes {
          z-index: 35;
        }

        .mote {
          position: absolute;
          border-radius: 50%;
          background-color: #D96B27;
          box-shadow: 0 0 10px rgba(217, 107, 39, 0.8);
          opacity: 0.65;
        }
        .mote-a { width: 3.5px; height: 3.5px; top: 38%; right: 28%; }
        .mote-b { width: 4.5px; height: 4.5px; top: 62%; right: 18%; background-color: #FFA873; }
        .mote-c { width: 3px; height: 3px; top: 74%; left: 42%; }

        /* Marquee Ticker */
        .marquee-strip {
          position: relative;
          background: rgba(7, 9, 14, 0.92);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 12px 0;
          overflow: hidden;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .marquee-content {
          display: flex;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
        }

        .marquee-token {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 20px;
          font-family: var(--font-display, sans-serif);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
        }

        .token-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #D96B27;
          box-shadow: 0 0 8px rgba(217, 107, 39, 0.9);
          display: inline-block;
          flex-shrink: 0;
        }

        .token-text {
          transition: color 0.2s ease;
        }
        .marquee-token:hover .token-text {
          color: #FFFFFF;
        }

        .token-sep {
          font-size: 0.55rem;
          color: #D96B27;
          opacity: 0.6;
          margin-left: 10px;
        }
      `}</style>
    </section>
  );
};

export default Hero;
