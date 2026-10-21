import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 200;

    // WebGL Renderer with alpha
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle Mist Geometry
    const particleCount = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount * 2);

    for (let i = 0; i < particleCount; i++) {
      // Spread across sky
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = Math.random() * 300 - 50; // Focused in mid-upper sky
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      scales[i] = Math.random() * 24 + 12; // Size
      speeds[i * 2] = (Math.random() - 0.5) * 0.15; // X drift
      speeds[i * 2 + 1] = Math.random() * 0.08 + 0.02; // Y drift
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom Canvas Texture for soft glow cloud particle
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      gradient.addColorStop(0.3, 'rgba(200, 225, 245, 0.45)');
      gradient.addColorStop(0.7, 'rgba(147, 168, 182, 0.15)');
      gradient.addColorStop(1, 'rgba(147, 168, 182, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 28,
      map: texture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse tracking for subtle interactive float
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX - innerWidth / 2) * 0.06;
      targetY = (e.clientY - innerHeight / 2) * 0.04;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX;
      camera.position.y = -mouseY;
      camera.lookAt(0, 0, 0);

      // Drift mist particles
      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += speeds[i * 2]; // X
        pos[i * 3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.04; // subtle wave

        // Wrap boundaries
        if (pos[i * 3] > 320) pos[i * 3] = -320;
        if (pos[i * 3] < -320) pos[i * 3] = 320;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="hero-canvas-container" />;
};
