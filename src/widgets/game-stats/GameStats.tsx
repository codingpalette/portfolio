import { GAME_SCORE_CONFIGS, type GameType } from "@entities/game-score";

interface GameStat {
  game: GameType;
  totalPlays: number;
  bestScore: number;
  avgScore: number;
}

interface GameStatsProps {
  stats: GameStat[];
}

export default function GameStats({ stats }: GameStatsProps) {
  if (stats.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-semibold text-white">게임 통계</h2>
        <p className="text-sm text-gray-500">아직 게임 기록이 없습니다. 게임을 플레이해보세요!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="mb-4 text-lg font-semibold text-white">게임 통계</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const config = GAME_SCORE_CONFIGS[stat.game];
          return (
            <div
              key={stat.game}
              className="rounded-lg border border-white/5 bg-white/5 p-4"
            >
              <p className="mb-2 text-sm font-medium text-cyan-400">{config.label}</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">최고 점수</span>
                  <span className="text-sm font-mono font-semibold text-white">
                    {config.formatScore(stat.bestScore)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">평균 점수</span>
                  <span className="text-sm font-mono text-gray-400">
                    {config.formatScore(stat.avgScore)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">플레이 횟수</span>
                  <span className="text-sm font-mono text-gray-400">
                    {stat.totalPlays}회
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
