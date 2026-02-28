"use client";

import dynamic from "next/dynamic";

const TetrisGame = dynamic(
  () => import("@views/games/tetris/TetrisGame"),
  { ssr: false },
);

export default function TetrisLoader() {
  return <TetrisGame />;
}
