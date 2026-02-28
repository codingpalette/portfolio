"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore, LANE_X } from "../hooks/use-game-store";

export default function PlayerCar() {
  const groupRef = useRef<THREE.Group>(null);
  const targetX = useRef(0);
  const lane = useGameStore((s) => s.lane);
  const gameState = useGameStore((s) => s.gameState);
  const moveLane = useGameStore((s) => s.moveLane);

  useEffect(() => {
    targetX.current = LANE_X[lane];
  }, [lane]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        moveLane(-1);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        moveLane(1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState, moveLane]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const current = groupRef.current.position.x;
    groupRef.current.position.x = THREE.MathUtils.lerp(
      current,
      targetX.current,
      1 - Math.pow(0.001, delta),
    );
  });

  return (
    <group ref={groupRef} position={[LANE_X[1], 0, 0]}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.0, 0.4, 2.0]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.65, -0.1]}>
        <boxGeometry args={[0.8, 0.35, 1.0]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#818cf8"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.65, 0.35]}>
        <boxGeometry args={[0.7, 0.3, 0.05]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
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
          <meshStandardMaterial color="#1e1b4b" />
        </mesh>
      ))}

      {/* Headlights */}
      {[
        [-0.35, 0.3, 1.01],
        [0.35, 0.3, 1.01],
      ].map((pos, i) => (
        <mesh key={`hl-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.2, 0.1, 0.05]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={1.0}
          />
        </mesh>
      ))}

      {/* Taillights */}
      {[
        [-0.35, 0.3, -1.01],
        [0.35, 0.3, -1.01],
      ].map((pos, i) => (
        <mesh key={`tl-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.2, 0.1, 0.05]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.0}
          />
        </mesh>
      ))}
    </group>
  );
}
