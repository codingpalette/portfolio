import { create } from "zustand";

export type Difficulty = "beginner" | "intermediate" | "expert";
export type GameState = "menu" | "playing" | "gameover" | "win";
export type CellState = "hidden" | "revealed" | "flagged";

export interface Cell {
  hasMine: boolean;
  adjacentMines: number;
  state: CellState;
}

export interface DifficultyConfig {
  label: string;
  rows: number;
  cols: number;
  mines: number;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  beginner: { label: "초급", rows: 9, cols: 9, mines: 10 },
  intermediate: { label: "중급", rows: 16, cols: 16, mines: 40 },
  expert: { label: "고급", rows: 16, cols: 30, mines: 99 },
};

export interface BestTimes {
  beginner?: number;
  intermediate?: number;
  expert?: number;
}

function loadBestTimes(): BestTimes {
  try {
    const raw = localStorage.getItem("minesweeper-best");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveBestTime(difficulty: Difficulty, time: number): BestTimes {
  const best = loadBestTimes();
  if (best[difficulty] === undefined || time < best[difficulty]!) {
    best[difficulty] = time;
    try {
      localStorage.setItem("minesweeper-best", JSON.stringify(best));
    } catch {
      // ignore
    }
  }
  return best;
}

function createEmptyGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      hasMine: false,
      adjacentMines: 0,
      state: "hidden" as CellState,
    }))
  );
}

function placeMines(
  grid: Cell[][],
  rows: number,
  cols: number,
  mines: number,
  safeRow: number,
  safeCol: number
): Cell[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const safeZone = new Set<string>();

  // Mark 3x3 area around first click as safe
  for (let r = safeRow - 1; r <= safeRow + 1; r++) {
    for (let c = safeCol - 1; c <= safeCol + 1; c++) {
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        safeZone.add(`${r},${c}`);
      }
    }
  }

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!newGrid[r][c].hasMine && !safeZone.has(`${r},${c}`)) {
      newGrid[r][c].hasMine = true;
      placed++;
    }
  }

  // Calculate adjacent mines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!newGrid[r][c].hasMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].hasMine) {
              count++;
            }
          }
        }
        newGrid[r][c].adjacentMines = count;
      }
    }
  }

  return newGrid;
}

function floodReveal(grid: Cell[][], rows: number, cols: number, row: number, col: number): Cell[][] {
  const newGrid = grid.map((r) => r.map((cell) => ({ ...cell })));
  const queue: [number, number][] = [[row, col]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (newGrid[r][c].state === "revealed") continue;
    if (newGrid[r][c].state === "flagged") continue;
    if (newGrid[r][c].hasMine) continue;

    newGrid[r][c].state = "revealed";

    if (newGrid[r][c].adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          queue.push([r + dr, c + dc]);
        }
      }
    }
  }

  return newGrid;
}

function checkWin(grid: Cell[][], rows: number, cols: number, mines: number): boolean {
  let revealedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].state === "revealed") revealedCount++;
    }
  }
  return revealedCount === rows * cols - mines;
}

interface MinesweeperState {
  gameState: GameState;
  difficulty: Difficulty;
  grid: Cell[][];
  rows: number;
  cols: number;
  mines: number;
  flagCount: number;
  timer: number;
  bestTimes: BestTimes;
  firstClick: boolean;
  timerInterval: ReturnType<typeof setInterval> | null;

  selectDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  resetGame: () => void;
  goToMenu: () => void;
  tick: () => void;
}

