import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Loader from '@/components/ui/3d-box-loader-animation';
import { portfolioData } from '../data/portfolioData';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock scroll during preloader
    document.body.style.overflow = 'hidden';

    // Timeline synchronized with the 3D Box Loader:
    // At t = 2.65s: Cubes plunge directly into the trapdoor.
    // Right as they enter and vanish (2.65s), trigger instant smooth fade-out with zero dead delay!
    const tl = gsap.timeline({
      delay: 2.65,
      onComplete: () => {
        document.body.style.overflow = '';
        onComplete();
      },
    });

    // Fade out header and footer
    tl.to(
      [headerRef.current, footerRef.current],
      {
        opacity: 0,
        y: (i) => (i === 0 ? -10 : 10),
        duration: 0.3,
        ease: 'power2.in',
      },
      0
    );

    // Fade out container seamlessly
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      0.08
    );

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  // Click anywhere to immediately skip preloader
  const handleSkip = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
        onComplete: () => {
          document.body.style.overflow = '';
          onComplete();
        },
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleSkip}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080808] cursor-pointer select-none overflow-hidden"
      aria-label="Click anywhere to skip"
    >
      {/* Subtle, refined ambient background vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
        }}
      />

      {/* TOP HEADER: Clean, understated typography with Geist font (No alay styling) */}
      <div
        ref={headerRef}
        className="absolute top-12 sm:top-16 left-0 right-0 flex flex-col items-center text-center pointer-events-none px-6 z-20"
      >
        <h1
          className="text-xs sm:text-sm font-medium tracking-[0.3em] text-zinc-300 uppercase"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          {portfolioData.brand.first} {portfolioData.brand.second}
        </h1>
        <p
          className="text-[10px] sm:text-[11px] font-normal tracking-[0.2em] text-zinc-500 uppercase mt-1.5"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          Software Engineer
        </p>
      </div>

      {/* CENTER: 3D Box Loader in Clean Titanium & Silver Monochrome Palette */}
      <div className="relative z-10 flex items-center justify-center pointer-events-none">
        <Loader
          primaryColor="#E2E8F0"
          primaryLight="#94A3B8"
          primaryRgba="rgba(226, 232, 240, 0)"
          bgColor="#080808"
          loop={false}
        />
      </div>

      {/* BOTTOM FOOTER: Minimalist subtle hint */}
      <div
        ref={footerRef}
        className="absolute bottom-10 sm:bottom-12 left-0 right-0 flex flex-col items-center text-center pointer-events-none px-6 z-20"
      >
        <span
          className="text-[10px] sm:text-[11px] font-normal tracking-[0.2em] text-zinc-600 uppercase"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          Click anywhere to skip
        </span>
      </div>
    </div>
  );
};

export default Preloader;
