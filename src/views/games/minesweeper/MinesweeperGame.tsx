"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSubmitScore } from "@features/game-score";
import {
  useMinesweeperStore,
  DIFFICULTY_CONFIGS,
  type Difficulty,
  type Cell,
  type BestTimes,
} from "./hooks/use-minesweeper-store";

const NUMBER_COLORS: Record<number, string> = {
  1: "text-blue-600 dark:text-blue-400",
  2: "text-green-600 dark:text-green-400",
  3: "text-red-600 dark:text-red-400",
  4: "text-purple-600 dark:text-purple-400",
  5: "text-orange-600 dark:text-orange-400",
  6: "text-cyan-600 dark:text-cyan-400",
  7: "text-pink-600 dark:text-pink-400",
  8: "text-gray-600 dark:text-gray-400",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function CellView({
  cell,
  row,
  col,
  isGameOver,
  onReveal,
  onFlag,
}: {
  cell: Cell;
  row: number;
  col: number;
  isGameOver: boolean;
  onReveal: (r: number, c: number) => void;
  onFlag: (r: number, c: number) => void;
}) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onFlag(row, col);
    },
    [row, col, onFlag]
  );

  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      onFlag(row, col);
    }, 500);
  }, [row, col, onFlag]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    onReveal(row, col);
  }, [row, col, onReveal]);

  if (cell.state === "revealed") {
    if (cell.hasMine) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-red-800 border border-red-900 text-base select-none rounded-sm">
          💣
        </div>
      );
    }
    if (cell.adjacentMines === 0) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-muted dark:bg-gray-800 border border-border select-none rounded-sm" />
      );
    }
    return (
      <div
        className={`flex items-center justify-center w-full h-full bg-muted dark:bg-gray-800 border border-border font-bold text-sm select-none rounded-sm ${NUMBER_COLORS[cell.adjacentMines] ?? "text-foreground"}`}
      >
        {cell.adjacentMines}
      </div>
    );
  }

  if (cell.state === "flagged") {
    return (
      <button
        className="flex items-center justify-center w-full h-full bg-muted dark:bg-gray-700 border-t-2 border-l-2 border-border border-b-2 border-r-2 border-b-border border-r-border text-base select-none rounded-sm cursor-pointer active:scale-95"
        onClick={handleContextMenu}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        🚩
      </button>
    );
  }

  // Hidden cell
  return (
    <button
      className="flex items-center justify-center w-full h-full bg-muted dark:bg-gray-700 border-t-2 border-l-2 border-border border-b-2 border-r-2 border-b-border border-r-border select-none rounded-sm cursor-pointer hover:bg-accent dark:hover:bg-gray-600 active:bg-muted/70 dark:active:bg-gray-800 active:border-border transition-colors"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
}

