"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BUILDING_COUNT = 20;
const TREE_COUNT = 16;
const SPREAD_Z = 80;

function Buildings({ side }: { side: 1 | -1 }) {
  const groupRef = useRef<THREE.Group>(null);
  const offsetRef = useRef(0);

  const buildings = useMemo(
    () =>
      Array.from({ length: BUILDING_COUNT }).map((_, i) => ({
        height: 2 + Math.random() * 6,
        width: 1.5 + Math.random() * 2,
        depth: 1.5 + Math.random() * 2,
        x: side * (7 + Math.random() * 4),
        z: (i / BUILDING_COUNT) * SPREAD_Z * 2 - SPREAD_Z,
        color: ["#1e1b4b", "#172554", "#1e3a5f", "#0f172a"][
          Math.floor(Math.random() * 4)
        ],
        windows: Math.random() > 0.3,
      })),
    [side],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    offsetRef.current += delta;
  });

  return (
    <group ref={groupRef}>
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.height / 2 - 0.5, b.z]}>
          <mesh>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color={b.color} />
          </mesh>
          {b.windows &&
            Array.from({ length: Math.floor(b.height / 1.2) }).map((_, wi) => (
              <mesh
                key={wi}
                position={[
                  side * -(b.width / 2 + 0.01),
                  -b.height / 2 + 1 + wi * 1.2,
                  0,
                ]}
              >
                <boxGeometry args={[0.02, 0.4, 0.5]} />
                <meshStandardMaterial
                  color="#22d3ee"
                  emissive="#22d3ee"
                  emissiveIntensity={0.4 + Math.random() * 0.4}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            ))}
        </group>
      ))}
    </group>
  );
}

function Trees({ side }: { side: 1 | -1 }) {
  const trees = useMemo(
    () =>
      Array.from({ length: TREE_COUNT }).map((_, i) => ({
        x: side * (5.8 + Math.random() * 0.8),
        z: (i / TREE_COUNT) * SPREAD_Z * 2 - SPREAD_Z,
        height: 1.5 + Math.random() * 1,
      })),
    [side],
  );

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, -0.5, t.z]}>
          {/* Trunk */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            <meshStandardMaterial color="#5c3d2e" />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 0.8 + t.height / 2, 0]}>
            <boxGeometry args={[0.8, t.height, 0.8]} />
            <meshStandardMaterial
              color="#065f46"
              emissive="#059669"
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function Environment() {
  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} color="#e0e7ff" />
      <pointLight position={[0, 10, -20]} intensity={0.5} color="#06b6d4" />

      {/* Ground plane */}
      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0a0a1a" />
      </mesh>

      {/* Fog color / sky */}
      <fog attach="fog" args={["#0a0a1a", 30, 90]} />

      {/* Buildings */}
      <Buildings side={-1} />
      <Buildings side={1} />

      {/* Trees */}
      <Trees side={-1} />
      <Trees side={1} />
    </group>
  );
}
