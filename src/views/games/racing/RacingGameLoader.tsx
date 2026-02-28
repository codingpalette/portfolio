"use client";

import dynamic from "next/dynamic";

const RacingGame = dynamic(
  () => import("@views/games/racing/RacingGame"),
  { ssr: false },
);

export default function RacingGameLoader() {
  return <RacingGame />;
}
