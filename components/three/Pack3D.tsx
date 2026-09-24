"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface PackMeshProps {
  colorA: string;
  colorB: string;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  interactive: boolean;
  spin: boolean;
}

function PackMesh({ colorA, colorB, pointer, interactive, spin }: PackMeshProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.position.y = Math.sin(t * 0.9) * 0.1;
    const targetRx = interactive ? pointer.current.y * -0.45 : 0;
    const targetRy = (interactive ? pointer.current.x * 0.55 : 0) + (spin ? t * 0.22 : 0);
    g.rotation.x += (targetRx - g.rotation.x) * Math.min(1, delta * 4);
    g.rotation.y += (targetRy - g.rotation.y) * Math.min(1, delta * 4);
  });

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[1.35, 1.95, 0.2]} />
        <meshPhysicalMaterial
          color={colorA}
          metalness={0.55}
          roughness={0.22}
          iridescence={1}
          iridescenceIOR={1.35}
          iridescenceThicknessRange={[120, 420]}
          clearcoat={1}
          clearcoatRoughness={0.12}
          emissive={colorB}
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* tear seam */}
      <mesh position={[0, 0.72, 0.105]}>
        <boxGeometry args={[1.37, 0.045, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
      </mesh>
      {/* brand chip */}
      <mesh position={[0, -0.55, 0.106]}>
        <circleGeometry args={[0.22, 32]} />
        <meshBasicMaterial color={colorB} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function Lights({ colorA }: { colorA: string }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!light.current) return;
    const t = state.clock.elapsedTime;
    light.current.position.x = Math.sin(t * 0.6) * 3;
    light.current.position.z = Math.cos(t * 0.6) * 3 + 1;
  });
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[2.5, 2.5, 3]} intensity={45} color="#ffffff" />
      <pointLight ref={light} position={[-3, -1, 2]} intensity={18} color={colorA} />
    </>
  );
}

interface Pack3DProps {
  colorA?: string;
  colorB?: string;
  interactive?: boolean;
  spin?: boolean;
  className?: string;
}

export function Pack3D({ colorA = "#8b5cf6", colorB = "#22d3ee", interactive = true, spin = true, className }: Pack3DProps) {
  const pointer = useRef({ x: 0, y: 0 });

  return (
    <div
      className={className}
      onPointerMove={(e) => {
        if (!interactive) return;
        const rect = e.currentTarget.getBoundingClientRect();
        pointer.current = {
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
        };
      }}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 };
      }}
    >
      <Canvas camera={{ position: [0, 0, 4.3], fov: 30 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={null}>
          <Lights colorA={colorA} />
          <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.5}>
            <PackMesh colorA={colorA} colorB={colorB} pointer={pointer} interactive={interactive} spin={spin} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
