"use client";

import { useEffect, useCallback, useRef } from "react";
import { use2048Store, Tile } from "./hooks/use-2048-store";
import { useSubmitScore } from "@features/game-score";

const TILE_COLORS: Record<number, string> = {
  2: "bg-gray-700 text-gray-200",
  4: "bg-gray-600 text-gray-100",
  8: "bg-orange-600 text-white",
  16: "bg-orange-500 text-white",
  32: "bg-orange-400 text-white",
  64: "bg-red-500 text-white",
  128: "bg-yellow-500 text-white",
  256: "bg-yellow-400 text-white",
  512: "bg-yellow-300 text-gray-900",
  1024: "bg-yellow-200 text-gray-900",
  2048: "bg-cyan-400 text-gray-900",
};

function getTileColor(value: number): string {
  if (value >= 4096) return "bg-purple-500 text-white";
  return TILE_COLORS[value] ?? "bg-gray-500 text-white";
}

function getTileFontSize(value: number): string {
  if (value >= 1024) return "text-xl font-bold";
  if (value >= 128) return "text-2xl font-bold";
  return "text-3xl font-bold";
}

function TileCell({ tile }: { tile: Tile }) {
  const color = getTileColor(tile.value);
  const fontSize = getTileFontSize(tile.value);
  const isSpecial = tile.value >= 2048;

  const colPercent = tile.col * 25;
  const rowPercent = tile.row * 25;

  return (
    <div
      className={`absolute flex items-center justify-center rounded-lg transition-all duration-100 ease-in-out ${color} ${fontSize} ${
        isSpecial ? "shadow-[0_0_20px_rgba(34,211,238,0.6)]" : ""
      } ${tile.isNew ? "animate-pop" : ""} ${tile.isMerged ? "animate-pulse-once" : ""}`}
      style={{
        width: "calc(25% - 8px)",
        height: "calc(25% - 8px)",
        left: `calc(${colPercent}% + 4px)`,
        top: `calc(${rowPercent}% + 4px)`,
      }}
    >
      {tile.value}
    </div>
  );
}

function Board() {
  const tiles = use2048Store((s) => s.tiles);

  return (
    <div className="relative aspect-square w-full max-w-[400px] rounded-xl bg-gray-800 p-1">
      {/* Background cells */}
      <div className="grid h-full grid-cols-4 grid-rows-4 gap-2 p-1">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-gray-700/50" />
        ))}
      </div>
      {/* Tiles overlay */}
      <div className="absolute inset-1">
        {tiles.map((tile) => (
          <TileCell key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
}

function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-w-[80px] flex-col items-center rounded-lg bg-gray-800 px-4 py-2">
      <span className="text-xs font-semibold tracking-widest text-gray-400">{label}</span>
      <span className="text-xl font-bold text-white">{value.toLocaleString()}</span>
    </div>
  );
}

function MenuOverlay() {
  const gameState = use2048Store((s) => s.gameState);
  const highScore = use2048Store((s) => s.highScore);
  const startGame = use2048Store((s) => s.startGame);

  const handleStart = useCallback(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (gameState !== "menu") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") handleStart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState, handleStart]);

  if (gameState !== "menu") return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-gray-950/80 backdrop-blur-sm">
      <div className="text-center">
        <h1 className="mb-2 text-7xl font-extrabold text-cyan-400">2048</h1>
        <p className="mb-6 text-gray-400">숫자 타일을 합쳐 2048을 만드세요!</p>
        {highScore > 0 && (
          <p className="mb-4 text-sm text-indigo-400">
            최고 점수: {highScore.toLocaleString()}
          </p>
        )}
        <button
          onClick={handleStart}
          className="rounded-xl border border-cyan-500/30 bg-cyan-500/20 px-8 py-3 text-lg font-semibold text-cyan-400 transition hover:bg-cyan-500/30 active:scale-95"
        >
          게임 시작
        </button>
        <p className="mt-4 text-xs text-gray-500">화살표 키 또는 스와이프로 이동 | SPACE로 시작</p>
      </div>
    </div>
  );
}

