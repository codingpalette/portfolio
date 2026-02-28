"use client";

import dynamic from "next/dynamic";

const Game2048 = dynamic(
  () => import("@views/games/2048/Game2048"),
  { ssr: false },
);

export default function Game2048Loader() {
  return <Game2048 />;
}
