"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/* ── Threshold Arch (torus knot centerpiece) ── */
function ThresholdArch({
  pointer,
  reducedMotion,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    if (!reducedMotion) {
      group.current.rotation.y += delta * 0.06;
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        pointer.current.y * 0.15 + Math.sin(t * 0.15) * 0.03,
        0.04,
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        pointer.current.x * 0.12,
        0.04,
      );
    } else {
      group.current.rotation.set(0.18, 0.3, 0);
    }
  });

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[0.95, 0.24, 220, 36, 2, 3]} />
        <meshPhysicalMaterial
          color="#0d1e3a"
          emissive="#2f76f0"
          emissiveIntensity={0.22}
          metalness={0.92}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={0.9}
        />
      </mesh>
    </group>
  );
}

/* ── Floating document plane ── */
function FloatingDocument({
  position,
  rotationOffset,
  reducedMotion,
}: {
  position: [number, number, number];
  rotationOffset: number;
  reducedMotion: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    mesh.current.position.y =
      position[1] + Math.sin(t * 0.4 + rotationOffset) * 0.12;
    mesh.current.rotation.y =
      rotationOffset + Math.sin(t * 0.2 + rotationOffset) * 0.06;
    mesh.current.rotation.z = Math.sin(t * 0.15 + rotationOffset) * 0.04;
  });

  return (
    <mesh ref={mesh} position={position} rotation={[0, rotationOffset, 0.05]}>
      <planeGeometry args={[0.6, 0.82]} />
      <MeshTransmissionMaterial
        backside={false}
        samples={4}
        resolution={256}
        transmission={0.92}
        roughness={0.2}
        thickness={0.04}
        ior={1.5}
        chromaticAberration={0.02}
        color="#c5ced9"
      />
    </mesh>
  );
}

/* ── Voice ribbon (abstract waveform ring) ── */
function VoiceRibbon({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.TorusGeometry(1.8, 0.012, 8, 180), []);

  useFrame((state) => {
    if (!mesh.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.12) * 0.08;
    mesh.current.rotation.z = t * 0.04;
  });

  return (
    <mesh ref={mesh} geometry={geo} rotation={[Math.PI / 2.5, 0, 0]}>
      <meshStandardMaterial
        color="#94a3b8"
        emissive="#22d3ee"
        emissiveIntensity={0.04}
        metalness={0.9}
        roughness={0.3}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

/* ── Cyan orbit ring ── */
function OrbitRing({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = 0.45 + Math.sin(t * 0.1) * 0.05;
    mesh.current.rotation.z = t * 0.025;
  });

  return (
    <mesh ref={mesh} rotation={[0.45, 0.3, 0]}>
      <torusGeometry args={[2.0, 0.016, 16, 140]} />
      <meshStandardMaterial
        color="#06b6d4"
        emissive="#06b6d4"
        emissiveIntensity={0.05}
        metalness={1}
        roughness={0.32}
        transparent
        opacity={0.45}
      />
    </mesh>
  );
}

/* ── Scene composition ── */
function Scene({
  pointer,
  reducedMotion,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#060a12"]} />
      <fog attach="fog" args={["#060a12", 4, 12]} />
      <ambientLight intensity={0.35} />
      <spotLight
        position={[5, 8, 5]}
        angle={0.3}
        penumbra={0.7}
        intensity={2.2}
        color="#e1e6ed"
        castShadow
      />
      <pointLight position={[-4, -2, 3]} intensity={0.7} color="#2f76f0" />
      <pointLight position={[3, 3, -3]} intensity={0.5} color="#22d3ee" />

      <Float
        speed={reducedMotion ? 0 : 0.3}
        rotationIntensity={reducedMotion ? 0 : 0.08}
        floatIntensity={reducedMotion ? 0 : 0.1}
      >
        <ThresholdArch pointer={pointer} reducedMotion={reducedMotion} />
      </Float>

      <FloatingDocument
        position={[-1.9, 0.4, 0.6]}
        rotationOffset={-0.3}
        reducedMotion={reducedMotion}
      />
      <FloatingDocument
        position={[1.85, -0.2, 0.8]}
        rotationOffset={0.25}
        reducedMotion={reducedMotion}
      />

      <VoiceRibbon reducedMotion={reducedMotion} />
      <OrbitRing reducedMotion={reducedMotion} />
    </>
  );
}

export function HeroCanvas() {
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion() === true;

  return (
    <div
      className="absolute inset-0"
      onPointerMove={(e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        pointer.current.x = nx * 2;
        pointer.current.y = ny * 2;
      }}
      onPointerLeave={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
    >
      <Canvas
        className="h-full w-full"
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0.3, 4.8], fov: 40 }}
      >
        <Suspense fallback={null}>
          <Scene pointer={pointer} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
