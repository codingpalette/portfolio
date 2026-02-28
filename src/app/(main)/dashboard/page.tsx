import DashboardView from "@views/dashboard/DashboardView";
import { getLeaderboard, getUserGameStats } from "@features/game-score";
import { GameStats } from "@widgets/game-stats";
import { Leaderboard } from "@widgets/leaderboard";
import { createClient } from "@shared/api/supabase/server";
import type { GameType, GameScore } from "@entities/game-score";

const GAMES: GameType[] = ["2048", "tetris", "snake", "racing", "minesweeper"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [leaderboards, stats] = await Promise.all([
    Promise.all(GAMES.map((game) => getLeaderboard(game))),
    user ? getUserGameStats(user.id) : Promise.resolve([]),
  ]);

  const scoresByGame = GAMES.reduce(
    (acc, game, i) => {
      acc[game] = leaderboards[i];
      return acc;
    },
    {} as Record<GameType, GameScore[]>,
  );

  return (
    <DashboardView
      gameStatsSlot={user ? <GameStats stats={stats} /> : undefined}
      leaderboardSlot={
        <Leaderboard scoresByGame={scoresByGame} currentUserId={user?.id} />
      }
    />
  );
}
