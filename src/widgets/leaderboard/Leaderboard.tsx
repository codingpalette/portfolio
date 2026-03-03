"use client";

import { useState } from "react";
import {
  GAME_SCORE_CONFIGS,
  type GameScore,
  type GameType,
} from "@entities/game-score";

interface LeaderboardProps {
  scoresByGame: Record<GameType, GameScore[]>;
  currentUserId?: string;
}

const GAME_ORDER: GameType[] = ["2048", "tetris", "snake", "racing", "minesweeper"];

export default function Leaderboard({
  scoresByGame,
  currentUserId,
}: LeaderboardProps) {
  const [activeGame, setActiveGame] = useState<GameType>("2048");
  const config = GAME_SCORE_CONFIGS[activeGame];
  const scores = scoresByGame[activeGame] ?? [];

  return (
    <div className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
      <h2 className="mb-4 text-lg font-semibold text-foreground">리더보드</h2>

      {/* Game Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {GAME_ORDER.map((game) => (
          <button
            key={game}
            onClick={() => setActiveGame(game)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-all ${
              activeGame === game
                ? "bg-cyan-500/20 border-cyan-500 text-cyan-700 dark:text-cyan-300"
                : "bg-muted border-border text-muted-foreground hover:border-border"
            }`}
          >
            {GAME_SCORE_CONFIGS[game].label}
          </button>
        ))}
      </div>

      {/* Scores */}
      {scores.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          아직 기록이 없습니다. 첫 번째 기록을 남겨보세요!
        </p>
      ) : (
        <div className="space-y-2">
          {scores.map((entry, index) => {
            const isCurrentUser = entry.user_id === currentUserId;
            const medal =
              index === 0
                ? "🥇"
                : index === 1
                  ? "🥈"
                  : index === 2
                    ? "🥉"
                    : null;

            return (
              <div
                key={entry.id}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isCurrentUser
                    ? "bg-cyan-500/10 border border-cyan-500/20"
                    : "hover:bg-muted/50"
                }`}
              >
                <span className="w-8 text-center text-sm font-bold text-muted-foreground">
                  {medal ?? `${index + 1}`}
                </span>
                <span
                  className={`flex-1 truncate text-sm ${isCurrentUser ? "font-semibold text-cyan-600 dark:text-cyan-400" : "text-foreground"}`}
                >
                  {entry.player_name}
                </span>
                <span className="text-sm font-mono font-semibold text-foreground">
                  {config.formatScore(entry.score)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
