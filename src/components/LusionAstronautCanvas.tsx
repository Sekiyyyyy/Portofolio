import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// High-craft, lightweight 3D Astronaut Model built with Three.js primitives
const AstronautModel: React.FC<{ mouse: React.MutableRefObject<{ x: number; y: number }> }> = ({
  mouse,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // Astronaut suit materials
  const suitMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E2E8F0',
        roughness: 0.35,
        metalness: 0.25,
      }),
    []
  );

  const suitJointMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1E293B',
        roughness: 0.6,
        metalness: 0.5,
      }),
    []
  );

  // Gold / Amber Iridescent Visor
  const visorMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#FFAA44',
        emissive: '#D96B27',
        emissiveIntensity: 0.35,
        roughness: 0.05,
        metalness: 0.95,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        reflectivity: 1,
      }),
    []
  );

  const backpackMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#CBD5E1',
        roughness: 0.4,
        metalness: 0.4,
      }),
    []
  );

  const glowCyanMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#38BDF8',
        emissive: '#38BDF8',
        emissiveIntensity: 1.5,
      }),
    []
  );

  const glowOrangeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D96B27',
        emissive: '#D96B27',
        emissiveIntensity: 1.8,
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Natural zero-gravity organic floating animation
    const targetRotY = mouse.current.x * 0.45;
    const targetRotX = -mouse.current.y * 0.35;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY + Math.sin(time * 0.6) * 0.1,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX + Math.cos(time * 0.5) * 0.08,
      0.05
    );
    groupRef.current.rotation.z = Math.sin(time * 0.4) * 0.06;

    // Subtle head tracking
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        mouse.current.x * 0.3,
        0.08
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -mouse.current.y * 0.25,
        0.08
      );
    }

    // Floating weightless arms oscillation
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.4 + Math.sin(time * 0.8) * 0.08;
      leftArmRef.current.rotation.x = Math.cos(time * 0.7) * 0.1;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.4 - Math.sin(time * 0.9) * 0.08;
      rightArmRef.current.rotation.x = -0.3 + Math.cos(time * 0.6) * 0.12;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1.2}>
      <group ref={groupRef} position={[2.8, -0.2, 0]} scale={1.25}>
        {/* === HEAD & HELMET === */}
        <group ref={headRef} position={[0, 1.35, 0]}>
          {/* Helmet Outer Shell */}
          <mesh material={suitMaterial}>
            <sphereGeometry args={[0.55, 32, 32]} />
          </mesh>

          {/* Golden Visor Shield */}
          <mesh position={[0, 0.05, 0.28]} rotation={[0.1, 0, 0]} material={visorMaterial}>
            <sphereGeometry args={[0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          </mesh>

          {/* Helmet Ring Collar */}
          <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]} material={suitJointMaterial}>
            <torusGeometry args={[0.42, 0.06, 16, 32]} />
          </mesh>

          {/* Helmet Communication Lights */}
          <mesh position={[-0.48, 0.15, 0.1]} material={glowCyanMaterial}>
            <sphereGeometry args={[0.04, 12, 12]} />
          </mesh>
          <mesh position={[0.48, 0.15, 0.1]} material={glowOrangeMaterial}>
            <sphereGeometry args={[0.04, 12, 12]} />
          </mesh>
        </group>

        {/* === TORSO & SUIT BODY === */}
        <group position={[0, 0.35, 0]}>
          <mesh material={suitMaterial}>
            <boxGeometry args={[0.95, 1.25, 0.65]} />
          </mesh>

          {/* Chest Computer Control Pack */}
          <mesh position={[0, 0.15, 0.36]} material={suitJointMaterial}>
            <boxGeometry args={[0.55, 0.55, 0.12]} />
          </mesh>

          {/* Status Diodes on Chest */}
          <mesh position={[-0.14, 0.25, 0.43]} material={glowOrangeMaterial}>
            <boxGeometry args={[0.08, 0.08, 0.04]} />
          </mesh>
          <mesh position={[0.0, 0.25, 0.43]} material={glowCyanMaterial}>
            <boxGeometry args={[0.08, 0.08, 0.04]} />
          </mesh>
          <mesh position={[0.14, 0.25, 0.43]} material={glowCyanMaterial}>
            <boxGeometry args={[0.08, 0.08, 0.04]} />
          </mesh>

          {/* Waist Belt */}
          <mesh position={[0, -0.55, 0]} material={suitJointMaterial}>
            <boxGeometry args={[1.02, 0.18, 0.72]} />
          </mesh>

          {/* Oxygen / Life Support Backpack (PLSS) */}
          <mesh position={[0, 0.1, -0.52]} material={backpackMaterial}>
            <boxGeometry args={[0.85, 1.2, 0.45]} />
          </mesh>
          {/* Backpack Thruster Tubes */}
          <mesh position={[-0.26, 0.5, -0.52]} material={suitJointMaterial}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          </mesh>
          <mesh position={[0.26, 0.5, -0.52]} material={suitJointMaterial}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          </mesh>
        </group>

        {/* === LEFT ARM (Drifting) === */}
        <group ref={leftArmRef} position={[-0.62, 0.85, 0]}>
          {/* Shoulder */}
          <mesh material={suitMaterial}>
            <sphereGeometry args={[0.22, 16, 16]} />
          </mesh>
          {/* Upper Arm */}
          <mesh position={[-0.18, -0.32, 0]} rotation={[0, 0, 0.35]} material={suitMaterial}>
            <cylinderGeometry args={[0.15, 0.13, 0.55, 16]} />
          </mesh>
          {/* Glove */}
          <mesh position={[-0.32, -0.75, 0.1]} material={suitJointMaterial}>
            <sphereGeometry args={[0.16, 16, 16]} />
          </mesh>
        </group>

        {/* === RIGHT ARM (Reaching Forward) === */}
        <group ref={rightArmRef} position={[0.62, 0.85, 0]}>
          {/* Shoulder */}
          <mesh material={suitMaterial}>
            <sphereGeometry args={[0.22, 16, 16]} />
          </mesh>
          {/* Upper Arm */}
          <mesh position={[0.22, -0.28, 0.18]} rotation={[-0.4, 0, -0.4]} material={suitMaterial}>
            <cylinderGeometry args={[0.15, 0.13, 0.55, 16]} />
          </mesh>
          {/* Glove reaching toward viewer */}
          <mesh position={[0.38, -0.65, 0.45]} material={suitJointMaterial}>
            <sphereGeometry args={[0.17, 16, 16]} />
          </mesh>
        </group>

        {/* === LEGS (Floating in zero-G) === */}
        {/* Left Leg */}
        <group position={[-0.28, -0.45, 0]}>
          <mesh position={[-0.05, -0.48, 0.08]} rotation={[0.15, 0, 0.1]} material={suitMaterial}>
            <cylinderGeometry args={[0.18, 0.15, 0.75, 16]} />
          </mesh>
          {/* Left Boot */}
          <mesh position={[-0.08, -0.92, 0.22]} material={suitJointMaterial}>
            <boxGeometry args={[0.22, 0.22, 0.42]} />
          </mesh>
        </group>

        {/* Right Leg (Floating with knee bend) */}
        <group position={[0.28, -0.45, 0]}>
          <mesh position={[0.08, -0.42, -0.12]} rotation={[-0.25, 0, -0.15]} material={suitMaterial}>
            <cylinderGeometry args={[0.18, 0.15, 0.75, 16]} />
          </mesh>
          {/* Right Boot */}
          <mesh position={[0.12, -0.85, -0.05]} material={suitJointMaterial}>
            <boxGeometry args={[0.22, 0.22, 0.42]} />
          </mesh>
        </group>
      </group>
    </Float>
  );
};

// Subtle Cosmic Stardust Particles (Ultra-lightweight: 120 points)
const CosmicParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.015) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#38BDF8"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const LusionAstronautCanvas: React.FC = () => {
  const mouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouse.current = {
        x: (e.clientX / innerWidth) * 2 - 1,
        y: -((e.clientY / innerHeight) * 2 - 1),
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[6, 8, 5]} intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[-6, -4, -3]} intensity={1.2} color="#0284C7" />
        <pointLight position={[3, 1.5, 3]} intensity={2.5} color="#D96B27" />

        {/* Lightweight Cosmic Stardust */}
        <CosmicParticles />

        {/* Lusion-Inspired Weightless Astronaut */}
        <AstronautModel mouse={mouse} />
      </Canvas>
    </div>
  );
};
