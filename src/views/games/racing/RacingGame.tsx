"use client";

import { useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { useGameStore } from "./hooks/use-game-store";
import { useSubmitScore } from "@features/game-score";
import Road from "./components/Road";
import PlayerCar from "./components/PlayerCar";
import ObstacleComponent from "./components/Obstacle";
import Environment from "./components/Environment";
import GameLoop from "./components/GameLoop";

function MobileControls() {
  const moveLane = useGameStore((s) => s.moveLane);
  const gameState = useGameStore((s) => s.gameState);

  if (gameState !== "playing") return null;

  return (
    <div className="pointer-events-auto absolute bottom-6 left-0 right-0 flex justify-between px-8 sm:hidden">
      <button
        onTouchStart={() => moveLane(-1)}
        className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-muted/50 dark:bg-white/10 text-2xl text-foreground backdrop-blur-sm active:bg-white/20"
      >
        &larr;
      </button>
      <button
        onTouchStart={() => moveLane(1)}
        className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-muted/50 dark:bg-white/10 text-2xl text-foreground backdrop-blur-sm active:bg-white/20"
      >
        &rarr;
      </button>
    </div>
  );
}

function HUD() {
  const score = useGameStore((s) => s.score);
  const speed = useGameStore((s) => s.speed);
  const gameState = useGameStore((s) => s.gameState);

  if (gameState !== "playing") return null;

  return (
    <div className="pointer-events-none absolute top-4 left-4 right-4 flex justify-between">
      <div className="rounded-lg border border-border bg-black/50 px-4 py-2 backdrop-blur-sm">
        <p className="text-xs text-muted-foreground">SCORE</p>
        <p className="text-xl font-bold text-foreground">
          {Math.floor(score).toLocaleString()}
        </p>
      </div>
      <div className="rounded-lg border border-border bg-black/50 px-4 py-2 backdrop-blur-sm">
        <p className="text-xs text-muted-foreground">SPEED</p>
        <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
          {Math.floor(speed)} km/h
        </p>
      </div>
    </div>
  );
}

function MenuOverlay() {
  const gameState = useGameStore((s) => s.gameState);
  const highScore = useGameStore((s) => s.highScore);
  const start = useGameStore((s) => s.start);

  const handleStart = useCallback(() => {
    start();
  }, [start]);

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
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="text-center">
        <h1 className="mb-2 text-5xl font-bold text-white">
          <span className="text-cyan-400">VOXEL</span> RACER
        </h1>
        <p className="mb-8 text-muted-foreground">
          장애물을 피하며 최대한 멀리 달리세요
        </p>
        {highScore > 0 && (
          <p className="mb-4 text-sm text-indigo-600 dark:text-indigo-400">
            최고 점수: {highScore.toLocaleString()}
          </p>
        )}
        <button
          onClick={handleStart}
          className="rounded-xl border border-cyan-500/30 bg-cyan-500/20 px-8 py-3 text-lg font-semibold text-cyan-400 transition hover:bg-cyan-500/30"
        >
          게임 시작
        </button>
        <p className="mt-4 text-xs text-muted-foreground">
          ← → 또는 A D 키로 이동 | SPACE로 시작
        </p>
      </div>
    </div>
  );
}

function GameOverOverlay() {
  const gameState = useGameStore((s) => s.gameState);
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const start = useGameStore((s) => s.start);

  const handleRestart = useCallback(() => {
    start();
  }, [start]);

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
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="mb-2 text-4xl font-bold text-red-600 dark:text-red-400">GAME OVER</h2>
        <p className="mb-1 text-2xl font-bold text-foreground">
          {score.toLocaleString()} 점
        </p>
        {score >= highScore && score > 0 && (
          <p className="mb-4 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
            🏆 새로운 최고 점수!
          </p>
        )}
        <p className="mb-6 text-sm text-muted-foreground">
          최고 점수: {highScore.toLocaleString()}
        </p>
        <button
          onClick={handleRestart}
          className="rounded-xl border border-cyan-500/30 bg-cyan-500/20 px-8 py-3 text-lg font-semibold text-cyan-400 transition hover:bg-cyan-500/30"
        >
          다시 시작
        </button>
        <p className="mt-3 text-xs text-muted-foreground">SPACE로 재시작</p>
      </div>
    </div>
  );
}

function Scene() {
  const speed = useGameStore((s) => s.speed);
  const obstacles = useGameStore((s) => s.obstacles);

  return (
    <>
      <Environment />
      <Road speed={speed} />
      <PlayerCar />
      {obstacles.map((obs) => (
        <ObstacleComponent key={obs.id} data={obs} />
      ))}
      <GameLoop />
    </>
  );
}

export default function RacingGame() {
  const score = useGameStore((s) => s.score);
  const speed = useGameStore((s) => s.speed);
  const gameState = useGameStore((s) => s.gameState);
  const { submitScore, resetSubmission } = useSubmitScore("racing");

  useEffect(() => {
    if (gameState === "gameover") {
      submitScore(Math.floor(score), { max_speed: Math.floor(speed) });
    }
    if (gameState === "playing") {
      resetSubmission();
    }
  }, [gameState, score, speed, submitScore, resetSubmission]);

  return (
    <div className="relative h-[calc(100vh-60px)] w-full bg-background mt-[60px]">
      <Canvas
        camera={{ position: [0, 4, 8], fov: 60, near: 0.1, far: 150 }}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
      <HUD />
      <MenuOverlay />
      <GameOverOverlay />
      <MobileControls />
    </div>
  );
}
