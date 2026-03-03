"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSubmitScore } from "@features/game-score";
import {
  useTetrisStore,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PIECE_COLORS,
  getCells,
  type TetrominoType,
  type Cell,
} from "./hooks/use-tetris-store";

// ─── Board Cell ───────────────────────────────────────────────────────────────

const CELL_SIZE = 32; // px, used for inline styles fallback

function BoardCell({ type, ghost }: { type: Cell | "ghost"; ghost?: boolean }) {
  if (!type) {
    return (
      <div className="border border-border bg-card/50 dark:bg-gray-900/50" />
    );
  }
  if (type === "ghost") {
    return (
      <div
        className="border border-border bg-transparent"
        style={{ boxShadow: "inset 0 0 0 2px rgba(128,128,128,0.15)" }}
      />
    );
  }
  const color = PIECE_COLORS[type as TetrominoType];
  return (
    <div
      className="border border-border/30"
      style={{
        backgroundColor: color,
        boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.2), 0 0 6px ${color}66`,
      }}
    />
  );
}

// ─── Mini Piece Preview ───────────────────────────────────────────────────────

function MiniPiece({ type }: { type: TetrominoType | null }) {
  if (!type) {
    return <div className="h-16 w-16" />;
  }

  // Get the shape for rotation 0
  const shapes: Record<TetrominoType, number[][]> = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]],
  };

  const shape = shapes[type];
  const color = PIECE_COLORS[type];

  return (
    <div className="flex flex-col items-center justify-center gap-0.5">
      {shape.map((row, r) => (
        <div key={r} className="flex gap-0.5">
          {row.map((cell, c) => (
            <div
              key={c}
              className="h-4 w-4 rounded-sm"
              style={
                cell
                  ? {
                      backgroundColor: color,
                      boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.2)`,
                    }
                  : { backgroundColor: "transparent" }
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────

function Board() {
  const board = useTetrisStore((s) => s.board);
  const current = useTetrisStore((s) => s.current);
  const getGhostY = useTetrisStore((s) => s.getGhostY);

  // Build display grid
  const display: (Cell | "ghost")[][] = board.map((row) => [...row]) as (Cell | "ghost")[][];

  // Draw ghost
  if (current) {
    const ghostY = getGhostY();
    if (ghostY !== null) {
      const ghostPiece = { ...current, pos: { ...current.pos, y: ghostY } };
      getCells(ghostPiece).forEach(({ x, y }) => {
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          if (!display[y][x]) display[y][x] = "ghost";
        }
      });
    }

    // Draw current piece (overwrites ghost if same cell)
    getCells(current).forEach(({ x, y }) => {
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        display[y][x] = current.type;
      }
    });
  }

  return (
    <div
      className="relative border border-border bg-card dark:bg-gray-900"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
      }}
    >
      {display.map((row, r) =>
        row.map((cell, c) => (
          <BoardCell key={`${r}-${c}`} type={cell} />
        ))
      )}
    </div>
  );
}

// ─── Side Panel ───────────────────────────────────────────────────────────────

