"use client";

import { LANE_X, type Obstacle as ObstacleData } from "../hooks/use-game-store";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#10b981", "#8b5cf6"];

function ObstacleCar({ color }: { color: string }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.0, 0.4, 2.0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.65, 0.1]}>
        <boxGeometry args={[0.8, 0.35, 0.9]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} />
      </mesh>
      {/* Wheels */}
      {[
        [-0.5, 0.05, 0.6],
        [0.5, 0.05, 0.6],
        [-0.5, 0.05, -0.6],
        [0.5, 0.05, -0.6],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.15, 0.25, 0.4]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      {/* Taillights facing player */}
      {[
        [-0.35, 0.3, 1.01],
        [0.35, 0.3, 1.01],
      ].map((pos, i) => (
        <mesh key={`tl-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.2, 0.1, 0.05]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Barrier() {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.6, 0.5, 0.6]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.3} />
      </mesh>
      {/* Stripes */}
      <mesh position={[0, 0.25, 0.31]}>
        <boxGeometry args={[1.6, 0.5, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

export default function Obstacle({ data }: { data: ObstacleData }) {
  const x = LANE_X[data.lane];
  const color = COLORS[data.id % COLORS.length];

  return (
    <group position={[x, -0.5, data.z]}>
      {data.type === "car" ? <ObstacleCar color={color} /> : <Barrier />}
    </group>
  );
}
