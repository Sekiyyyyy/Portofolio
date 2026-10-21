import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TechStackSection } from './components/TechStackSection';
import { DocumentedMoments } from './components/DocumentedMoments';
import { JourneySection } from './components/JourneySection';
import { ContributionSkyline } from './components/ContributionSkyline';
import { MusicSection } from './components/MusicSection';
import { Footer } from './components/Footer';
import { AuraCursor } from './components/AuraCursor';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Bind Lenis scroll to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  // Pause smooth scroll during preloader, enable and reset to top when loaded
  useEffect(() => {
    if (!isLoaded) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
      lenisRef.current?.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }
  }, [isLoaded]);

  // ──────────────────────────────────────────────────────────────────────────
  // SCROLL REVEAL SYSTEM: Register animations for every section after load
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    // Give DOM a tick to mount everything, then create scroll triggers
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // ── Generic Section Reveal: Every section fades in & slides up ──
        const sections = gsap.utils.toArray<HTMLElement>(
          '#about, #projects, #tech, #moments, #journey, #github, #music, #contact'
        );

        sections.forEach((section) => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              clearProps: 'transform',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // ── Section Tags: Slide in from left ──
        const tags = gsap.utils.toArray<HTMLElement>('.section-tag');
        tags.forEach((tag) => {
          gsap.fromTo(
            tag,
            { opacity: 0, x: -24 },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: 'power2.out',
              clearProps: 'transform',
              scrollTrigger: {
                trigger: tag,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        const titles = gsap.utils.toArray<HTMLElement>(
          '.section-title, .music-main-title, .gh-heading, .footer-heading'
        );
        titles.forEach((title) => {
          gsap.fromTo(
            title,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              clearProps: 'transform',
              scrollTrigger: {
                trigger: title,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // ── Parallax subtle float for decorative elements ──
        const floatElements = gsap.utils.toArray<HTMLElement>('.section-header-row');
        floatElements.forEach((el) => {
          gsap.fromTo(
            el,
            { y: 40 },
            {
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        });
      });

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoaded]);

  const handleNavigate = (targetId: string) => {
    if (targetId === '#home') {
      lenisRef.current?.scrollTo(0, { duration: 1.4 });
    } else {
      const el = document.querySelector(targetId);
      if (el) {
        lenisRef.current?.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 });
      }
    }
  };

  const handleScrollToTop = () => {
    lenisRef.current?.scrollTo(0, { duration: 1.6 });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#07090E] text-white">
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* CINEMATIC PRELOADER (Disappears after intro sequence)          */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {!isLoaded && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Ethereal Aura Fluid Cursor (Dynamic Spring Physics & Scroll Momentum) */}
      <AuraCursor />

      {/* Floating Glass Navbar */}
      <Navbar onNavigate={handleNavigate} />

      {/* Hero: Architectural Monolith & 3D Voxel Horizon */}
      <Hero />

      {/* 01 / ABOUT ME: Crisp Pure White Editorial with 3D Glass Sculpture */}
      <AboutSection />

      {/* 02 / SELECTED WORK: Sticky 3D Card Stacking + Genjutsu Shader */}
      <ProjectsSection />

      {/* 03 / TOOLS & TECHNOLOGIES: 3D Velocity Tilt & Spotlight Matrix */}
      <TechStackSection />

      {/* DOCUMENTED MOMENTS: 3D Curved Cylinder Reel */}
      <DocumentedMoments />

      {/* 04 / EXPERIENCE & EDUCATION: Engineering Journey & Milestones */}
      <JourneySection />

      {/* 05 / GITHUB ACTIVITY: 21st.dev Contribution Skyline 3D Isometric Heatmap */}
      <ContributionSkyline />

      {/* 06 / MUSIC: Favorite Songs with Spinning Vinyl Cards */}
      <MusicSection />

      {/* DONE . : Monumental Footer & Socials */}
      <Footer onScrollToTop={handleScrollToTop} />
    </div>
  );
}

export default App;