function SidePanel() {
  const score = useTetrisStore((s) => s.score);
  const level = useTetrisStore((s) => s.level);
  const lines = useTetrisStore((s) => s.lines);
  const highScore = useTetrisStore((s) => s.highScore);
  const next = useTetrisStore((s) => s.next);
  const held = useTetrisStore((s) => s.held);
  const canHold = useTetrisStore((s) => s.canHold);

  return (
    <div className="flex w-36 flex-col gap-3">
      {/* Hold */}
      <div className="rounded-lg border border-border bg-card dark:bg-gray-900/80 p-3">
        <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground">
          HOLD
        </p>
        <div className={`flex min-h-[52px] items-center justify-center transition-opacity ${canHold ? "opacity-100" : "opacity-40"}`}>
          <MiniPiece type={held} />
        </div>
      </div>

      {/* Next */}
      <div className="rounded-lg border border-border bg-card dark:bg-gray-900/80 p-3">
        <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground">
          NEXT
        </p>
        <div className="flex min-h-[52px] items-center justify-center">
          <MiniPiece type={next} />
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-lg border border-border bg-card dark:bg-gray-900/80 p-3 space-y-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">SCORE</p>
          <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{score.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">BEST</p>
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{highScore.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">LEVEL</p>
          <p className="text-lg font-bold text-foreground">{level}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">LINES</p>
          <p className="text-lg font-bold text-foreground">{lines}</p>
        </div>
      </div>

      {/* Controls hint */}
      <div className="rounded-lg border border-border bg-card/40 dark:bg-gray-900/40 p-3">
        <p className="mb-1.5 text-xs font-semibold tracking-widest text-muted-foreground">KEYS</p>
        <div className="space-y-0.5 text-xs text-muted-foreground">
          <p>← → 이동</p>
          <p>↓ 소프트</p>
          <p>↑ / X 회전</p>
          <p>Z 역회전</p>
          <p>SPACE 즉시</p>
          <p>C 홀드</p>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Controls ──────────────────────────────────────────────────────────

function MobileControls() {
  const gameState = useTetrisStore((s) => s.gameState);
  const moveLeft = useTetrisStore((s) => s.moveLeft);
  const moveRight = useTetrisStore((s) => s.moveRight);
  const softDrop = useTetrisStore((s) => s.softDrop);
  const hardDrop = useTetrisStore((s) => s.hardDrop);
  const rotateClockwise = useTetrisStore((s) => s.rotateClockwise);
  const holdPiece = useTetrisStore((s) => s.holdPiece);

  if (gameState !== "playing") return null;

  const btnClass =
    "flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted/50 dark:bg-white/10 text-xl text-foreground backdrop-blur-sm active:bg-white/25 select-none touch-none";

  return (
    <div className="pointer-events-auto absolute bottom-4 left-0 right-0 flex items-end justify-center gap-3 sm:hidden px-4">
      {/* Hold */}
      <button onTouchStart={(e) => { e.preventDefault(); holdPiece(); }} className={btnClass}>
        C
      </button>
      {/* Left */}
      <button onTouchStart={(e) => { e.preventDefault(); moveLeft(); }} className={btnClass}>
        ←
      </button>
      {/* Soft drop */}
      <button onTouchStart={(e) => { e.preventDefault(); softDrop(); }} className={btnClass}>
        ↓
      </button>
      {/* Right */}
      <button onTouchStart={(e) => { e.preventDefault(); moveRight(); }} className={btnClass}>
        →
      </button>
      {/* Rotate */}
      <button onTouchStart={(e) => { e.preventDefault(); rotateClockwise(); }} className={btnClass}>
        ↻
      </button>
      {/* Hard drop */}
      <button onTouchStart={(e) => { e.preventDefault(); hardDrop(); }} className={`${btnClass} w-14 bg-cyan-500/20 border-cyan-500/30 text-cyan-400`}>
        ⬇
      </button>
    </div>
  );
}

// ─── Menu Overlay ─────────────────────────────────────────────────────────────

function MenuOverlay() {
  const gameState = useTetrisStore((s) => s.gameState);
  const highScore = useTetrisStore((s) => s.highScore);
  const start = useTetrisStore((s) => s.start);

  const handleStart = useCallback(() => start(), [start]);

  useEffect(() => {
    if (gameState !== "menu") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState, handleStart]);

  // Load high score on mount
  useEffect(() => {
    useTetrisStore.setState({
      highScore: parseInt(
        typeof window !== "undefined"
          ? (localStorage.getItem("tetris-highscore") ?? "0")
          : "0",
        10
      ) || 0,
    });
  }, []);

  if (gameState !== "menu") return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="text-center px-6">
        <h1 className="mb-2 text-5xl font-bold tracking-tight text-foreground">
          <span className="text-cyan-600 dark:text-cyan-400">테트</span>
          <span className="text-indigo-600 dark:text-indigo-400">리스</span>
        </h1>
        <p className="mb-6 text-muted-foreground">블록을 쌓아 줄을 완성하세요</p>
        {highScore > 0 && (
          <p className="mb-4 text-sm text-indigo-600 dark:text-indigo-400">
            최고 점수: {highScore.toLocaleString()}
          </p>
        )}
        <button
          onClick={handleStart}
          className="rounded-xl border border-cyan-500/30 bg-cyan-500/20 px-8 py-3 text-lg font-semibold text-cyan-400 transition hover:bg-cyan-500/30 active:scale-95"
        >
          게임 시작
        </button>
        <p className="mt-4 text-xs text-muted-foreground">
          SPACE 또는 ENTER로 시작
        </p>
      </div>
    </div>
  );
}

// ─── Game Over Overlay ────────────────────────────────────────────────────────

function GameOverOverlay() {
  const gameState = useTetrisStore((s) => s.gameState);
  const score = useTetrisStore((s) => s.score);
  const highScore = useTetrisStore((s) => s.highScore);
  const start = useTetrisStore((s) => s.start);

  const handleRestart = useCallback(() => start(), [start]);

  useEffect(() => {
    if (gameState !== "gameover") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState, handleRestart]);

  if (gameState !== "gameover") return null;

  const isNewRecord = score > 0 && score >= highScore;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="text-center px-6">
        <h2 className="mb-2 text-4xl font-bold text-red-600 dark:text-red-400">게임 오버</h2>
        <p className="mb-1 text-2xl font-bold text-foreground">
          {score.toLocaleString()} 점
        </p>
        {isNewRecord && (
          <p className="mb-3 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
            신기록 달성!
          </p>
        )}
        <p className="mb-6 text-sm text-muted-foreground">
          최고 점수: {highScore.toLocaleString()}
        </p>
        <button
          onClick={handleRestart}
          className="rounded-xl border border-cyan-500/30 bg-cyan-500/20 px-8 py-3 text-lg font-semibold text-cyan-400 transition hover:bg-cyan-500/30 active:scale-95"
        >
          다시 시작
        </button>
        <p className="mt-3 text-xs text-muted-foreground">SPACE로 재시작</p>
      </div>
    </div>
  );
}

// ─── Game Loop ────────────────────────────────────────────────────────────────

function GameLoop() {
  const tick = useTetrisStore((s) => s.tick);
  const gameState = useTetrisStore((s) => s.gameState);
  const gravityMs = useTetrisStore((s) => s.gravityMs);

  useEffect(() => {
    if (gameState !== "playing") return;
    const id = setInterval(tick, gravityMs);
    return () => clearInterval(id);
  }, [gameState, gravityMs, tick]);

  return null;
}

// ─── Keyboard Handler ─────────────────────────────────────────────────────────

function KeyboardHandler() {
  const moveLeft = useTetrisStore((s) => s.moveLeft);
  const moveRight = useTetrisStore((s) => s.moveRight);
  const softDrop = useTetrisStore((s) => s.softDrop);
  const hardDrop = useTetrisStore((s) => s.hardDrop);
  const rotateClockwise = useTetrisStore((s) => s.rotateClockwise);
  const rotateCounter = useTetrisStore((s) => s.rotateCounter);
  const holdPiece = useTetrisStore((s) => s.holdPiece);
  const gameState = useTetrisStore((s) => s.gameState);

  // DAS (Delayed Auto Shift) state
  const dasRef = useRef<{ key: string; timeout: ReturnType<typeof setTimeout> | null; interval: ReturnType<typeof setInterval> | null }>({
    key: "",
    timeout: null,
    interval: null,
  });

  const clearDas = useCallback(() => {
    if (dasRef.current.timeout) clearTimeout(dasRef.current.timeout);
    if (dasRef.current.interval) clearInterval(dasRef.current.interval);
    dasRef.current.timeout = null;
    dasRef.current.interval = null;
    dasRef.current.key = "";
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent page scroll
      if (["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowLeft":
          if (dasRef.current.key !== "ArrowLeft") {
            clearDas();
            moveLeft();
            dasRef.current.key = "ArrowLeft";
            dasRef.current.timeout = setTimeout(() => {
              dasRef.current.interval = setInterval(moveLeft, 50);
            }, 170);
          }
          break;
        case "ArrowRight":
          if (dasRef.current.key !== "ArrowRight") {
            clearDas();
            moveRight();
            dasRef.current.key = "ArrowRight";
            dasRef.current.timeout = setTimeout(() => {
              dasRef.current.interval = setInterval(moveRight, 50);
            }, 170);
          }
          break;
        case "ArrowDown":
          softDrop();
          break;
        case "ArrowUp":
        case "x":
        case "X":
          rotateClockwise();
          break;
        case "z":
        case "Z":
          rotateCounter();
          break;
        case " ":
          hardDrop();
          break;
        case "c":
        case "C":
          holdPiece();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        clearDas();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearDas();
    };
  }, [gameState, moveLeft, moveRight, softDrop, hardDrop, rotateClockwise, rotateCounter, holdPiece, clearDas]);

  return null;
}

// ─── Main Game ────────────────────────────────────────────────────────────────

export default function TetrisGame() {
  const score = useTetrisStore((s) => s.score);
  const lines = useTetrisStore((s) => s.lines);
  const level = useTetrisStore((s) => s.level);
  const gameState = useTetrisStore((s) => s.gameState);
  const { submitScore, resetSubmission } = useSubmitScore("tetris");

  useEffect(() => {
    if (gameState === "gameover") {
      submitScore(score, { lines, level });
    }
    if (gameState === "playing") {
      resetSubmission();
    }
  }, [gameState, score, lines, level, submitScore, resetSubmission]);

  return (
    <div className="relative h-[calc(100vh-60px)] mt-[60px] w-full bg-background flex items-center justify-center overflow-hidden">
      <GameLoop />
      <KeyboardHandler />

      {/* Game area */}
      <div className="flex items-start gap-4">
        <Board />
        <SidePanel />
      </div>

      <MenuOverlay />
      <GameOverOverlay />
      <MobileControls />
    </div>
  );
}
