"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSnakeStore, Direction, Point } from "./hooks/use-snake-store";
import { useSubmitScore } from "@features/game-score";

const CELL_SIZE = 24;

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getThemeColors() {
  const isDark = document.documentElement.classList.contains("dark");
  return {
    background: isDark ? "#030712" : "#f8fafc",
    gridLine: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)",
  };
}

function drawCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  snake: Point[],
  food: Point,
  direction: string,
  gridSize: number,
  cellSize: number,
  dpr: number
) {
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  const themeColors = getThemeColors();

  // Background
  ctx.fillStyle = themeColors.background;
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = themeColors.gridLine;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, gridSize * cellSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(gridSize * cellSize, i * cellSize);
    ctx.stroke();
  }

  // Food glow
  const fx = food.x * cellSize + cellSize / 2;
  const fy = food.y * cellSize + cellSize / 2;
  const foodGlow = ctx.createRadialGradient(fx, fy, 0, fx, fy, cellSize);
  foodGlow.addColorStop(0, "rgba(239,68,68,0.6)");
  foodGlow.addColorStop(1, "rgba(239,68,68,0)");
  ctx.fillStyle = foodGlow;
  ctx.beginPath();
  ctx.arc(fx, fy, cellSize, 0, Math.PI * 2);
  ctx.fill();

  // Food circle
  ctx.fillStyle = "#ef4444";
  ctx.shadowColor = "#f87171";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(fx, fy, cellSize * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Food shine
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath();
  ctx.arc(fx - cellSize * 0.1, fy - cellSize * 0.1, cellSize * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Snake body segments (tail to head-1)
  for (let i = snake.length - 1; i >= 1; i--) {
    const seg = snake[i];
    const t = i / snake.length;
    const g = Math.floor(120 + (1 - t) * 100);
    ctx.fillStyle = `rgb(34,${g},34)`;
    const pad = 2;
    drawRoundedRect(
      ctx,
      seg.x * cellSize + pad,
      seg.y * cellSize + pad,
      cellSize - pad * 2,
      cellSize - pad * 2,
      4
    );
    ctx.fill();

    // Inner highlight
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    drawRoundedRect(
      ctx,
      seg.x * cellSize + pad,
      seg.y * cellSize + pad,
      cellSize - pad * 2,
      (cellSize - pad * 2) / 2,
      4
    );
    ctx.fill();
  }

  // Snake head
  if (snake.length > 0) {
    const head = snake[0];
    const hx = head.x * cellSize;
    const hy = head.y * cellSize;

    ctx.fillStyle = "#22c55e";
    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 6;
    drawRoundedRect(ctx, hx + 1, hy + 1, cellSize - 2, cellSize - 2, 5);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Head highlight
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    drawRoundedRect(ctx, hx + 1, hy + 1, cellSize - 2, (cellSize - 2) / 2, 5);
    ctx.fill();

    // Eyes based on direction
    ctx.fillStyle = "#111827";
    const eyeR = cellSize * 0.1;
    let eye1: Point, eye2: Point;
    const c = cellSize / 2;
    switch (direction) {
      case "RIGHT":
        eye1 = { x: hx + c + 4, y: hy + c - 4 };
        eye2 = { x: hx + c + 4, y: hy + c + 4 };
        break;
      case "LEFT":
        eye1 = { x: hx + c - 4, y: hy + c - 4 };
        eye2 = { x: hx + c - 4, y: hy + c + 4 };
        break;
      case "UP":
        eye1 = { x: hx + c - 4, y: hy + c - 4 };
        eye2 = { x: hx + c + 4, y: hy + c - 4 };
        break;
      case "DOWN":
        eye1 = { x: hx + c - 4, y: hy + c + 4 };
        eye2 = { x: hx + c + 4, y: hy + c + 4 };
        break;
      default:
        eye1 = { x: hx + c + 4, y: hy + c - 4 };
        eye2 = { x: hx + c + 4, y: hy + c + 4 };
    }
    ctx.beginPath();
    ctx.arc(eye1.x, eye1.y, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eye2.x, eye2.y, eyeR, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.arc(eye1.x - 1, eye1.y - 1, eyeR * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eye2.x - 1, eye2.y - 1, eyeR * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const cellSizeRef = useRef(CELL_SIZE);

  const {
    gameState,
    snake,
    food,
    direction,
    score,
    highScore,
    speed,
    gridSize,
    foodEaten,
    startGame,
    enqueueDirection,
    tick,
    resetGame,
  } = useSnakeStore();

  const { submitScore, resetSubmission } = useSubmitScore("snake");

  useEffect(() => {
    if (gameState === "gameover") {
      submitScore(score, { food_eaten: foodEaten });
    }
    if (gameState === "playing") {
      resetSubmission();
    }
  }, [gameState, score, foodEaten, submitScore, resetSubmission]);

  // Resize canvas to fit container maintaining square aspect ratio
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const maxSize = Math.min(container.clientWidth, container.clientHeight - 60);
    const cellSize = Math.floor(maxSize / gridSize);
    const size = cellSize * gridSize;

    cellSizeRef.current = cellSize;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, [gridSize]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    drawCanvas(ctx, canvas, snake, food, direction, gridSize, cellSizeRef.current, dpr);
  }, [snake, food, direction, gridSize]);

  // Game tick interval
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (gameState === "playing") {
      intervalRef.current = setInterval(tick, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameState, speed, tick]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
        W: "UP",
        S: "DOWN",
        A: "LEFT",
        D: "RIGHT",
      };

      if (map[e.key]) {
        e.preventDefault();
        if (gameState === "playing") {
          enqueueDirection(map[e.key]);
        }
      }

      if ((e.key === " " || e.key === "Enter") && gameState !== "playing") {
        e.preventDefault();
        if (gameState === "menu") startGame();
        else if (gameState === "gameover") startGame();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, enqueueDirection, startGame]);

  // Touch/swipe controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;

    if (gameState !== "playing") {
      startGame();
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      enqueueDirection(dx > 0 ? "RIGHT" : "LEFT");
    } else {
      enqueueDirection(dy > 0 ? "DOWN" : "UP");
    }
  };

  const handleDpad = (dir: Direction) => {
    if (gameState === "playing") {
      enqueueDirection(dir);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start bg-background h-[calc(100vh-60px)] mt-[60px] select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* HUD */}
      <div className="flex items-center justify-between w-full max-w-xl px-4 py-3">
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground text-xs font-medium tracking-widest uppercase">점수</span>
          <span className="text-cyan-600 dark:text-cyan-400 text-2xl font-bold tabular-nums">{score}</span>
        </div>
        <div className="text-muted-foreground text-lg font-bold tracking-wider">뱀 게임</div>
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground text-xs font-medium tracking-widest uppercase">최고</span>
          <span className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold tabular-nums">{highScore}</span>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center flex-1 w-full"
      >
        <canvas
          ref={canvasRef}
          className="rounded-lg border border-border shadow-2xl shadow-cyan-950/30"
        />

        {/* Menu overlay */}
        {gameState === "menu" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 dark:bg-gray-950/85 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center gap-6 px-8 py-10 rounded-2xl border border-border bg-card dark:bg-gray-900/80 shadow-2xl max-w-xs w-full mx-4">
              <div className="text-6xl">🐍</div>
              <div className="text-center">
                <h1 className="text-foreground text-3xl font-bold mb-2">뱀 게임</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  먹이를 먹고 최대한 길게 자라세요!
                </p>
              </div>
              <div className="text-muted-foreground text-xs text-center space-y-1">
                <p>방향키 / WASD 로 조작</p>
                <p>모바일: 스와이프 또는 버튼</p>
              </div>
              <button
                onClick={startGame}
                className="w-full py-3 px-6 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl transition-colors text-lg"
              >
                시작하기
              </button>
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 dark:bg-gray-950/85 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center gap-6 px-8 py-10 rounded-2xl border border-border bg-card dark:bg-gray-900/80 shadow-2xl max-w-xs w-full mx-4">
              <div className="text-center">
                <h1 className="text-red-600 dark:text-red-400 text-3xl font-bold mb-1">GAME OVER</h1>
                <p className="text-muted-foreground text-sm">아쉽네요!</p>
              </div>
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-widest">점수</span>
                  <span className="text-cyan-600 dark:text-cyan-400 text-3xl font-bold tabular-nums">{score}</span>
                </div>
                <div className="w-px bg-border" />
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-widest">최고</span>
                  <span className="text-indigo-600 dark:text-indigo-400 text-3xl font-bold tabular-nums">{highScore}</span>
                </div>
              </div>
              {score >= highScore && score > 0 && (
                <div className="text-yellow-600 dark:text-yellow-400 text-sm font-semibold">
                  새 최고 기록! 🎉
                </div>
              )}
              <button
                onClick={startGame}
                className="w-full py-3 px-6 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl transition-colors text-lg"
              >
                다시 시작
              </button>
              <button
                onClick={resetGame}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                메뉴로
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="flex flex-col items-center gap-1 pb-4 touch-manipulation md:hidden">
        <button
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); handleDpad("UP"); }}
          className="w-14 h-14 rounded-xl bg-muted dark:bg-gray-800 hover:bg-accent dark:hover:bg-gray-700 active:bg-accent/70 dark:active:bg-gray-600 flex items-center justify-center text-foreground text-xl transition-colors"
          aria-label="위"
        >
          ▲
        </button>
        <div className="flex gap-1">
          <button
            onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); handleDpad("LEFT"); }}
            className="w-14 h-14 rounded-xl bg-muted dark:bg-gray-800 hover:bg-accent dark:hover:bg-gray-700 active:bg-accent/70 dark:active:bg-gray-600 flex items-center justify-center text-foreground text-xl transition-colors"
            aria-label="왼쪽"
          >
            ◀
          </button>
          <div className="w-14 h-14 rounded-xl bg-muted/50 dark:bg-gray-900" />
          <button
            onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); handleDpad("RIGHT"); }}
            className="w-14 h-14 rounded-xl bg-muted dark:bg-gray-800 hover:bg-accent dark:hover:bg-gray-700 active:bg-accent/70 dark:active:bg-gray-600 flex items-center justify-center text-foreground text-xl transition-colors"
            aria-label="오른쪽"
          >
            ▶
          </button>
        </div>
        <button
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); handleDpad("DOWN"); }}
          className="w-14 h-14 rounded-xl bg-muted dark:bg-gray-800 hover:bg-accent dark:hover:bg-gray-700 active:bg-accent/70 dark:active:bg-gray-600 flex items-center justify-center text-foreground text-xl transition-colors"
          aria-label="아래"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
