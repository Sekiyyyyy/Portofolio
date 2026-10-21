import { useEffect, useRef } from "react";

interface ParticleSphereProps {
  className?: string;
  particleCount?: number;
}

export default function ParticleSphereAnimation({
  className = "",
  particleCount = 180,
}: ParticleSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Generate points uniformly on sphere using Fibonacci spiral
    const particles: { x: number; y: number; z: number; size: number }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      particles.push({
        x,
        y,
        z,
        size: Math.random() * 1.0 + 0.8,
      });
    }

    let angleX = 0.15;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.44;
      const fov = 380;

      angleY += 0.005;
      angleX = Math.sin(angleY * 0.4) * 0.12;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Project particles to 2D screen coordinates
      const projected = particles.map((p) => {
        // Rotate around Y axis
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X axis
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Scale by radius
        const worldX = x1 * radius;
        const worldY = y2 * radius;
        const worldZ = z2 * radius;

        const scale = fov / (fov + worldZ + radius);
        const projX = cx + worldX * scale;
        const projY = cy + worldY * scale;

        const depthAlpha = Math.max(0.1, Math.min(1, (worldZ + radius) / (2 * radius)));

        return {
          projX,
          projY,
          scale,
          worldZ,
          size: p.size * scale,
          alpha: depthAlpha,
        };
      });

      projected.sort((a, b) => a.worldZ - b.worldZ);

      // Subtle network constellation lines between close nodes
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.alpha < 0.45) continue;

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (p2.alpha < 0.45) continue;

          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const distSq = dx * dx + dy * dy;

          if (distSq < 600) {
            const lineAlpha = (1 - distSq / 600) * 0.25 * p1.alpha;
            ctx.strokeStyle = `rgba(217, 107, 39, ${lineAlpha})`; // Amber glow constellation
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      }

      // Draw particle points
      projected.forEach((p) => {
        // Front-facing amber halo
        if (p.alpha > 0.6) {
          ctx.fillStyle = `rgba(217, 107, 39, ${(p.alpha - 0.6) * 0.6})`;
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, p.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core bright particle
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.95})`;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [particleCount]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />;
}
