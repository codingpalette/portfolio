"use client";

import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────────────────────

export type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export type GameState = "menu" | "playing" | "paused" | "gameover";
export type Cell = TetrominoType | null;

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: TetrominoType;
  pos: Position;
  rotation: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
const HIGHSCORE_KEY = "tetris-highscore";

// Tetromino shapes: [rotation][row][col]
const TETROMINOES: Record<TetrominoType, number[][][]> = {
  I: [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
  ],
  O: [
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
  ],
  T: [
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
    [[0, 1, 0], [1, 1, 0], [0, 1, 0]],
  ],
  S: [
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
    [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
    [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
  ],
  J: [
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
    [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
  ],
  L: [
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
    [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
    [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
  ],
};

// SRS wall kick data for J, L, S, T, Z
const WALL_KICKS_JLSTZ: Record<string, [number, number][]> = {
  "0->1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  "1->0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  "1->2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  "2->1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  "2->3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  "3->2": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  "3->0": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  "0->3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
};

// SRS wall kick data for I
const WALL_KICKS_I: Record<string, [number, number][]> = {
  "0->1": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  "1->0": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  "1->2": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
  "2->1": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  "2->3": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  "3->2": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  "3->0": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  "0->3": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
};

export const PIECE_COLORS: Record<TetrominoType, string> = {
  I: "#22d3ee", // cyan-400
  O: "#facc15", // yellow-400
  T: "#c084fc", // purple-400
  S: "#4ade80", // green-400
  Z: "#f87171", // red-400
  J: "#60a5fa", // blue-400
  L: "#fb923c", // orange-400
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(null)
  );
}

function getShape(piece: Piece): number[][] {
  return TETROMINOES[piece.type][piece.rotation % TETROMINOES[piece.type].length];
}

function getCells(piece: Piece): Position[] {
  const shape = getShape(piece);
  const cells: Position[] = [];
  shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell) cells.push({ x: piece.pos.x + c, y: piece.pos.y + r });
    });
  });
  return cells;
}

function isValid(piece: Piece, board: Cell[][]): boolean {
  return getCells(piece).every(
    ({ x, y }) =>
      x >= 0 && x < BOARD_WIDTH && y < BOARD_HEIGHT && (y < 0 || !board[y][x])
  );
}

function tryRotate(
  piece: Piece,
  dir: 1 | -1,
  board: Cell[][]
): Piece | null {
  const numRotations = TETROMINOES[piece.type].length;
  const fromRot = piece.rotation % numRotations;
  const toRot = ((fromRot + dir + numRotations) % numRotations) as number;
  const rotKey = `${fromRot}->${toRot}`;
  const kicks =
    piece.type === "I"
      ? WALL_KICKS_I[rotKey] ?? [[0, 0]]
      : WALL_KICKS_JLSTZ[rotKey] ?? [[0, 0]];

  for (const [dx, dy] of kicks) {
    const rotated: Piece = {
      ...piece,
      rotation: toRot,
      pos: { x: piece.pos.x + dx, y: piece.pos.y - dy },
    };
    if (isValid(rotated, board)) return rotated;
  }
  return null;
}

function getGhostPos(piece: Piece, board: Cell[][]): Position {
  let ghost = { ...piece };
  while (isValid({ ...ghost, pos: { ...ghost.pos, y: ghost.pos.y + 1 } }, board)) {
    ghost = { ...ghost, pos: { ...ghost.pos, y: ghost.pos.y + 1 } };
  }
  return ghost.pos;
}

function randomType(): TetrominoType {
  const types: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"];
  return types[Math.floor(Math.random() * types.length)];
}

function spawnPiece(type: TetrominoType): Piece {
  const shape = TETROMINOES[type][0];
  const width = shape[0].length;
  return {
    type,
    pos: { x: Math.floor((BOARD_WIDTH - width) / 2), y: 0 },
    rotation: 0,
  };
}

function lockPiece(piece: Piece, board: Cell[][]): Cell[][] {
  const newBoard = board.map((row) => [...row]);
  getCells(piece).forEach(({ x, y }) => {
    if (y >= 0) newBoard[y][x] = piece.type;
  });
  return newBoard;
}

function clearLines(board: Cell[][]): { board: Cell[][]; linesCleared: number } {
  const newBoard = board.filter((row) => row.some((cell) => !cell));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  const emptyRows = Array.from({ length: linesCleared }, () =>
    Array(BOARD_WIDTH).fill(null) as Cell[]
  );
  return { board: [...emptyRows, ...newBoard], linesCleared };
}

function calcScore(lines: number, level: number): number {
  const base = [0, 100, 300, 500, 800];
  return (base[lines] ?? 0) * level;
}

function calcGravityMs(level: number): number {
  // Speed increases with level; min 100ms
  return Math.max(100, 1000 - (level - 1) * 80);
}

function loadHighScore(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(HIGHSCORE_KEY) ?? "0", 10) || 0;
}

function saveHighScore(score: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HIGHSCORE_KEY, String(score));
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface TetrisState {
  board: Cell[][];
  current: Piece | null;
  next: TetrominoType;
  held: TetrominoType | null;
  canHold: boolean;
  score: number;
  level: number;
  lines: number;
  highScore: number;
  gameState: GameState;
  gravityMs: number;

  // Actions
  start: () => void;
  tick: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  softDrop: () => void;
  hardDrop: () => void;
  rotateClockwise: () => void;
  rotateCounter: () => void;
  holdPiece: () => void;
  getGhostY: () => number | null;
}

