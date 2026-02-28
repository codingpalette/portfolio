"use client";

import dynamic from "next/dynamic";

const SnakeGame = dynamic(
  () => import("@views/games/snake/SnakeGame"),
  { ssr: false },
);

export default function SnakeLoader() {
  return <SnakeGame />;
}
