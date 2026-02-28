"use client";

import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../hooks/use-game-store";

export default function GameLoop() {
  const tick = useGameStore((s) => s.tick);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    tick(clampedDelta);
  });

  return null;
}
