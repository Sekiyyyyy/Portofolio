'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export function ParallaxComponent({
  title = "ARCHITECTURAL VISION",
  subtitle = "Crafting high-dimensional interactive experiences",
}: {
  title?: string;
  subtitle?: string;
}) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Clean up GSAP and ScrollTrigger instances
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.ticker.remove(tickerCallback);
      if (triggerElement) gsap.killTweensOf(triggerElement);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="parallax" ref={parallaxRef}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow"></div>
          <div data-parallax-layers className="parallax__layers">
            {/* Background Sky / Stars Layer */}
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
              loading="eager"
              width="1600"
              data-parallax-layer="1"
              alt="Mountain Sky"
              className="parallax__layer-img layer-bg"
            />

            {/* Midground Mountain Ridges */}
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
              loading="eager"
              width="1600"
              data-parallax-layer="2"
              alt="Mountain Ridges"
              className="parallax__layer-img layer-mid"
            />

            {/* Central Typography Title */}
            <div data-parallax-layer="3" className="parallax__layer-title">
              <span className="parallax__tag">04.5 // VISUAL HORIZON</span>
              <h2 className="parallax__title">{title}</h2>
              <p className="parallax__sub">{subtitle}</p>
            </div>

            {/* Foreground Fog & Terrain Silhouette */}
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80"
              loading="eager"
              width="1600"
              data-parallax-layer="4"
              alt="Foreground Silhouette"
              className="parallax__layer-img layer-fore"
            />
          </div>
          <div className="parallax__fade"></div>
        </div>
      </section>

      <section className="parallax__content">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 160 160" fill="none" className="osmo-icon-svg">
          <path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor"></path>
        </svg>
      </section>

      <style>{`
        .parallax {
          position: relative;
          width: 100%;
          background: #07090E;
          overflow: hidden;
        }

        .parallax__header {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .parallax__visuals {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .parallax__black-line-overflow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #07090E;
          z-index: 10;
        }

        .parallax__layers {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .parallax__layer-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 110%;
          object-fit: cover;
          pointer-events: none;
          will-change: transform;
        }

        .layer-bg {
          opacity: 0.6;
          filter: brightness(0.8) contrast(1.1);
        }

        .layer-mid {
          opacity: 0.45;
          mix-blend-mode: screen;
        }

        .layer-fore {
          opacity: 0.35;
          mix-blend-mode: overlay;
        }

        .parallax__layer-title {
          position: absolute;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          text-align: center;
          padding: 0 20px;
          pointer-events: none;
          will-change: transform;
        }

        .parallax__tag {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #D96B27;
          margin-bottom: 12px;
          background: rgba(13, 17, 23, 0.7);
          backdrop-filter: blur(8px);
          padding: 4px 14px;
          border-radius: 9999px;
          border: 1px solid rgba(217, 107, 39, 0.3);
        }

        .parallax__title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 7.5vw, 6.2rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.05;
          text-shadow: 0 10px 40px rgba(0, 0, 0, 0.9);
        }

        .parallax__sub {
          font-family: var(--font-body);
          font-size: clamp(0.95rem, 1.5vw, 1.25rem);
          color: rgba(255, 255, 255, 0.75);
          margin-top: 14px;
          max-width: 600px;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.8);
        }

        .parallax__fade {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 220px;
          background: linear-gradient(to bottom, transparent, #07090E);
          pointer-events: none;
          z-index: 6;
        }

        .parallax__content {
          position: relative;
          min-height: 30vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          z-index: 8;
          background: #07090E;
        }

        .osmo-icon-svg {
          color: #D96B27;
          opacity: 0.85;
          filter: drop-shadow(0 0 25px rgba(217, 107, 39, 0.4));
          animation: float-icon 4s ease-in-out infinite alternate;
        }

        @keyframes float-icon {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-12px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

export default ParallaxComponent;
