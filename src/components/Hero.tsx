import React, { useEffect, useRef } from 'react';
import { portfolioData } from '../data/portfolioData';
import OrbitingCirclesGlobe from '@/components/ui/orbiting-circles-02';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Wave Divider Refs
  const waveWrapperRef = useRef<HTMLDivElement>(null);
  const waveBackRef = useRef<SVGGElement>(null);
  const waveMidRef = useRef<SVGGElement>(null);
  const waveFrontRef = useRef<SVGGElement>(null);

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

  // ScrollTrigger Parallax for Wave Transition
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!waveBackRef.current || !waveMidRef.current) return;

      // Deep back wave shifts left & rises
      gsap.to(waveBackRef.current, {
        x: -60,
        y: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // Mid wave counter-shifts right & rises
      gsap.to(waveMidRef.current, {
        x: 60,
        y: -16,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Front wave drifts horizontally only — zero vertical lift to keep the white foundation 100% solid and flush
      if (waveFrontRef.current) {
        gsap.to(waveFrontRef.current, {
          x: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-viewport relative w-full select-none flex flex-col justify-between"
      id="home"
    >
      {/* 2.5D Full-Width Parallax Depth Stage (True 100vh Full Screen Experience) */}
      <div className="hero-stage relative w-full flex items-center overflow-hidden">
        
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
              <div className="lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end z-10 pointer-events-auto -translate-y-2 lg:-translate-y-6">
                <div className="w-full max-w-[400px] sm:max-w-[420px] relative flex items-center justify-center">
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
      {/* FLUID MULTI-LAYER PARALLAX WAVE DIVIDER (Hero -> About Seam)  */}
      {/* ============================================================== */}
      <div ref={waveWrapperRef} className="hero-wave-divider">
        <svg
          className="hero-wave-svg"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wave Layer 1: Back Deep Translucent Wave */}
          <g ref={waveBackRef}>
            <path
              className="wave-path-back"
              d="M-80,48 C140,98 320,15 540,55 C760,95 940,20 1160,65 C1360,105 1460,35 1560,50 L1560,180 L-80,180 Z"
              fill="rgba(255, 255, 255, 0.18)"
            />
          </g>

          {/* Wave Layer 2: Mid Translucent Wave */}
          <g ref={waveMidRef}>
            <path
              className="wave-path-mid"
              d="M-80,75 C120,25 340,90 560,40 C780,-10 980,85 1200,35 C1380,-5 1480,65 1560,60 L1560,180 L-80,180 Z"
              fill="rgba(255, 255, 255, 0.42)"
            />
          </g>

          {/* Wave Layer 3: Solid Foreground Wave connecting flush to #FFFFFF About Section */}
          <g ref={waveFrontRef}>
            <path
              className="wave-path-front"
              d="M-80,65 C160,105 380,45 600,85 C820,125 1020,45 1240,75 C1420,100 1500,60 1560,65 L1560,260 L-80,260 Z"
              fill="#FFFFFF"
            />
          </g>
        </svg>
      </div>

      {/* Component Styles */}
      <style>{`
        .hero-viewport {
          background-color: #07090E;
          min-height: 100vh;
          min-height: 100dvh;
          position: relative;
        }

        .hero-stage {
          position: relative;
          width: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
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
          font-size: clamp(1.85rem, 3.8vw, 3.1rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.025em;
          margin: 0 0 14px 0;
          text-shadow: 0 10px 30px rgba(0, 0, 0, 0.9);
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
          margin-bottom: 16px;
        }

        .role-prefix {
          font-family: var(--font-mono, monospace);
          font-size: 0.9rem;
          font-weight: 700;
          color: #D96B27;
        }

        .role-text {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: clamp(0.95rem, 1.4vw, 1.15rem);
          font-weight: 700;
          letter-spacing: 0.16em;
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

        /* Wave Transition Divider (Parallax + Ambient Float) */
        .hero-wave-divider {
          position: relative;
          width: 100%;
          height: clamp(65px, 8.5vw, 110px);
          overflow: hidden;
          line-height: 0;
          z-index: 30;
          pointer-events: none;
          margin-top: -30px;
          margin-bottom: -2px;
          transform: translateZ(0);
        }

        .hero-wave-svg {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: calc(100% + 2px);
          display: block;
        }

        @keyframes waveFloatA {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        @keyframes waveFloatB {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(4px); }
        }

        .wave-path-back {
          animation: waveFloatA 8s ease-in-out infinite;
        }

        .wave-path-mid {
          animation: waveFloatB 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
