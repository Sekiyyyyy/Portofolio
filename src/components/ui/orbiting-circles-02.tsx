"use client";

import React from "react";
import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";

export interface OrbitIcon {
  src: string;
  alt: string;
  angle: number;
}

export interface OrbitRing {
  size: string;
  duration: number;
  borderStyle?: string;
  icons: OrbitIcon[];
}

// Complete 12-Tech Stack Distribution across 3 Celestial Orbits (4 icons per ring @ 90° equilateral intervals)
const defaultPortfolioOrbits: OrbitRing[] = [
  {
    // Orbit 1 (Inner): Frontend Core (React, TypeScript, Next.js, Tailwind CSS)
    size: "w-[170px] h-[170px] sm:w-[185px] sm:h-[185px] lg:w-[195px] lg:h-[195px]",
    duration: 30,
    borderStyle: "border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.04)]",
    icons: [
      { src: "/tech/react.svg", alt: "React", angle: 0 },
      { src: "/tech/typescript.svg", alt: "TypeScript", angle: 90 },
      { src: "/tech/nextjs.svg", alt: "Next.js", angle: 180 },
      { src: "/tech/tailwind.svg", alt: "Tailwind CSS", angle: 270 },
    ],
  },
  {
    // Orbit 2 (Middle): Backend & Systems (Laravel, PHP, Go, PostgreSQL) - Offset by 30°
    size: "w-[240px] h-[240px] sm:w-[260px] sm:h-[260px] lg:w-[275px] lg:h-[275px]",
    duration: 42,
    borderStyle: "border border-[#D96B27]/45 border-dashed shadow-[0_0_18px_rgba(217,107,39,0.08)]",
    icons: [
      { src: "/tech/laravel.svg", alt: "Laravel", angle: 30 },
      { src: "/tech/php.svg", alt: "PHP", angle: 120 },
      { src: "/tech/go.svg", alt: "Go", angle: 210 },
      { src: "/tech/postgresql.svg", alt: "PostgreSQL", angle: 300 },
    ],
  },
  {
    // Orbit 3 (Outer): Mobile, Database & Tooling (Flutter, Dart, MySQL, Git) - Offset by 60°
    size: "w-[310px] h-[310px] sm:w-[335px] sm:h-[335px] lg:w-[355px] lg:h-[355px]",
    duration: 55,
    borderStyle: "border border-cyan-400/25 shadow-[0_0_18px_rgba(56,189,248,0.06)]",
    icons: [
      { src: "/tech/flutter.svg", alt: "Flutter", angle: 60 },
      { src: "/tech/dart.svg", alt: "Dart", angle: 150 },
      { src: "/tech/mysql.svg", alt: "MySQL", angle: 240 },
      { src: "/tech/git.svg", alt: "Git", angle: 330 },
    ],
  },
];

interface OrbitingCirclesGlobeProps {
  className?: string;
  orbits?: OrbitRing[];
  centerGlobeSize?: string;
  centered?: boolean;
}

export default function OrbitingCirclesGlobe({
  className = "",
  orbits = defaultPortfolioOrbits,
  centerGlobeSize = "w-[95px] h-[95px] sm:w-[105px] sm:h-[105px] lg:w-[115px] lg:h-[115px]",
  centered = true,
}: OrbitingCirclesGlobeProps) {
  const centerPosClass = centered
    ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    : "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2";

  return (
    <div
      className={`relative w-full ${
        centered ? "h-[360px] sm:h-[390px] lg:h-[410px]" : "h-110 md:h-160"
      } flex justify-center items-center select-none ${className}`}
    >
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)); }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)); }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)); }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)); }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)); }
        }
      `}</style>

      {/* Luminous Center Ambient Core Glow Aura */}
      <div
        className={`absolute ${centerPosClass} w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-full pointer-events-none z-0`}
        style={{
          background:
            "radial-gradient(circle, rgba(217, 107, 39, 0.28) 0%, rgba(56, 189, 248, 0.08) 55%, transparent 75%)",
          filter: "blur(32px)",
        }}
      />

      {/* Center particle globe (Scaled down, compact & jewel-like) */}
      <div
        className={`absolute ${centerPosClass} aspect-square pointer-events-none z-10 ${centerGlobeSize}`}
      >
        <ParticleSphereAnimation />
      </div>

      {/* Orbiting concentric rings */}
      {orbits.map((orbit, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";

        return (
          <div
            key={index}
            className={`absolute ${centerPosClass} rounded-full ${orbit.size} ${
              orbit.borderStyle || "border border-white/20"
            }`}
          >
            {orbit.icons.map((iconData, iconIndex) => (
              <div
                key={iconIndex}
                className="absolute top-0 left-1/2 h-1/2 w-0 pointer-events-none"
                style={
                  {
                    transformOrigin: "bottom center",
                    "--start-angle": `${iconData.angle}deg`,
                    animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                  } as React.CSSProperties
                }
              >
                <div
                  className="absolute -top-[18px] -left-[18px] w-[36px] h-[36px] rounded-full border border-white/20 bg-[#090D16]/95 shadow-[0_4px_16px_rgba(0,0,0,0.7)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-125 hover:border-[#D96B27] hover:shadow-[0_0_15px_rgba(217,107,39,0.6)] cursor-pointer group pointer-events-auto"
                  style={
                    {
                      transformOrigin: "center center",
                      "--counter-offset": `${-iconData.angle}deg`,
                      animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                    } as React.CSSProperties
                  }
                  title={iconData.alt}
                >
                  <img
                    src={iconData.src}
                    alt={iconData.alt}
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px] object-contain transition-transform duration-200 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
