"use client";

import { create } from "zustand";

export interface Obstacle {
  id: number;
  lane: number;
  z: number;
  type: "car" | "barrier";
}

type GameState = "menu" | "playing" | "gameover";

interface GameStore {
  gameState: GameState;
  score: number;
  highScore: number;
  speed: number;
  lane: number;
  obstacles: Obstacle[];
  obstacleTimer: number;
  nextObstacleId: number;

  start: () => void;
  reset: () => void;
  moveLane: (direction: -1 | 1) => void;
  tick: (delta: number) => void;
}

export const LANE_X = [-2.5, 0, 2.5];
const INITIAL_SPEED = 30;
const MAX_SPEED = 80;
const SPEED_INCREMENT = 0.5;
const SPAWN_Z = -80;
const DESPAWN_Z = 10;
const PLAYER_Z = 0;

function getHighScore(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("racing-high-score") || "0", 10);
}

function saveHighScore(score: number) {
  if (typeof window !== "undefined") {
    localStorage.setItem("racing-high-score", score.toString());
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: "menu",
  score: 0,
  highScore: getHighScore(),
  speed: INITIAL_SPEED,
  lane: 1,
  obstacles: [],
  obstacleTimer: 0,
  nextObstacleId: 0,

  start: () => {
    set({
      gameState: "playing",
      score: 0,
      speed: INITIAL_SPEED,
      lane: 1,
      obstacles: [],
      obstacleTimer: 0,
      nextObstacleId: 0,
    });
  },

  reset: () => {
    set({
      gameState: "menu",
      score: 0,
      speed: INITIAL_SPEED,
      lane: 1,
      obstacles: [],
      obstacleTimer: 0,
      nextObstacleId: 0,
    });
  },

  moveLane: (direction) => {
    const { lane, gameState } = get();
    if (gameState !== "playing") return;
    const next = Math.max(0, Math.min(2, lane + direction));
    set({ lane: next });
  },

  tick: (delta) => {
    const state = get();
    if (state.gameState !== "playing") return;

    const { speed, obstacles, obstacleTimer, nextObstacleId, lane, score } =
      state;

    const newScore = score + speed * delta;
    const newSpeed = Math.min(MAX_SPEED, speed + SPEED_INCREMENT * delta);

    let newObstacles = obstacles.map((o) => ({
      ...o,
      z: o.z + speed * delta,
    }));
    newObstacles = newObstacles.filter((o) => o.z < DESPAWN_Z);

    const spawnInterval = Math.max(
      0.8,
      2.0 - ((speed - INITIAL_SPEED) / (MAX_SPEED - INITIAL_SPEED)) * 1.2,
    );
    let newTimer = obstacleTimer + delta;
    let newNextId = nextObstacleId;

    if (newTimer >= spawnInterval) {
      newTimer = 0;
      const obsLane = Math.floor(Math.random() * 3);
      const type = Math.random() > 0.3 ? "car" : "barrier";
      newObstacles.push({
        id: newNextId++,
        lane: obsLane,
        z: SPAWN_Z,
        type,
      });

      if (speed > 50 && Math.random() > 0.5) {
        let secondLane = Math.floor(Math.random() * 3);
        while (secondLane === obsLane) {
          secondLane = Math.floor(Math.random() * 3);
        }
        newObstacles.push({
          id: newNextId++,
          lane: secondLane,
          z: SPAWN_Z,
          type: Math.random() > 0.5 ? "car" : "barrier",
        });
      }
    }

    const playerX = LANE_X[lane];
    const pHalfW = 0.6;
    const pHalfD = 1.0;

    for (const obs of newObstacles) {
      const obsX = LANE_X[obs.lane];
      const oHalfW = obs.type === "car" ? 0.6 : 0.8;
      const oHalfD = obs.type === "car" ? 1.0 : 0.3;

      if (
        Math.abs(playerX - obsX) < pHalfW + oHalfW &&
        Math.abs(PLAYER_Z - obs.z) < pHalfD + oHalfD
      ) {
        const finalScore = Math.floor(newScore);
        const currentHigh = getHighScore();
        const newHigh = Math.max(currentHigh, finalScore);
        saveHighScore(newHigh);
        set({ gameState: "gameover", score: finalScore, highScore: newHigh });
        return;
      }
    }

    set({
      score: newScore,
      speed: newSpeed,
      obstacles: newObstacles,
      obstacleTimer: newTimer,
      nextObstacleId: newNextId,
    });
  },
}));
