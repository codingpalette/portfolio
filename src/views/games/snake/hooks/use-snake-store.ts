import { create } from "zustand";

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type GameState = "menu" | "playing" | "gameover";

export interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_INCREASE_EVERY = 5;
const SCORE_PER_FOOD = 10;

function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (occupied.has(`${food.x},${food.y}`));
  return food;
}

function initialSnake(): Point[] {
  const cx = Math.floor(GRID_SIZE / 2);
  const cy = Math.floor(GRID_SIZE / 2);
  return [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
}

interface SnakeStore {
  gameState: GameState;
  snake: Point[];
  food: Point;
  direction: Direction;
  dirQueue: Direction[];
  score: number;
  highScore: number;
  foodEaten: number;
  speed: number;
  gridSize: number;

  startGame: () => void;
  enqueueDirection: (dir: Direction) => void;
  tick: () => void;
  resetGame: () => void;
}

function loadHighScore(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("snake-highscore") ?? "0", 10);
}

function saveHighScore(score: number) {
  if (typeof window !== "undefined") {
    localStorage.setItem("snake-highscore", String(score));
  }
}

const initSnake = initialSnake();

export const useSnakeStore = create<SnakeStore>((set, get) => ({
  gameState: "menu",
  snake: initSnake,
  food: randomFood(initSnake),
  direction: "RIGHT",
  dirQueue: [],
  score: 0,
  highScore: 0,
  foodEaten: 0,
  speed: INITIAL_SPEED,
  gridSize: GRID_SIZE,

  startGame: () => {
    const snake = initialSnake();
    set({
      gameState: "playing",
      snake,
      food: randomFood(snake),
      direction: "RIGHT",
      dirQueue: [],
      score: 0,
      foodEaten: 0,
      speed: INITIAL_SPEED,
      highScore: loadHighScore(),
    });
  },

  enqueueDirection: (dir: Direction) => {
    const { dirQueue, direction } = get();
    const current = dirQueue.length > 0 ? dirQueue[dirQueue.length - 1] : direction;

    const opposite: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    if (dir === opposite[current]) return;
    if (dirQueue.length >= 2) return;

    set({ dirQueue: [...dirQueue, dir] });
  },

  tick: () => {
    const { gameState, snake, food, direction, dirQueue, score, highScore, foodEaten, speed } = get();
    if (gameState !== "playing") return;

    let nextDir = direction;
    let nextQueue = dirQueue;
    if (dirQueue.length > 0) {
      nextDir = dirQueue[0];
      nextQueue = dirQueue.slice(1);
    }

    const head = snake[0];
    let newHead: Point;

    switch (nextDir) {
      case "UP":
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case "DOWN":
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case "LEFT":
        newHead = { x: head.x - 1, y: head.y };
        break;
      case "RIGHT":
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    // Wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      const newHigh = Math.max(score, highScore);
      saveHighScore(newHigh);
      set({ gameState: "gameover", highScore: newHigh });
      return;
    }

    // Self collision (exclude tail since it moves away)
    const body = snake.slice(0, snake.length - 1);
    if (body.some((p) => p.x === newHead.x && p.y === newHead.y)) {
      const newHigh = Math.max(score, highScore);
      saveHighScore(newHigh);
      set({ gameState: "gameover", highScore: newHigh });
      return;
    }

    const ateFood = newHead.x === food.x && newHead.y === food.y;
    const newSnake = ateFood
      ? [newHead, ...snake]
      : [newHead, ...snake.slice(0, snake.length - 1)];

    if (ateFood) {
      const newFoodEaten = foodEaten + 1;
      const newScore = score + SCORE_PER_FOOD;
      const newHigh = Math.max(newScore, highScore);
      const speedLevel = Math.floor(newFoodEaten / SPEED_INCREASE_EVERY);
      const newSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - speedLevel * 15);
      const newFood = randomFood(newSnake);
      if (newHigh > highScore) saveHighScore(newHigh);
      set({
        snake: newSnake,
        food: newFood,
        score: newScore,
        highScore: newHigh,
        foodEaten: newFoodEaten,
        speed: newSpeed,
        direction: nextDir,
        dirQueue: nextQueue,
      });
    } else {
      set({
        snake: newSnake,
        direction: nextDir,
        dirQueue: nextQueue,
      });
    }
  },

  resetGame: () => {
    const snake = initialSnake();
    set({
      gameState: "menu",
      snake,
      food: randomFood(snake),
      direction: "RIGHT",
      dirQueue: [],
      score: 0,
      foodEaten: 0,
      speed: INITIAL_SPEED,
      highScore: loadHighScore(),
    });
  },
}));