function GameOverOverlay() {
  const gameState = use2048Store((s) => s.gameState);
  const score = use2048Store((s) => s.score);
  const highScore = use2048Store((s) => s.highScore);
  const startGame = use2048Store((s) => s.startGame);

  const handleRestart = useCallback(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (gameState !== "gameover") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") handleRestart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState, handleRestart]);

  if (gameState !== "gameover") return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-gray-950/80 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="mb-2 text-5xl font-extrabold text-red-400">게임 오버</h2>
        <p className="mb-1 text-2xl font-bold text-white">{score.toLocaleString()} 점</p>
        {score > 0 && score >= highScore && (
          <p className="mb-3 text-sm font-semibold text-yellow-400">새로운 최고 점수!</p>
        )}
        <p className="mb-6 text-sm text-gray-400">최고 점수: {highScore.toLocaleString()}</p>
        <button
          onClick={handleRestart}
          className="rounded-xl border border-cyan-500/30 bg-cyan-500/20 px-8 py-3 text-lg font-semibold text-cyan-400 transition hover:bg-cyan-500/30 active:scale-95"
        >
          다시 시작
        </button>
        <p className="mt-3 text-xs text-gray-500">SPACE로 재시작</p>
      </div>
    </div>
  );
}

function WinOverlay() {
  const gameState = use2048Store((s) => s.gameState);
  const score = use2048Store((s) => s.score);
  const continueGame = use2048Store((s) => s.continueGame);
  const startGame = use2048Store((s) => s.startGame);

  if (gameState !== "win") return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-gray-950/80 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="mb-2 text-5xl font-extrabold text-cyan-400">달성!</h2>
        <p className="mb-1 text-xl text-white">2048 타일을 만들었습니다!</p>
        <p className="mb-6 text-sm text-gray-400">점수: {score.toLocaleString()}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={continueGame}
            className="rounded-xl border border-cyan-500/30 bg-cyan-500/20 px-6 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500/30 active:scale-95"
          >
            계속하기
          </button>
          <button
            onClick={startGame}
            className="rounded-xl border border-gray-600 bg-gray-700 px-6 py-3 font-semibold text-gray-200 transition hover:bg-gray-600 active:scale-95"
          >
            새 게임
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Game2048() {
  const gameState = use2048Store((s) => s.gameState);
  const score = use2048Store((s) => s.score);
  const highScore = use2048Store((s) => s.highScore);
  const move = use2048Store((s) => s.move);
  const startGame = use2048Store((s) => s.startGame);
  const undoMove = use2048Store((s) => s.undoMove);
  const history = use2048Store((s) => s.history);

  const { submitScore, resetSubmission } = useSubmitScore("2048");

  // Score submission
  useEffect(() => {
    if (gameState === "gameover" || gameState === "win") {
      const maxTile = Math.max(...use2048Store.getState().tiles.map((t) => t.value));
      submitScore(score, { max_tile: maxTile });
    }
    if (gameState === "playing") {
      resetSubmission();
    }
  }, [gameState, score, submitScore, resetSubmission]);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== "playing") return;

    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          move("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          move("down");
          break;
        case "ArrowLeft":
          e.preventDefault();
          move("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          move("right");
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState, move]);

  // Touch controls
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current || gameState !== "playing") return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) < 30) return;

      if (absDx > absDy) {
        move(dx > 0 ? "right" : "left");
      } else {
        move(dy > 0 ? "down" : "up");
      }
      touchStartRef.current = null;
    },
    [gameState, move]
  );

  const isPlaying = gameState === "playing" || gameState === "win" || gameState === "gameover";

  return (
    <div
      className="relative flex h-[calc(100vh-60px)] mt-[60px] w-full flex-col items-center justify-center bg-gray-950"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="mb-4 flex w-full max-w-[400px] items-center justify-between px-1">
        <h1 className="text-3xl font-extrabold text-cyan-400">2048</h1>
        <div className="flex gap-2">
          <ScoreBox label="점수" value={score} />
          <ScoreBox label="최고" value={highScore} />
        </div>
      </div>

      {/* Controls row */}
      {isPlaying && (
        <div className="mb-3 flex w-full max-w-[400px] items-center justify-between px-1">
          <button
            onClick={startGame}
            className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-1.5 text-sm text-gray-300 transition hover:bg-gray-700 active:scale-95"
          >
            새 게임
          </button>
          <button
            onClick={undoMove}
            disabled={history.length === 0}
            className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-1.5 text-sm text-gray-300 transition hover:bg-gray-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            되돌리기
          </button>
        </div>
      )}

      {/* Board */}
      <div className="relative w-full max-w-[400px] px-2">
        <Board />
        <MenuOverlay />
        <GameOverOverlay />
        <WinOverlay />
      </div>

      {/* Hint */}
      {gameState === "playing" && (
        <p className="mt-4 text-xs text-gray-600">화살표 키 또는 스와이프로 이동</p>
      )}
    </div>
  );
}
