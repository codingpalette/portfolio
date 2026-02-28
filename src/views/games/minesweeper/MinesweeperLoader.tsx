"use client";

import dynamic from "next/dynamic";

const MinesweeperGame = dynamic(
  () => import("@views/games/minesweeper/MinesweeperGame"),
  { ssr: false },
);

export default function MinesweeperLoader() {
  return <MinesweeperGame />;
}
