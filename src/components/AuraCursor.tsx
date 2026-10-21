import { useEffect, useRef, useState } from 'react';

/**
 * AuraCursor — Award-Winning Magnetic Fluid Glass Cursor
 * 
 * Features:
 * - Dynamic Light/Dark Section Adaptation:
 *   - Dark Sections: Radiant white micro-dot with luminous frosted ring & amber halo.
 *   - Light Sections: Sharp obsidian-slate micro-dot with high-contrast ring & paper vignette.
 *   - Butter-smooth 300ms color morphing between dark and light sections.
 * - Ambient Flashlight Aura: 260px celestial light cone that adapts blending mode (screen on dark, multiply on light).
 * - Precision Micro-Pointer: Razor-sharp 5px pointer with zero latency.
 * - Liquid Magnetic Follower: Frosted glass lens with spring physics & kinetic stretch.
 * - Contextual Morphing: "▶ PLAY" badge on music, "VIEW ↗" on projects, magnetic snap on buttons.
 * - Non-Intrusive: 100% pointer-events: none, native click/scroll/hover works instantly.
 */
export const AuraCursor = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const followerRef = useRef<HTMLDivElement | null>(null);
  const ambientAuraRef = useRef<HTMLDivElement | null>(null);
  const rippleContainerRef = useRef<HTMLDivElement | null>(null);

  const [cursorText, setCursorText] = useState<string>('');
  const [hoverType, setHoverType] = useState<'default' | 'button' | 'music' | 'project'>('default');
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const isLightModeRef = useRef<boolean>(false);

  // Position, Physics & Motion State
  const mouse = useRef({ x: -200, y: -200 });
  const followerPos = useRef({ x: -200, y: -200 });
  const auraPos = useRef({ x: -200, y: -200 });
  const velocity = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: -200, y: -200 });
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);
  const isVisible = useRef(false);

  useEffect(() => {
    let animId: number;
    let scrollTimeout: number;

    // Helper to evaluate if the cursor is currently over a light background section
    const updateSectionTheme = (targetElem: HTMLElement | null) => {
      if (!targetElem) return;
      // Light sections: About, Tech Stack, Journey, Music
      // (Unless hovering an explicitly dark sub-card like the vinyl player)
      const inLightSection = Boolean(
        targetElem.closest('#about, #tech, #journey, #music, [data-theme="light"], .light-section') &&
        !targetElem.closest('.vinyl-player-card, [data-theme="dark"]')
      );

      if (isLightModeRef.current !== inLightSection) {
        isLightModeRef.current = inLightSection;
        setIsLightMode(inLightSection);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (followerRef.current) followerRef.current.style.opacity = '1';
        if (ambientAuraRef.current) ambientAuraRef.current.style.opacity = '0.7';
      }

      // Micro-dot follows cursor coordinates immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Detect interactive target and set contextual mode
      const target = e.target as HTMLElement | null;
      if (target) {
        updateSectionTheme(target);

        // Exclude the left vinyl player console card from PLAY text
        const isLeftPlayerConsole = target.closest('.vinyl-player-card');
        const playlistItemTarget = !isLeftPlayerConsole && target.closest('.playlist-item-row, [data-cursor="play"]');

        const projectTarget = target.closest(
          '.project-card-interactive, .moment-card, .project-bento-card, [data-cursor="view"]'
        );
        const buttonTarget = target.closest(
          'a, button, input, textarea, select, [role="button"], .magnetic-btn, .skyline-metric-pill, .stat-item, .tech-card, .player-tool-btn, .player-nav-btn, .player-main-play-btn'
        );

        if (playlistItemTarget) {
          setHoverType('music');
          setCursorText('▶ PLAY');
        } else if (projectTarget) {
          setHoverType('project');
          setCursorText('VIEW ↗');
        } else if (buttonTarget) {
          setHoverType('button');
          setCursorText('');
        } else {
          setHoverType('default');
          setCursorText('');
        }
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (followerRef.current) followerRef.current.style.opacity = '0';
      if (ambientAuraRef.current) ambientAuraRef.current.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible.current = true;
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (followerRef.current) followerRef.current.style.opacity = '1';
      if (ambientAuraRef.current) ambientAuraRef.current.style.opacity = '0.7';
    };

    // Track scroll velocity & dynamically update theme when user scrolls with stationary cursor
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      scrollVelocity.current = Math.max(-60, Math.min(60, delta * 1.5));
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        scrollVelocity.current = 0;
      }, 70);

      // Check element under current mouse position during scroll
      if (isVisible.current && mouse.current.x >= 0 && mouse.current.y >= 0) {
        const elemUnderCursor = document.elementFromPoint(
          mouse.current.x,
          mouse.current.y
        ) as HTMLElement | null;
        updateSectionTheme(elemUnderCursor);
      }
    };

    const onWheel = (e: WheelEvent) => {
      scrollVelocity.current = Math.max(-60, Math.min(60, e.deltaY * 0.8));
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        scrollVelocity.current = 0;
      }, 70);
    };

    // Click Shockwave Ripple
    const onMouseDown = (e: MouseEvent) => {
      if (!rippleContainerRef.current) return;
      const ripple = document.createElement('div');
      ripple.className = `cursor-click-shockwave ${isLightModeRef.current ? 'shockwave-light' : 'shockwave-dark'}`;
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      rippleContainerRef.current.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    // 120 FPS Fluid Kinematics Loop
    const renderLoop = () => {
      // Calculate mouse velocity
      const vx = mouse.current.x - prevMouse.current.x;
      const vy = mouse.current.y - prevMouse.current.y;
      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;

      velocity.current.x += (vx - velocity.current.x) * 0.3;
      velocity.current.y += (vy - velocity.current.y) * 0.3;
      scrollVelocity.current *= 0.85;

      // Spring physics for Liquid Follower (smooth lerp 0.22)
      followerPos.current.x += (mouse.current.x - followerPos.current.x) * 0.22;
      followerPos.current.y += (mouse.current.y - followerPos.current.y) * 0.22;

      // Ambient Aura (luxurious slow trailing lerp 0.08)
      auraPos.current.x += (mouse.current.x - auraPos.current.x) * 0.08;
      auraPos.current.y += (mouse.current.y - auraPos.current.y) * 0.08;

      // Calculate speed and angle of travel including scroll inertia
      const effectiveVy = velocity.current.y + scrollVelocity.current * 0.4;
      const speed = Math.hypot(velocity.current.x, effectiveVy);
      const angle = Math.atan2(effectiveVy, velocity.current.x);

      // Kinetic deformation factor
      const stretch = Math.min(1.7, 1 + speed * 0.022);
      const squish = 1 / Math.sqrt(stretch);

      // 1. Update Ambient Flashlight Aura
      if (ambientAuraRef.current) {
        ambientAuraRef.current.style.transform = `translate3d(${auraPos.current.x}px, ${auraPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // 2. Update Liquid Follower
      if (followerRef.current) {
        if (hoverType === 'music' || hoverType === 'project') {
          followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%) scale(1)`;
        } else {
          followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${stretch}, ${squish})`;
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('mouseenter', onMouseEnter, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('mousedown', onMouseDown);

    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousedown', onMouseDown);
      clearTimeout(scrollTimeout);
      cancelAnimationFrame(animId);
    };
  }, [hoverType]);

  return (
    <>
      {/* Click Shockwave Container */}
      <div ref={rippleContainerRef} className="cursor-ripple-container" />

      {/* 1. Ambient Flashlight Aura (Atmospheric Light Cone across Canvas) */}
      <div
        ref={ambientAuraRef}
        className={`cursor-ambient-cone ${isLightMode ? 'cone-light' : 'cone-dark'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99996,
          opacity: 0,
          willChange: 'transform',
        }}
      />

      {/* 2. Magnetic Liquid Glass Follower (Morphs into Pills or Ring) */}
      <div
        ref={followerRef}
        className={`cursor-liquid-follower follower-${hoverType} ${isLightMode ? 'cursor-light' : 'cursor-dark'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: 0,
          willChange: 'transform, width, height',
        }}
      >
        {cursorText && (
          <span className="follower-inner-text">
            {cursorText}
          </span>
        )}
      </div>

      {/* 3. Razor-Sharp Precision Pointer Micro-Dot */}
      <div
        ref={dotRef}
        className={`cursor-micro-dot ${hoverType !== 'default' ? 'dot-hidden' : ''} ${isLightMode ? 'dot-light' : 'dot-dark'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
          willChange: 'transform',
        }}
      />

      {/* CSS Styling & Animations */}
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          html, body, a, button, [role="button"], input, textarea, select {
            cursor: none !important;
          }
        }

        /* 1. Ambient Flashlight Cone */
        .cursor-ambient-cone {
          transition: opacity 0.4s ease, filter 0.4s ease, background 0.35s ease;
        }

        .cursor-ambient-cone.cone-dark {
          background: radial-gradient(
            circle,
            rgba(217, 107, 39, 0.22) 0%,
            rgba(56, 189, 248, 0.1) 45%,
            rgba(129, 140, 248, 0.03) 70%,
            transparent 85%
          );
          filter: blur(28px);
          mix-blend-mode: screen;
        }

        .cursor-ambient-cone.cone-light {
          background: radial-gradient(
            circle,
            rgba(217, 107, 39, 0.14) 0%,
            rgba(15, 23, 42, 0.05) 50%,
            transparent 75%
          );
          filter: blur(22px);
          mix-blend-mode: multiply;
        }

        /* 2. Precision Micro-Dot with High-Contrast Adaptive Colors */
        .cursor-micro-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          transition: background-color 0.3s ease, box-shadow 0.3s ease, opacity 0.2s ease, transform 0.15s ease;
        }

        /* Dark Theme Micro-Dot: Radiant White with Amber Glow */
        .cursor-micro-dot.dot-dark {
          background: #FFFFFF;
          box-shadow: 0 0 8px #FFFFFF, 0 0 16px #D96B27;
        }

        /* Light Theme Micro-Dot: Obsidian-Slate with White Micro-Rim & Amber Accent Glow */
        .cursor-micro-dot.dot-light {
          background: #0F172A;
          box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.9), 0 0 8px rgba(15, 23, 42, 0.35), 0 0 12px rgba(217, 107, 39, 0.35);
        }

        .cursor-micro-dot.dot-hidden {
          opacity: 0 !important;
          transform: scale(0.2) !important;
        }

        /* 3. Liquid Follower Base */
        .cursor-liquid-follower {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      height 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.3s ease,
                      border-color 0.3s ease,
                      box-shadow 0.3s ease;
        }

        /* Resting State — Dark Theme (Subtle Frosted Glass) */
        .cursor-liquid-follower.cursor-dark.follower-default {
          width: 22px;
          height: 22px;
          background: rgba(255, 255, 255, 0.05);
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          box-shadow: 0 0 12px rgba(217, 107, 39, 0.15);
        }

        /* Resting State — Light Theme (High Contrast Dark Slate Ring) */
        .cursor-liquid-follower.cursor-light.follower-default {
          width: 24px;
          height: 24px;
          background: rgba(15, 23, 42, 0.05);
          border: 1.5px solid rgba(15, 23, 42, 0.75);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 0 10px rgba(217, 107, 39, 0.18);
        }

        /* Button Hover State — Dark Theme */
        .cursor-liquid-follower.cursor-dark.follower-button {
          width: 44px;
          height: 44px;
          background: rgba(217, 107, 39, 0.14);
          border: 1.5px solid #D96B27;
          box-shadow: 0 0 20px rgba(217, 107, 39, 0.35);
        }

        /* Button Hover State — Light Theme */
        .cursor-liquid-follower.cursor-light.follower-button {
          width: 44px;
          height: 44px;
          background: rgba(217, 107, 39, 0.16);
          border: 2px solid #D96B27;
          box-shadow: 0 4px 18px rgba(217, 107, 39, 0.3), 0 0 0 1px rgba(15, 23, 42, 0.12);
        }

        /* Music Hover State: Editorial "▶ PLAY" Glass Pill */
        .cursor-liquid-follower.follower-music {
          width: 86px;
          height: 34px;
          background: rgba(13, 17, 23, 0.92);
          border: 1px solid rgba(217, 107, 39, 0.6);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px rgba(217, 107, 39, 0.3);
        }

        /* Project Hover State: "VIEW ↗" Glass Pill */
        .cursor-liquid-follower.follower-project {
          width: 82px;
          height: 34px;
          background: rgba(13, 17, 23, 0.92);
          border: 1px solid rgba(56, 189, 248, 0.6);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px rgba(56, 189, 248, 0.3);
        }

        /* Follower Text Badge */
        .follower-inner-text {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #FFAA70;
          white-space: nowrap;
          pointer-events: none;
          animation: text-pop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .follower-project .follower-inner-text {
          color: #7DD3FC;
        }

        @keyframes text-pop {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* 4. Click Shockwave */
        .cursor-ripple-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99995;
          overflow: hidden;
        }

        .cursor-click-shockwave {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(1);
          animation: shockwave-expand 0.55s cubic-bezier(0.15, 0.85, 0.35, 1) forwards;
          pointer-events: none;
        }

        .cursor-click-shockwave.shockwave-dark {
          border: 1.5px solid #D96B27;
        }

        .cursor-click-shockwave.shockwave-light {
          border: 1.5px solid #0F172A;
        }

        @keyframes shockwave-expand {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(7.5);
            border-color: transparent;
          }
        }
      `}</style>
    </>
  );
};

export default AuraCursor;
