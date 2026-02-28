"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ROAD_WIDTH = 9;
const CHUNK_LENGTH = 40;
const CHUNK_COUNT = 5;
const LANE_WIDTH = 3;

export default function Road({ speed }: { speed: number }) {
  const chunksRef = useRef<THREE.Group>(null);
  const offsetRef = useRef(0);

  const dashGeometry = useMemo(
    () => new THREE.BoxGeometry(0.1, 0.02, 1.5),
    [],
  );
  const dashMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 0.3 }),
    [],
  );

  useFrame((_, delta) => {
    if (!chunksRef.current) return;
    offsetRef.current += speed * delta;

    const totalLength = CHUNK_COUNT * CHUNK_LENGTH;
    chunksRef.current.children.forEach((chunk, i) => {
      const baseZ = i * CHUNK_LENGTH - totalLength / 2;
      let z = baseZ + (offsetRef.current % CHUNK_LENGTH);
      if (z > totalLength / 2) {
        z -= totalLength;
      }
      chunk.position.z = z;
    });
  });

  return (
    <group ref={chunksRef}>
      {Array.from({ length: CHUNK_COUNT }).map((_, i) => (
        <group
          key={i}
          position={[
            0,
            -0.5,
            i * CHUNK_LENGTH - (CHUNK_COUNT * CHUNK_LENGTH) / 2,
          ]}
        >
          {/* Road surface */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[ROAD_WIDTH, 0.1, CHUNK_LENGTH]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>

          {/* Sidewalks */}
          <mesh position={[-(ROAD_WIDTH / 2 + 0.5), 0.15, 0]}>
            <boxGeometry args={[1, 0.4, CHUNK_LENGTH]} />
            <meshStandardMaterial color="#2a2a4a" />
          </mesh>
          <mesh position={[ROAD_WIDTH / 2 + 0.5, 0.15, 0]}>
            <boxGeometry args={[1, 0.4, CHUNK_LENGTH]} />
            <meshStandardMaterial color="#2a2a4a" />
          </mesh>

          {/* Lane dashes */}
          {[-LANE_WIDTH / 2 - LANE_WIDTH / 2, LANE_WIDTH / 2 + LANE_WIDTH / 2].map(
            (_, laneIdx) => {
              const x = laneIdx === 0 ? -LANE_WIDTH / 2 : LANE_WIDTH / 2;
              return Array.from({ length: 8 }).map((__, dashIdx) => (
                <mesh
                  key={`${laneIdx}-${dashIdx}`}
                  geometry={dashGeometry}
                  material={dashMaterial}
                  position={[
                    x,
                    0.06,
                    -CHUNK_LENGTH / 2 + dashIdx * 5 + 2,
                  ]}
                />
              ));
            },
          )}

          {/* Edge lines */}
          <mesh position={[-ROAD_WIDTH / 2 + 0.1, 0.06, 0]}>
            <boxGeometry args={[0.12, 0.02, CHUNK_LENGTH]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[ROAD_WIDTH / 2 - 0.1, 0.06, 0]}>
            <boxGeometry args={[0.12, 0.02, CHUNK_LENGTH]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
