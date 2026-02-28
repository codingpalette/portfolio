import type { GameType, GameScoreConfig } from "./types";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export const GAME_SCORE_CONFIGS: Record<GameType, GameScoreConfig> = {
  "2048": {
    label: "2048",
    sortAsc: false,
    formatScore: (score) => score.toLocaleString(),
  },
  tetris: {
    label: "테트리스",
    sortAsc: false,
    formatScore: (score) => score.toLocaleString(),
  },
  snake: {
    label: "뱀 게임",
    sortAsc: false,
    formatScore: (score) => score.toLocaleString(),
  },
  racing: {
    label: "레이싱",
    sortAsc: false,
    formatScore: (score) => score.toLocaleString(),
  },
  minesweeper: {
    label: "지뢰찾기",
    sortAsc: true,
    formatScore: (score) => formatTime(score),
  },
};