export const useMinesweeperStore = create<MinesweeperState>((set, get) => ({
  gameState: "menu",
  difficulty: "beginner",
  grid: [],
  rows: 9,
  cols: 9,
  mines: 10,
  flagCount: 0,
  timer: 0,
  bestTimes: {},
  firstClick: true,
  timerInterval: null,

  selectDifficulty: (difficulty) => {
    const config = DIFFICULTY_CONFIGS[difficulty];
    set({
      difficulty,
      rows: config.rows,
      cols: config.cols,
      mines: config.mines,
    });
  },

  startGame: () => {
    const { difficulty, rows, cols, mines } = get();
    const config = DIFFICULTY_CONFIGS[difficulty];
    const grid = createEmptyGrid(config.rows, config.cols);
    const bestTimes = loadBestTimes();

    const existing = get().timerInterval;
    if (existing) clearInterval(existing);

    set({
      gameState: "playing",
      grid,
      rows: config.rows,
      cols: config.cols,
      mines: config.mines,
      flagCount: 0,
      timer: 0,
      firstClick: true,
      timerInterval: null,
      bestTimes,
      difficulty,
    });
  },

  revealCell: (row, col) => {
    const { gameState, grid, rows, cols, mines, firstClick, timerInterval } = get();
    if (gameState !== "playing") return;

    const cell = grid[row][col];
    if (cell.state !== "hidden") return;

    let currentGrid = grid;

    // First click: place mines avoiding click location
    if (firstClick) {
      currentGrid = placeMines(grid, rows, cols, mines, row, col);
      const interval = setInterval(() => get().tick(), 1000);
      set({ firstClick: false, timerInterval: interval });
    }

    // Check if mine
    if (currentGrid[row][col].hasMine) {
      // Reveal all mines
      const revealedGrid = currentGrid.map((r) =>
        r.map((cell) => ({
          ...cell,
          state: cell.hasMine ? ("revealed" as CellState) : cell.state,
        }))
      );

      const existing = get().timerInterval;
      if (existing) clearInterval(existing);

      set({ grid: revealedGrid, gameState: "gameover", timerInterval: null });
      return;
    }

    // Flood fill if 0 adjacent mines
    let newGrid: Cell[][];
    if (currentGrid[row][col].adjacentMines === 0) {
      newGrid = floodReveal(currentGrid, rows, cols, row, col);
    } else {
      newGrid = currentGrid.map((r, ri) =>
        r.map((cell, ci) =>
          ri === row && ci === col ? { ...cell, state: "revealed" as CellState } : cell
        )
      );
    }

    // Check win
    if (checkWin(newGrid, rows, cols, mines)) {
      const existing = get().timerInterval;
      if (existing) clearInterval(existing);

      const { timer, difficulty } = get();
      const bestTimes = saveBestTime(difficulty, timer);
      set({ grid: newGrid, gameState: "win", timerInterval: null, bestTimes });
      return;
    }

    set({ grid: newGrid });
  },

  toggleFlag: (row, col) => {
    const { gameState, grid, flagCount } = get();
    if (gameState !== "playing") return;

    const cell = grid[row][col];
    if (cell.state === "revealed") return;

    const newState: CellState = cell.state === "flagged" ? "hidden" : "flagged";
    const flagDelta = newState === "flagged" ? 1 : -1;

    const newGrid = grid.map((r, ri) =>
      r.map((c, ci) =>
        ri === row && ci === col ? { ...c, state: newState } : c
      )
    );

    set({ grid: newGrid, flagCount: flagCount + flagDelta });
  },

  resetGame: () => {
    const { difficulty } = get();
    const config = DIFFICULTY_CONFIGS[difficulty];
    const grid = createEmptyGrid(config.rows, config.cols);
    const bestTimes = loadBestTimes();

    const existing = get().timerInterval;
    if (existing) clearInterval(existing);

    set({
      gameState: "playing",
      grid,
      rows: config.rows,
      cols: config.cols,
      mines: config.mines,
      flagCount: 0,
      timer: 0,
      firstClick: true,
      timerInterval: null,
      bestTimes,
    });
  },

  goToMenu: () => {
    const existing = get().timerInterval;
    if (existing) clearInterval(existing);

    set({ gameState: "menu", timerInterval: null });
  },

  tick: () => {
    set((state) => ({ timer: state.timer + 1 }));
  },
}));
