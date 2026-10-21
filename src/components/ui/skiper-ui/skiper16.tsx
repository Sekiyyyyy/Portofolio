"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { portfolioData } from "@/data/portfolioData";
import { ArrowUpRight } from "lucide-react";

export interface ProjectItem {
  number: string;
  title: string;
  subtitle: string;
  tech: string[];
  image: string;
  link: string;
}

interface StickyCardProps {
  i: number;
  project: ProjectItem;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  total: number;
}

const GLOW_ACCENTS = ["#D96B27", "#38BDF8", "#A855F7"];

const StickyCard_001: React.FC<StickyCardProps> = ({
  i,
  project,
  progress,
  range,
  targetScale,
  total,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageHolderRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Cached geometry & RAF for smooth 3D tilt without layout thrashing
  const cardRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const imgRectRef = useRef<{ left: number; top: number } | null>(null);
  const rafId = useRef<number | null>(null);

  // Framer Motion transforms from Skiper16 architecture
  const scale = useTransform(progress, range, [1, targetScale]);
  // Smoothly dim underlying card content to eliminate background bleed-through
  const opacity = i === total - 1
    ? 1
    : useTransform(progress, [range[0] + 0.12, Math.min(1, range[0] + 0.38)], [1, 0.1]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      cardRectRef.current = cardRef.current.getBoundingClientRect();
    }
    if (imageHolderRef.current) {
      imgRectRef.current = imageHolderRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafId.current !== null) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      const card = cardRef.current;
      if (!card) return;

      if (!cardRectRef.current) {
        cardRectRef.current = card.getBoundingClientRect();
      }
      const rect = cardRectRef.current;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Spotlight coordinates
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // 3D Perspective Tilt on project image
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      if (imageHolderRef.current) {
        imageHolderRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
      }

      // Floating cursor badge position
      if (badgeRef.current) {
        if (!imgRectRef.current && imageHolderRef.current) {
          imgRectRef.current = imageHolderRef.current.getBoundingClientRect();
        }
        if (imgRectRef.current) {
          const badgeX = clientX - imgRectRef.current.left;
          const badgeY = clientY - imgRectRef.current.top;
          badgeRef.current.style.transform = `translate3d(${badgeX}px, ${badgeY}px, 0) translate(-50%, -50%)`;
        }
      }
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    cardRectRef.current = null;
    imgRectRef.current = null;
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    const card = cardRef.current;
    if (card) {
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
    }
    if (imageHolderRef.current) {
      imageHolderRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
  };

  const accentColor = GLOW_ACCENTS[i % GLOW_ACCENTS.length];

  return (
    <div
      ref={containerRef}
      className="sticky flex items-center justify-center w-full"
      style={{
        top: `calc(90px + ${i * 24}px)`,
        zIndex: i + 1,
        marginBottom: i === total - 1 ? "40px" : "110px",
      }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          transformOrigin: "top center",
          willChange: "transform, opacity",
        }}
        className="project-card w-full max-w-5xl rounded-[22px] relative overflow-hidden"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ width: "100%", position: "relative" }}
        >
          {/* Specular Diagonal Glass Sheen Reflection */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[22px] z-[2]"
            style={{
              background:
                "linear-gradient(115deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.02) 26%, transparent 52%)",
            }}
          />

          {/* Top-Edge Crystal Prism Reflection Line */}
          <div
            className="pointer-events-none absolute top-0 left-6 right-6 h-[1.5px] z-[3]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 25%, rgba(255, 255, 255, 0.8) 75%, transparent 100%)",
            }}
          />

          {/* Corner Ambient Glass Glint */}
          <div
            className="pointer-events-none absolute -top-16 -left-16 w-56 h-56 rounded-full z-[1]"
            style={{
              background: `radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, ${accentColor}15 40%, transparent 70%)`,
              filter: "blur(18px)",
            }}
          />

          {/* Main 2-Column Grid Layout */}
          <div className="project-grid relative z-[4]">
            {/* Project Image with 3D Perspective Tilt, Ambient Light Diffusion & Magnetic Floating Cursor */}
            <div className="tilt-card-wrapper">
              <div
                ref={imageHolderRef}
                className="project-image-holder tilt-card-inner genjutsu-container"
                style={{
                  borderRadius: "14px",
                  position: "relative",
                  cursor: "none",
                  willChange: "transform",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Project Screenshot with Calibrated Contrast */}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className={isHovered ? "genjutsu-chromatic" : ""}
                />

                {/* Glass Glare Sheen */}
                <div className={`sheen-overlay ${isHovered ? "sheen-active" : ""}`} />

                {/* Inner Frosted Glass Bevel Rim */}
                <div className="absolute inset-0 pointer-events-none rounded-[14px] border border-white/20 shadow-inner" />

                {/* Custom Magnetic Floating Cursor Badge */}
                <div
                  ref={badgeRef}
                  className={`magnetic-cursor-badge ${isHovered ? "badge-visible" : ""}`}
                >
                  <span>EXPLORE ↗</span>
                </div>
              </div>
            </div>

            {/* Project Info Column */}
            <div className="project-info-holder">
              <div>
                <div className="project-num">// {project.number}</div>
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

              <div>
                <a
                  href={project.link}
                  className="magnetic-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>VIEW ARCHITECTURE</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export interface Skiper16Props {
  projects?: ProjectItem[];
}

const Skiper16: React.FC<Skiper16Props> = ({ projects = portfolioData.projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col items-center justify-center pt-8 pb-16"
    >
      {projects.map((project, i) => {
        const targetScale = Math.max(0.75, 1 - (projects.length - i - 1) * 0.05);
        const step = 1 / projects.length;
        const range: [number, number] = [i * step, 1];

        return (
          <StickyCard_001
            key={project.number || `p_${i}`}
            i={i}
            project={project}
            progress={scrollYProgress}
            range={range}
            targetScale={targetScale}
            total={projects.length}
          />
        );
      })}
    </div>
  );
};

export { Skiper16, StickyCard_001 };