export const useTetrisStore = create<TetrisState>((set, get) => ({
  board: createEmptyBoard(),
  current: null,
  next: randomType(),
  held: null,
  canHold: true,
  score: 0,
  level: 1,
  lines: 0,
  highScore: 0,
  gameState: "menu",
  gravityMs: 1000,

  start: () => {
    const highScore = loadHighScore();
    const nextType = randomType();
    const current = spawnPiece(randomType());
    set({
      board: createEmptyBoard(),
      current,
      next: nextType,
      held: null,
      canHold: true,
      score: 0,
      level: 1,
      lines: 0,
      highScore,
      gameState: "playing",
      gravityMs: 1000,
    });
  },

  tick: () => {
    const { current, board, next, score, level, lines, highScore } = get();
    if (!current) return;

    const moved: Piece = { ...current, pos: { ...current.pos, y: current.pos.y + 1 } };

    if (isValid(moved, board)) {
      set({ current: moved });
      return;
    }

    // Lock piece
    const lockedBoard = lockPiece(current, board);
    const { board: clearedBoard, linesCleared } = clearLines(lockedBoard);
    const newLines = lines + linesCleared;
    const newLevel = Math.floor(newLines / 10) + 1;
    const newScore = score + calcScore(linesCleared, level);
    const newHighScore = newScore > highScore ? newScore : highScore;
    if (newScore > highScore) saveHighScore(newScore);

    const nextPiece = spawnPiece(next);
    if (!isValid(nextPiece, clearedBoard)) {
      // Game over
      set({
        board: clearedBoard,
        current: null,
        score: newScore,
        lines: newLines,
        level: newLevel,
        highScore: newHighScore,
        gameState: "gameover",
      });
      return;
    }

    set({
      board: clearedBoard,
      current: nextPiece,
      next: randomType(),
      canHold: true,
      score: newScore,
      lines: newLines,
      level: newLevel,
      highScore: newHighScore,
      gravityMs: calcGravityMs(newLevel),
    });
  },

  moveLeft: () => {
    const { current, board, gameState } = get();
    if (gameState !== "playing" || !current) return;
    const moved = { ...current, pos: { ...current.pos, x: current.pos.x - 1 } };
    if (isValid(moved, board)) set({ current: moved });
  },

  moveRight: () => {
    const { current, board, gameState } = get();
    if (gameState !== "playing" || !current) return;
    const moved = { ...current, pos: { ...current.pos, x: current.pos.x + 1 } };
    if (isValid(moved, board)) set({ current: moved });
  },

  softDrop: () => {
    const { current, board, gameState } = get();
    if (gameState !== "playing" || !current) return;
    const moved = { ...current, pos: { ...current.pos, y: current.pos.y + 1 } };
    if (isValid(moved, board)) {
      set({ current: moved, score: get().score + 1 });
    }
  },

  hardDrop: () => {
    const { current, board, gameState, next, score, level, lines, highScore } = get();
    if (gameState !== "playing" || !current) return;

    let dropped = { ...current };
    let dropDist = 0;
    while (isValid({ ...dropped, pos: { ...dropped.pos, y: dropped.pos.y + 1 } }, board)) {
      dropped = { ...dropped, pos: { ...dropped.pos, y: dropped.pos.y + 1 } };
      dropDist++;
    }

    const lockedBoard = lockPiece(dropped, board);
    const { board: clearedBoard, linesCleared } = clearLines(lockedBoard);
    const newLines = lines + linesCleared;
    const newLevel = Math.floor(newLines / 10) + 1;
    const newScore = score + dropDist * 2 + calcScore(linesCleared, level);
    const newHighScore = newScore > highScore ? newScore : highScore;
    if (newScore > highScore) saveHighScore(newScore);

    const nextPiece = spawnPiece(next);
    if (!isValid(nextPiece, clearedBoard)) {
      set({
        board: clearedBoard,
        current: null,
        score: newScore,
        lines: newLines,
        level: newLevel,
        highScore: newHighScore,
        gameState: "gameover",
      });
      return;
    }

    set({
      board: clearedBoard,
      current: nextPiece,
      next: randomType(),
      canHold: true,
      score: newScore,
      lines: newLines,
      level: newLevel,
      highScore: newHighScore,
      gravityMs: calcGravityMs(newLevel),
    });
  },

  rotateClockwise: () => {
    const { current, board, gameState } = get();
    if (gameState !== "playing" || !current) return;
    const rotated = tryRotate(current, 1, board);
    if (rotated) set({ current: rotated });
  },

  rotateCounter: () => {
    const { current, board, gameState } = get();
    if (gameState !== "playing" || !current) return;
    const rotated = tryRotate(current, -1, board);
    if (rotated) set({ current: rotated });
  },

  holdPiece: () => {
    const { current, held, canHold, gameState } = get();
    if (gameState !== "playing" || !current || !canHold) return;

    if (held) {
      const newCurrent = spawnPiece(held);
      const { board } = get();
      if (!isValid(newCurrent, board)) return;
      set({ current: newCurrent, held: current.type, canHold: false });
    } else {
      const { next } = get();
      const newCurrent = spawnPiece(next);
      const { board } = get();
      if (!isValid(newCurrent, board)) return;
      set({ current: newCurrent, held: current.type, next: randomType(), canHold: false });
    }
  },

  getGhostY: () => {
    const { current, board } = get();
    if (!current) return null;
    return getGhostPos(current, board).y;
  },
}));

// Export helpers needed by components
export { getCells, getShape, TETROMINOES };