function MenuOverlay() {
  const { difficulty, selectDifficulty, startGame } = useMinesweeperStore();

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 dark:bg-gray-950/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 p-8 bg-card dark:bg-gray-900 rounded-2xl border border-border shadow-2xl w-80">
        <div className="text-center">
          <div className="text-5xl mb-3">💣</div>
          <h1 className="text-2xl font-bold text-foreground mb-1">지뢰찾기</h1>
          <p className="text-muted-foreground text-sm">지뢰를 피해 모든 칸을 열어보세요!</p>
        </div>

        <div className="w-full">
          <p className="text-muted-foreground text-xs mb-2 text-center">난이도 선택</p>
          <div className="flex flex-col gap-2">
            {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((d) => {
              const config = DIFFICULTY_CONFIGS[d];
              return (
                <button
                  key={d}
                  onClick={() => selectDifficulty(d)}
                  className={`w-full py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                    difficulty === d
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-700 dark:text-cyan-300"
                      : "bg-muted dark:bg-gray-800 border-border text-foreground hover:border-border hover:bg-accent dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="font-bold">{config.label}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {config.cols}×{config.rows} / 지뢰 {config.mines}개
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={startGame}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-lg transition-colors text-base"
        >
          게임 시작
        </button>
      </div>
    </div>
  );
}

function GameOverOverlay({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-red-950/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 bg-card dark:bg-gray-900 rounded-2xl border border-red-700 shadow-2xl">
        <div className="text-5xl">😵</div>
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">GAME OVER</h2>
        <p className="text-muted-foreground text-sm">지뢰를 밟았어요!</p>
        <button
          onClick={onRestart}
          className="px-6 py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg transition-colors"
        >
          다시 시작
        </button>
      </div>
    </div>
  );
}

function WinOverlay({
  timer,
  bestTimes,
  difficulty,
  onRestart,
}: {
  timer: number;
  bestTimes: BestTimes;
  difficulty: Difficulty;
  onRestart: () => void;
}) {
  const best = bestTimes[difficulty];
  const isNewBest = best === timer;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-cyan-950/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 bg-card dark:bg-gray-900 rounded-2xl border border-cyan-600 shadow-2xl">
        <div className="text-5xl">😎</div>
        <h2 className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">클리어!</h2>
        <p className="text-foreground text-sm">
          클리어 시간:{" "}
          <span className="font-bold text-foreground">{formatTime(timer)}</span>
        </p>
        {isNewBest && (
          <p className="text-yellow-600 dark:text-yellow-400 text-xs font-bold">★ 최고 기록 갱신!</p>
        )}
        {best !== undefined && !isNewBest && (
          <p className="text-muted-foreground text-xs">
            최고 기록: {formatTime(best)}
          </p>
        )}
        <button
          onClick={onRestart}
          className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-lg transition-colors"
        >
          다시 시작
        </button>
      </div>
    </div>
  );
}

export default function MinesweeperGame() {
  const {
    gameState,
    difficulty,
    grid,
    rows,
    cols,
    mines,
    flagCount,
    timer,
    bestTimes,
    selectDifficulty,
    startGame,
    revealCell,
    toggleFlag,
    resetGame,
    goToMenu,
  } = useMinesweeperStore();

  const { submitScore, resetSubmission } = useSubmitScore("minesweeper");

  useEffect(() => {
    if (gameState === "win") {
      submitScore(timer, { difficulty });
    }
    if (gameState === "playing") {
      resetSubmission();
    }
  }, [gameState, timer, difficulty, submitScore, resetSubmission]);

  // Determine cell size based on difficulty
  const cellSize =
    difficulty === "expert"
      ? "w-7 h-7 min-w-7 min-h-7 text-xs"
      : difficulty === "intermediate"
        ? "w-8 h-8 min-w-8 min-h-8 text-sm"
        : "w-9 h-9 min-w-9 min-h-9 text-sm";

  const faceEmoji =
    gameState === "gameover" ? "😵" : gameState === "win" ? "😎" : "😀";

  const mineCounter = mines - flagCount;

  return (
    <div
      className="relative flex flex-col items-center justify-start bg-background overflow-auto"
      style={{ height: "calc(100vh - 60px)", marginTop: "60px" }}
    >
      {/* Menu Overlay */}
      {gameState === "menu" && <MenuOverlay />}

      {/* Game Over Overlay */}
      {gameState === "gameover" && <GameOverOverlay onRestart={resetGame} />}

      {/* Win Overlay */}
      {gameState === "win" && (
        <WinOverlay
          timer={timer}
          bestTimes={bestTimes}
          difficulty={difficulty}
          onRestart={resetGame}
        />
      )}

      {/* Game UI */}
      <div className="flex flex-col items-center gap-3 p-4 w-full">
        {/* Difficulty Selector */}
        <div className="flex gap-2">
          {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                selectDifficulty(d);
                if (gameState !== "menu") startGame();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                difficulty === d
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-700 dark:text-cyan-300"
                  : "bg-muted dark:bg-gray-800 border-border text-muted-foreground hover:border-border"
              }`}
            >
              {DIFFICULTY_CONFIGS[d].label}
            </button>
          ))}
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between w-full max-w-fit bg-card dark:bg-gray-900 rounded-xl border border-border px-4 py-2 gap-6">
          {/* Mine counter */}
          <div className="flex items-center gap-1.5 min-w-16">
            <span className="text-lg">💣</span>
            <span className="font-mono font-bold text-red-600 dark:text-red-400 text-lg tabular-nums">
              {String(Math.max(0, mineCounter)).padStart(3, "0")}
            </span>
          </div>

          {/* Face / Reset button */}
          <button
            onClick={gameState === "menu" ? startGame : resetGame}
            className="text-2xl hover:scale-110 active:scale-95 transition-transform"
            title="새 게임"
          >
            {faceEmoji}
          </button>

          {/* Timer */}
          <div className="flex items-center gap-1.5 min-w-16 justify-end">
            <span className="font-mono font-bold text-green-600 dark:text-green-400 text-lg tabular-nums">
              {String(Math.min(999, timer)).padStart(3, "0")}
            </span>
            <span className="text-lg">⏱</span>
          </div>
        </div>

        {/* Game Board */}
        {grid.length > 0 && (
          <div
            className="border-2 border-border rounded-lg overflow-hidden select-none"
            onContextMenu={(e) => e.preventDefault()}
          >
            <div
              className="grid gap-0"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {grid.map((row, ri) =>
                row.map((cell, ci) => (
                  <div
                    key={`${ri}-${ci}`}
                    className={`${cellSize} p-0`}
                  >
                    <CellView
                      cell={cell}
                      row={ri}
                      col={ci}
                      isGameOver={gameState === "gameover"}
                      onReveal={revealCell}
                      onFlag={toggleFlag}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Back to menu button */}
        <button
          onClick={goToMenu}
          className="text-xs text-muted-foreground hover:text-foreground underline transition-colors mt-1"
        >
          메뉴로 돌아가기
        </button>

        {/* Best times */}
        {Object.keys(bestTimes).length > 0 && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((d) =>
              bestTimes[d] !== undefined ? (
                <span key={d}>
                  {DIFFICULTY_CONFIGS[d].label}: {formatTime(bestTimes[d]!)}
                </span>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
