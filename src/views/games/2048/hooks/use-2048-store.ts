import { create } from "zustand";

export type GameState = "menu" | "playing" | "gameover" | "win";

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew: boolean;
  isMerged: boolean;
}

interface Game2048State {
  board: (Tile | null)[][];
  tiles: Tile[];
  score: number;
  highScore: number;
  gameState: GameState;
  canContinue: boolean;
  history: { tiles: Tile[]; score: number }[];
  nextId: number;

  startGame: () => void;
  move: (direction: "up" | "down" | "left" | "right") => void;
  continueGame: () => void;
  undoMove: () => void;
}

let tileIdCounter = 1;

function createTile(value: number, row: number, col: number, isNew = false): Tile {
  return {
    id: tileIdCounter++,
    value,
    row,
    col,
    isNew,
    isMerged: false,
  };
}

function buildBoard(tiles: Tile[]): (Tile | null)[][] {
  const board: (Tile | null)[][] = Array.from({ length: 4 }, () =>
    Array(4).fill(null)
  );
  for (const tile of tiles) {
    board[tile.row][tile.col] = tile;
  }
  return board;
}

function getEmptyCells(tiles: Tile[]): { row: number; col: number }[] {
  const occupied = new Set(tiles.map((t) => `${t.row},${t.col}`));
  const empty: { row: number; col: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!occupied.has(`${r},${c}`)) {
        empty.push({ row: r, col: c });
      }
    }
  }
  return empty;
}

function spawnTile(tiles: Tile[]): Tile[] {
  const empty = getEmptyCells(tiles);
  if (empty.length === 0) return tiles;
  const pos = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  return [...tiles, createTile(value, pos.row, pos.col, true)];
}

function hasValidMoves(tiles: Tile[]): boolean {
  if (getEmptyCells(tiles).length > 0) return true;
  const board = buildBoard(tiles);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = board[r][c]?.value;
      if (val === undefined) continue;
      if (c + 1 < 4 && board[r][c + 1]?.value === val) return true;
      if (r + 1 < 4 && board[r + 1][c]?.value === val) return true;
    }
  }
  return false;
}

type SlideResult = { tiles: Tile[]; scoreGained: number; moved: boolean };

function slideLeft(tiles: Tile[]): SlideResult {
  let scoreGained = 0;
  let moved = false;
  const newTiles: Tile[] = [];

  for (let r = 0; r < 4; r++) {
    const row = tiles
      .filter((t) => t.row === r)
      .sort((a, b) => a.col - b.col);

    const merged: Tile[] = [];
    let i = 0;
    while (i < row.length) {
      if (i + 1 < row.length && row[i].value === row[i + 1].value) {
        const newVal = row[i].value * 2;
        scoreGained += newVal;
        merged.push({
          ...row[i],
          id: tileIdCounter++,
          value: newVal,
          col: merged.length,
          isMerged: true,
          isNew: false,
        });
        i += 2;
      } else {
        merged.push({
          ...row[i],
          col: merged.length,
          isMerged: false,
          isNew: false,
        });
        i++;
      }
    }

    for (const t of merged) {
      const orig = row.find((o) => o.id === t.id) ?? row[0];
      if (orig && (orig.col !== t.col || t.isMerged)) moved = true;
      newTiles.push(t);
    }
  }

  return { tiles: newTiles, scoreGained, moved };
}

function rotateTiles90CW(tiles: Tile[]): Tile[] {
  // (r, c) -> (c, 3-r)
  return tiles.map((t) => ({ ...t, row: t.col, col: 3 - t.row }));
}

function rotateTiles90CCW(tiles: Tile[]): Tile[] {
  // (r, c) -> (3-c, r)
  return tiles.map((t) => ({ ...t, row: 3 - t.col, col: t.row }));
}

function rotateTiles180(tiles: Tile[]): Tile[] {
  return tiles.map((t) => ({ ...t, row: 3 - t.row, col: 3 - t.col }));
}

function performMove(
  tiles: Tile[],
  direction: "up" | "down" | "left" | "right"
): SlideResult {
  let working = tiles;

  if (direction === "left") {
    return slideLeft(working);
  } else if (direction === "right") {
    working = rotateTiles180(working);
    const result = slideLeft(working);
    return { ...result, tiles: rotateTiles180(result.tiles) };
  } else if (direction === "up") {
    working = rotateTiles90CCW(working);
    const result = slideLeft(working);
    return { ...result, tiles: rotateTiles90CW(result.tiles) };
  } else {
    // down
    working = rotateTiles90CW(working);
    const result = slideLeft(working);
    return { ...result, tiles: rotateTiles90CCW(result.tiles) };
  }
}

function initGame(): { tiles: Tile[]; nextId: number } {
  tileIdCounter = 1;
  let tiles: Tile[] = [];
  tiles = spawnTile(tiles);
  tiles = spawnTile(tiles);
  return { tiles, nextId: tileIdCounter };
}

function loadHighScore(): number {
  if (typeof window === "undefined") return 0;
  const val = localStorage.getItem("2048-highscore");
  return val ? parseInt(val, 10) : 0;
}

function saveHighScore(score: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem("2048-highscore", String(score));
}

export const use2048Store = create<Game2048State>((set, get) => ({
  board: buildBoard([]),
  tiles: [],
  score: 0,
  highScore: loadHighScore(),
  gameState: "menu",
  canContinue: false,
  history: [],
  nextId: 1,

  startGame: () => {
    const { tiles } = initGame();
    set({
      tiles,
      board: buildBoard(tiles),
      score: 0,
      gameState: "playing",
      canContinue: false,
      history: [],
    });
  },

  move: (direction) => {
    const { tiles, score, gameState, canContinue, history } = get();
    if (gameState !== "playing") return;

    const result = performMove(tiles, direction);
    if (!result.moved) return;

    const newScore = score + result.scoreGained;
    const highScore = get().highScore;
    const newHighScore = Math.max(highScore, newScore);
    if (newHighScore > highScore) saveHighScore(newHighScore);

    // Spawn new tile after each move
    const withNew = spawnTile(result.tiles.map((t) => ({ ...t, isNew: false })));
    const newHistory = [...history, { tiles, score }].slice(-5);

    // Check win (only if not already continuing past win)
    const hasWon = withNew.some((t) => t.value >= 2048);
    const won = hasWon && !canContinue;

    if (!hasValidMoves(withNew)) {
      set({
        tiles: withNew,
        board: buildBoard(withNew),
        score: newScore,
        highScore: newHighScore,
        gameState: "gameover",
        history: newHistory,
      });
    } else if (won) {
      set({
        tiles: withNew,
        board: buildBoard(withNew),
        score: newScore,
        highScore: newHighScore,
        gameState: "win",
        history: newHistory,
      });
    } else {
      set({
        tiles: withNew,
        board: buildBoard(withNew),
        score: newScore,
        highScore: newHighScore,
        history: newHistory,
      });
    }
  },

  continueGame: () => {
    set({ gameState: "playing", canContinue: true });
  },

  undoMove: () => {
    const { history, score } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({
      tiles: prev.tiles,
      board: buildBoard(prev.tiles),
      score: prev.score,
      gameState: "playing",
      history: history.slice(0, -1),
    });
  },
}));
