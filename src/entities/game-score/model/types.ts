export type GameType = "2048" | "tetris" | "snake" | "racing" | "minesweeper";

export interface GameScore {
  id: string;
  user_id: string;
  player_name: string;
  game: GameType;
  score: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface GameScoreConfig {
  label: string;
  sortAsc: boolean;
  formatScore: (score: number) => string;
}
