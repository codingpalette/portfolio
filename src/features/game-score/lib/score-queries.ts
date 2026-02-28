import { createClient } from "@shared/api/supabase/server";
import type { GameScore, GameType } from "@entities/game-score";
import { GAME_SCORE_CONFIGS } from "@entities/game-score";

export async function getLeaderboard(
  game: GameType,
  limit = 10,
  options?: { difficulty?: string },
): Promise<GameScore[]> {
  const supabase = await createClient();
  const config = GAME_SCORE_CONFIGS[game];

  let query = supabase
    .from("game_scores")
    .select("*")
    .eq("game", game)
    .order("score", { ascending: config.sortAsc })
    .limit(limit);

  if (game === "minesweeper" && options?.difficulty) {
    query = query.eq("metadata->>difficulty", options.difficulty);
  }

  const { data } = await query;
  return (data as GameScore[]) ?? [];
}

export async function getPersonalBests(
  userId: string,
  game: GameType,
): Promise<GameScore[]> {
  const supabase = await createClient();
  const config = GAME_SCORE_CONFIGS[game];

  const { data } = await supabase
    .from("game_scores")
    .select("*")
    .eq("user_id", userId)
    .eq("game", game)
    .order("score", { ascending: config.sortAsc })
    .limit(5);

  return (data as GameScore[]) ?? [];
}

interface GameStat {
  game: GameType;
  totalPlays: number;
  bestScore: number;
  avgScore: number;
}

export async function getUserGameStats(
  userId: string,
): Promise<GameStat[]> {
  const supabase = await createClient();
  const games: GameType[] = ["2048", "tetris", "snake", "racing", "minesweeper"];

  const stats: GameStat[] = [];

  for (const game of games) {
    const { data, count } = await supabase
      .from("game_scores")
      .select("score", { count: "exact" })
      .eq("user_id", userId)
      .eq("game", game);

    if (!data || data.length === 0) continue;

    const config = GAME_SCORE_CONFIGS[game];
    const scores = data.map((d) => d.score);
    const bestScore = config.sortAsc
      ? Math.min(...scores)
      : Math.max(...scores);
    const avgScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length,
    );

    stats.push({
      game,
      totalPlays: count ?? scores.length,
      bestScore,
      avgScore,
    });
  }

  return stats;
}
