import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);



// Interactive 3D Voxel Floor using InstancedMesh for extreme 60fps performance
const VoxelFloor: React.FC<{ mouse: React.MutableRefObject<{ x: number; y: number }> }> = ({
  mouse,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const cols = 42;
  const rows = 22;
  const count = cols * rows;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-calculate X & Z offsets
  const offsets = useMemo(() => {
    const arr = [];
    const spacing = 0.65;
    const startX = -((cols * spacing) / 2);
    const startZ = -10;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        arr.push({
          x: startX + c * spacing,
          z: startZ + r * spacing,
          col: c,
          row: r,
        });
      }
    }
    return arr;
  }, [cols, rows]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const mouseWorldX = mouse.current.x * 12;
    const mouseWorldZ = -mouse.current.y * 6 - 2;

    offsets.forEach((item, i) => {
      // Natural undulating topographic horizon wave
      const wave =
        Math.sin(time * 1.4 + item.col * 0.22 + item.row * 0.28) * 0.45 +
        Math.cos(time * 1.1 + item.col * 0.18) * 0.25;

      // Distance from user cursor in 3D world space
      const dx = item.x - mouseWorldX;
      const dz = item.z - mouseWorldZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const mouseRise = Math.max(0, 1 - dist / 5.5) * 1.8;

      const totalHeight = Math.max(0.2, 1.2 + wave + mouseRise);

      dummy.position.set(item.x, -2.4 + totalHeight / 2, item.z);
      dummy.scale.set(0.56, totalHeight, 0.56);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#101522"
        roughness={0.25}
        metalness={0.8}
        envMapIntensity={1.2}
      />
    </instancedMesh>
  );
};

// Refractive Centerpiece 3D Glass Octahedron Artifact
const GlassOctahedronArtifact: React.FC<{
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}> = ({ mouse }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRot = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Continuous majestic spin
    meshRef.current.rotation.y = time * 0.35;
    meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.12;

    // Mouse parallax reaction
    targetRot.current.x = mouse.current.y * 0.6;
    targetRot.current.y = mouse.current.x * 0.6;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRot.current.x,
      0.08
    );
  });

  return (
    <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[3.2, 0.2, 4]} scale={1.35}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial
          roughness={0.04}
          transmission={0.94}
          thickness={1.8}
          ior={1.54}
          reflectivity={0.95}
          clearcoat={1}
          clearcoatRoughness={0.08}
          color="#38bdf8"
          attenuationColor="#d96b27"
          attenuationDistance={1.6}
        />
      </mesh>
    </Float>
  );
};

// Camera Controller syncing 3D dive with GSAP Scroll
const CameraController: React.FC<{
  scrollProgress: React.MutableRefObject<number>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}> = ({ scrollProgress, mouse }) => {
  useFrame(({ camera }) => {
    const sp = scrollProgress.current;

    // Smooth camera dive forward and tilt as user scrolls down hero
    const targetZ = THREE.MathUtils.lerp(12, 4.5, sp);
    const targetY = THREE.MathUtils.lerp(2.2, 0.8, sp) - mouse.current.y * 0.4;
    const targetX = mouse.current.x * 0.6;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.1);
    camera.lookAt(0, -0.4, 0);
  });

  return null;
};

export const VoxelHorizonCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouse.current = {
        x: (e.clientX / innerWidth) * 2 - 1,
        y: -((e.clientY / innerHeight) * 2 - 1),
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // GSAP ScrollTrigger to track hero camera dive
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current?.parentElement || document.body,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 2.2, 12], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Volumetric Fog & Atmospheric Environment */}
        <color attach="background" args={['#07090e']} />
        <fogExp2 attach="fog" args={['#07090e', 0.045]} />

        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={2.0} color="#ffffff" />
        <directionalLight position={[-10, 10, -5]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[3, 2, 4]} intensity={2.5} color="#d96b27" />

        {/* Camera Dive */}
        <CameraController scrollProgress={scrollProgress} mouse={mouse} />

        {/* Interactive Voxel Ground Horizon */}
        <VoxelFloor mouse={mouse} />

        {/* Centerpiece Floating Glass Octahedron */}
        <GlassOctahedronArtifact mouse={mouse} />
      </Canvas>
    </div>
  );
};
