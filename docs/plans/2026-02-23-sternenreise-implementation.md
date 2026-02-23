# Sternenreise Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a chapter-based puzzle game ("Sternenreise") with 7 constellation chapters, 28 puzzles across 20 types, deployed on Cloudflare with persistent save states.

**Architecture:** React SPA with Canvas starfield background, served via Cloudflare Pages. Cloudflare Pages Functions provide a REST API backed by D1 (SQLite) for player progress. Each puzzle type is an isolated React component with a shared interface. Game state lives in React Context, synced to D1 on every solve.

**Tech Stack:** React, Vite, TypeScript, Framer Motion, Howler.js, CSS Modules, Cloudflare Pages, Cloudflare D1, NanoBanana (image generation)

---

## Project Structure

```
/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types.ts                    # All TypeScript types
│   ├── context/
│   │   └── GameContext.tsx          # Game state provider
│   ├── hooks/
│   │   ├── useApi.ts               # API client hook
│   │   ├── useAudio.ts             # Audio manager hook
│   │   └── useStarfield.ts         # Canvas starfield hook
│   ├── components/
│   │   ├── Starfield.tsx           # Canvas background
│   │   ├── Layout.tsx              # Shared layout wrapper
│   │   ├── HintButton.tsx          # Hint system UI
│   │   ├── AudioControls.tsx       # Volume/mute controls
│   │   └── PuzzleFrame.tsx         # Wrapper for all puzzles
│   ├── screens/
│   │   ├── StartScreen.tsx
│   │   ├── SkyMap.tsx
│   │   ├── ChapterIntro.tsx
│   │   ├── PuzzleSelect.tsx
│   │   ├── PuzzleScreen.tsx
│   │   ├── PuzzleSolved.tsx
│   │   ├── ConstellationReveal.tsx
│   │   └── Finale.tsx
│   ├── puzzles/
│   │   ├── index.ts                # Puzzle registry
│   │   ├── MelodySequence.tsx
│   │   ├── Connections.tsx
│   │   ├── Maze.tsx
│   │   ├── WordChain.tsx
│   │   ├── StarCompass.tsx
│   │   ├── Crossword.tsx
│   │   ├── Memory.tsx
│   │   ├── NumberSequence.tsx
│   │   ├── SymmetryPuzzle.tsx
│   │   ├── Anagram.tsx
│   │   ├── SlidePuzzle.tsx
│   │   ├── SpotDifference.tsx
│   │   ├── LogicDeduction.tsx
│   │   ├── Rebus.tsx
│   │   ├── Nonogram.tsx
│   │   ├── WordSearch.tsx
│   │   ├── CipherBreaker.tsx
│   │   ├── JigsawPuzzle.tsx
│   │   ├── StarSudoku.tsx
│   │   ├── PipePuzzle.tsx
│   │   ├── Quiz.tsx
│   │   ├── MorseCode.tsx
│   │   ├── Tangram.tsx
│   │   ├── SyllablePuzzle.tsx
│   │   ├── MetaPuzzle.tsx
│   │   ├── SimonSays.tsx
│   │   ├── SortingPuzzle.tsx
│   │   └── ImagePuzzle.tsx
│   ├── data/
│   │   ├── chapters.ts             # Chapter definitions + story text
│   │   ├── puzzles/
│   │   │   ├── chapter1.ts
│   │   │   ├── chapter2.ts
│   │   │   ├── chapter3.ts
│   │   │   ├── chapter4.ts
│   │   │   ├── chapter5.ts
│   │   │   ├── chapter6.ts
│   │   │   └── chapter7.ts
│   │   └── hints.ts                # All hints per puzzle
│   └── styles/
│       ├── global.css
│       ├── theme.ts                # Color/font constants
│       └── animations.ts           # Framer Motion variants
├── functions/                      # Cloudflare Pages Functions
│   └── api/
│       ├── player.ts               # POST: create/load player
│       ├── progress/
│       │   └── [playerId].ts       # GET: load progress
│       ├── progress.ts             # POST: save progress
│       └── clue.ts                 # POST: save clue
├── migrations/
│   └── 0001_initial.sql            # D1 schema
├── public/
│   ├── images/                     # NanoBanana generated images
│   ├── audio/                      # Music + SFX files
│   └── fonts/
├── wrangler.toml
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Phase 1: Project Setup

### Task 1: Scaffold Vite React TypeScript Project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `src/main.tsx`, `src/App.tsx`, `index.html`

**Step 1: Initialize project**

```bash
cd /c/Users/thoma/OneDrive/Dokumente/GitHub/RiddleMaster
npm create vite@latest . -- --template react-ts
```

Select "Ignore files and continue" if prompted about existing files.

**Step 2: Install dependencies**

```bash
npm install react-router-dom framer-motion howler uuid
npm install -D @types/howler @types/uuid @cloudflare/workers-types wrangler
```

**Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server runs on localhost:5173 with default React template.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite React TypeScript project with dependencies"
```

### Task 2: Configure Cloudflare Pages + D1

**Files:**
- Create: `wrangler.toml`, `migrations/0001_initial.sql`
- Modify: `vite.config.ts`

**Step 1: Create wrangler.toml**

```toml
name = "sternenreise"
compatibility_date = "2024-12-01"
pages_build_output_dir = "./dist"

[[d1_databases]]
binding = "DB"
database_name = "sternenreise-db"
database_id = "" # Will be filled after creation
```

**Step 2: Create D1 migration**

```sql
-- migrations/0001_initial.sql
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id),
  chapter INTEGER NOT NULL CHECK(chapter BETWEEN 1 AND 7),
  puzzle INTEGER NOT NULL CHECK(puzzle BETWEEN 1 AND 4),
  solved INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0 CHECK(hints_used BETWEEN 0 AND 2),
  solved_at TEXT,
  UNIQUE(player_id, chapter, puzzle)
);

CREATE TABLE IF NOT EXISTS collected_clues (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id),
  chapter INTEGER NOT NULL,
  clue_text TEXT NOT NULL,
  collected_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(player_id, chapter)
);
```

**Step 3: Create D1 database (requires Cloudflare account)**

```bash
npx wrangler d1 create sternenreise-db
```

Copy the output `database_id` into `wrangler.toml`.

**Step 4: Run migration locally**

```bash
npx wrangler d1 execute sternenreise-db --local --file=./migrations/0001_initial.sql
```

**Step 5: Commit**

```bash
git add wrangler.toml migrations/
git commit -m "chore: configure Cloudflare Pages + D1 schema"
```

---

## Phase 2: Backend API

### Task 3: TypeScript Types for API

**Files:**
- Create: `functions/api/_types.ts`

**Step 1: Create shared API types**

```typescript
// functions/api/_types.ts
export interface Env {
  DB: D1Database;
}

export interface Player {
  id: string;
  name: string;
  created_at: string;
}

export interface Progress {
  id: string;
  player_id: string;
  chapter: number;
  puzzle: number;
  solved: number;
  hints_used: number;
  solved_at: string | null;
}

export interface CollectedClue {
  id: string;
  player_id: string;
  chapter: number;
  clue_text: string;
  collected_at: string;
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status);
}
```

**Step 2: Commit**

```bash
git add functions/
git commit -m "feat: add API type definitions and response helpers"
```

### Task 4: Player & Progress API Endpoints

**Files:**
- Create: `functions/api/player.ts`, `functions/api/progress.ts`, `functions/api/progress/[playerId].ts`, `functions/api/clue.ts`

**Step 1: Create player endpoint**

```typescript
// functions/api/player.ts
import { Env, Player, Progress, CollectedClue, jsonResponse, errorResponse } from "./_types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { name } = await context.request.json<{ name: string }>();

  if (!name || name.trim().length === 0) {
    return errorResponse("Name is required");
  }

  const trimmedName = name.trim();
  const db = context.env.DB;

  // Try to find existing player
  const existing = await db
    .prepare("SELECT * FROM players WHERE name = ?")
    .bind(trimmedName)
    .first<Player>();

  if (existing) {
    // Load their progress
    const progress = await db
      .prepare("SELECT * FROM progress WHERE player_id = ?")
      .bind(existing.id)
      .all<Progress>();

    const clues = await db
      .prepare("SELECT * FROM collected_clues WHERE player_id = ?")
      .bind(existing.id)
      .all<CollectedClue>();

    return jsonResponse({
      player: existing,
      progress: progress.results,
      clues: clues.results,
      isReturning: true,
    });
  }

  // Create new player
  const id = crypto.randomUUID();
  await db
    .prepare("INSERT INTO players (id, name) VALUES (?, ?)")
    .bind(id, trimmedName)
    .run();

  return jsonResponse({
    player: { id, name: trimmedName, created_at: new Date().toISOString() },
    progress: [],
    clues: [],
    isReturning: false,
  }, 201);
};
```

**Step 2: Create get-progress endpoint**

```typescript
// functions/api/progress/[playerId].ts
import { Env, Progress, CollectedClue, jsonResponse, errorResponse } from "../_types";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const playerId = context.params.playerId as string;
  const db = context.env.DB;

  const progress = await db
    .prepare("SELECT * FROM progress WHERE player_id = ?")
    .bind(playerId)
    .all<Progress>();

  const clues = await db
    .prepare("SELECT * FROM collected_clues WHERE player_id = ?")
    .bind(playerId)
    .all<CollectedClue>();

  return jsonResponse({ progress: progress.results, clues: clues.results });
};
```

**Step 3: Create save-progress endpoint**

```typescript
// functions/api/progress.ts
import { Env, jsonResponse, errorResponse } from "./_types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { playerId, chapter, puzzle, hintsUsed } = await context.request.json<{
    playerId: string;
    chapter: number;
    puzzle: number;
    hintsUsed: number;
  }>();

  if (!playerId || !chapter || !puzzle) {
    return errorResponse("playerId, chapter, and puzzle are required");
  }

  const db = context.env.DB;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO progress (id, player_id, chapter, puzzle, solved, hints_used, solved_at)
       VALUES (?, ?, ?, ?, 1, ?, ?)
       ON CONFLICT(player_id, chapter, puzzle) DO UPDATE SET
         solved = 1, hints_used = excluded.hints_used, solved_at = excluded.solved_at`
    )
    .bind(id, playerId, chapter, puzzle, hintsUsed ?? 0, now)
    .run();

  return jsonResponse({ success: true });
};
```

**Step 4: Create clue endpoint**

```typescript
// functions/api/clue.ts
import { Env, jsonResponse, errorResponse } from "./_types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { playerId, chapter, clueText } = await context.request.json<{
    playerId: string;
    chapter: number;
    clueText: string;
  }>();

  if (!playerId || !chapter || !clueText) {
    return errorResponse("playerId, chapter, and clueText are required");
  }

  const db = context.env.DB;
  const id = crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO collected_clues (id, player_id, chapter, clue_text)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(player_id, chapter) DO NOTHING`
    )
    .bind(id, playerId, chapter, clueText)
    .run();

  return jsonResponse({ success: true });
};
```

**Step 5: Test locally with wrangler**

```bash
npx wrangler pages dev ./dist --d1=DB
```

Test with curl:
```bash
curl -X POST http://localhost:8788/api/player -H "Content-Type: application/json" -d '{"name":"Test"}'
```

Expected: JSON response with player object.

**Step 6: Commit**

```bash
git add functions/
git commit -m "feat: implement REST API endpoints for player, progress, and clues"
```

---

## Phase 3: Core Game Engine

### Task 5: Frontend TypeScript Types

**Files:**
- Create: `src/types.ts`

**Step 1: Create game types**

```typescript
// src/types.ts
export type PuzzleType =
  | "melody-sequence" | "connections" | "maze" | "word-chain"
  | "star-compass" | "crossword" | "memory" | "number-sequence"
  | "symmetry" | "anagram" | "slide-puzzle" | "spot-difference"
  | "logic-deduction" | "rebus" | "nonogram" | "word-search"
  | "cipher" | "jigsaw" | "star-sudoku" | "pipe-puzzle"
  | "quiz" | "morse-code" | "tangram" | "syllable-puzzle"
  | "meta-puzzle" | "simon-says" | "sorting" | "image-puzzle";

export interface PuzzleDef {
  id: string;
  chapter: number;
  puzzleIndex: number; // 1-4 within chapter
  type: PuzzleType;
  title: string;
  description: string;
  isSignature: boolean;
  data: Record<string, unknown>; // Puzzle-specific data
  hints: [string, string]; // Two hints per puzzle
  clue?: string; // Meta-puzzle clue revealed on solve
  backgroundImage?: string;
}

export interface ChapterDef {
  id: number;
  name: string;
  constellation: string;
  theme: string;
  storyIntro: string;
  storyOutro: string;
  introImage: string;
  puzzles: PuzzleDef[];
}

export interface PlayerState {
  id: string;
  name: string;
}

export interface ProgressEntry {
  chapter: number;
  puzzle: number;
  solved: boolean;
  hintsUsed: number;
}

export interface GameState {
  player: PlayerState | null;
  progress: ProgressEntry[];
  clues: { chapter: number; clueText: string }[];
  currentChapter: number | null;
  currentPuzzle: number | null;
}

export interface PuzzleComponentProps {
  puzzle: PuzzleDef;
  onSolved: () => void;
  onHint: (hintIndex: number) => void;
  hintsUsed: number;
}
```

**Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat: add TypeScript type definitions for game engine"
```

### Task 6: Theme Constants & Global Styles

**Files:**
- Create: `src/styles/theme.ts`, `src/styles/global.css`

**Step 1: Create theme constants**

```typescript
// src/styles/theme.ts
export const colors = {
  bgDeep: "#0a0e27",
  bgViolet: "#1a0533",
  gold: "#ffd700",
  silver: "#c0c0e0",
  cyan: "#00d4ff",
  textPrimary: "#e8e8f0",
  textDim: "#8888aa",
  error: "#ff6b6b",
  success: "#ffd700",
  starWhite: "#ffffff",
  nebulaBlue: "#1a3a5c",
  nebulaPurple: "#3d1f5c",
} as const;

export const fonts = {
  heading: "'Cinzel', serif",
  body: "'Inter', sans-serif",
} as const;
```

**Step 2: Create global CSS**

```css
/* src/styles/global.css */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Inter', sans-serif;
  background: #0a0e27;
  color: #e8e8f0;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: 'Cinzel', serif;
  font-weight: 700;
}

button {
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

input {
  font-family: 'Inter', sans-serif;
}
```

**Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: add theme constants and global styles"
```

### Task 7: Framer Motion Animation Presets

**Files:**
- Create: `src/styles/animations.ts`

**Step 1: Create animation variants**

```typescript
// src/styles/animations.ts
import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

export const stagger = (staggerDelay = 0.1): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerDelay } },
});

export const starPulse: Variants = {
  idle: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export const goldenGlow: Variants = {
  idle: {
    filter: [
      "drop-shadow(0 0 8px #ffd70066)",
      "drop-shadow(0 0 16px #ffd700aa)",
      "drop-shadow(0 0 8px #ffd70066)",
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};
```

**Step 2: Commit**

```bash
git add src/styles/animations.ts
git commit -m "feat: add Framer Motion animation presets"
```

### Task 8: API Client Hook

**Files:**
- Create: `src/hooks/useApi.ts`

**Step 1: Create API client**

```typescript
// src/hooks/useApi.ts
import { ProgressEntry } from "../types";

const API_BASE = "/api";

interface PlayerResponse {
  player: { id: string; name: string; created_at: string };
  progress: ProgressEntry[];
  clues: { chapter: number; clue_text: string }[];
  isReturning: boolean;
}

export function useApi() {
  async function loginOrCreate(name: string): Promise<PlayerResponse> {
    const res = await fetch(`${API_BASE}/player`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to login/create player");
    return res.json();
  }

  async function loadProgress(playerId: string) {
    const res = await fetch(`${API_BASE}/progress/${playerId}`);
    if (!res.ok) throw new Error("Failed to load progress");
    return res.json();
  }

  async function savePuzzleSolved(
    playerId: string,
    chapter: number,
    puzzle: number,
    hintsUsed: number
  ) {
    const res = await fetch(`${API_BASE}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, chapter, puzzle, hintsUsed }),
    });
    if (!res.ok) throw new Error("Failed to save progress");
    return res.json();
  }

  async function saveClue(playerId: string, chapter: number, clueText: string) {
    const res = await fetch(`${API_BASE}/clue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, chapter, clueText }),
    });
    if (!res.ok) throw new Error("Failed to save clue");
    return res.json();
  }

  return { loginOrCreate, loadProgress, savePuzzleSolved, saveClue };
}
```

**Step 2: Commit**

```bash
git add src/hooks/useApi.ts
git commit -m "feat: add API client hook"
```

### Task 9: Game State Context

**Files:**
- Create: `src/context/GameContext.tsx`

**Step 1: Create game context**

```tsx
// src/context/GameContext.tsx
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { GameState, ProgressEntry } from "../types";
import { useApi } from "../hooks/useApi";

interface GameContextValue extends GameState {
  login: (name: string) => Promise<boolean>;
  solvePuzzle: (chapter: number, puzzle: number, hintsUsed: number) => Promise<void>;
  collectClue: (chapter: number, clueText: string) => Promise<void>;
  setCurrentChapter: (chapter: number | null) => void;
  setCurrentPuzzle: (puzzle: number | null) => void;
  isPuzzleSolved: (chapter: number, puzzle: number) => boolean;
  isChapterComplete: (chapter: number) => boolean;
  isChapterUnlocked: (chapter: number) => boolean;
  getHintsUsed: (chapter: number, puzzle: number) => number;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    player: null,
    progress: [],
    clues: [],
    currentChapter: null,
    currentPuzzle: null,
  });

  const api = useApi();

  const login = useCallback(async (name: string): Promise<boolean> => {
    const res = await api.loginOrCreate(name);
    setState((s) => ({
      ...s,
      player: { id: res.player.id, name: res.player.name },
      progress: res.progress.map((p) => ({
        chapter: p.chapter,
        puzzle: p.puzzle,
        solved: !!p.solved,
        hintsUsed: p.hints_used ?? p.hintsUsed ?? 0,
      })),
      clues: res.clues.map((c) => ({
        chapter: c.chapter,
        clueText: c.clue_text ?? c.clueText,
      })),
    }));
    return res.isReturning;
  }, [api]);

  const solvePuzzle = useCallback(async (
    chapter: number, puzzle: number, hintsUsed: number
  ) => {
    if (!state.player) return;
    await api.savePuzzleSolved(state.player.id, chapter, puzzle, hintsUsed);
    setState((s) => ({
      ...s,
      progress: [
        ...s.progress.filter((p) => !(p.chapter === chapter && p.puzzle === puzzle)),
        { chapter, puzzle, solved: true, hintsUsed },
      ],
    }));
  }, [state.player, api]);

  const collectClue = useCallback(async (chapter: number, clueText: string) => {
    if (!state.player) return;
    await api.saveClue(state.player.id, chapter, clueText);
    setState((s) => ({
      ...s,
      clues: [...s.clues.filter((c) => c.chapter !== chapter), { chapter, clueText }],
    }));
  }, [state.player, api]);

  const isPuzzleSolved = useCallback((chapter: number, puzzle: number) => {
    return state.progress.some((p) => p.chapter === chapter && p.puzzle === puzzle && p.solved);
  }, [state.progress]);

  const isChapterComplete = useCallback((chapter: number) => {
    const chapterPuzzles = [1, 2, 3, 4];
    return chapterPuzzles.every((p) => isPuzzleSolved(chapter, p));
  }, [isPuzzleSolved]);

  const isChapterUnlocked = useCallback((chapter: number) => {
    if (chapter === 1) return true;
    return isChapterComplete(chapter - 1);
  }, [isChapterComplete]);

  const getHintsUsed = useCallback((chapter: number, puzzle: number) => {
    const entry = state.progress.find((p) => p.chapter === chapter && p.puzzle === puzzle);
    return entry?.hintsUsed ?? 0;
  }, [state.progress]);

  const setCurrentChapter = useCallback((chapter: number | null) => {
    setState((s) => ({ ...s, currentChapter: chapter }));
  }, []);

  const setCurrentPuzzle = useCallback((puzzle: number | null) => {
    setState((s) => ({ ...s, currentPuzzle: puzzle }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        login,
        solvePuzzle,
        collectClue,
        setCurrentChapter,
        setCurrentPuzzle,
        isPuzzleSolved,
        isChapterComplete,
        isChapterUnlocked,
        getHintsUsed,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
```

**Step 2: Commit**

```bash
git add src/context/
git commit -m "feat: add game state context with D1 sync"
```

### Task 10: Canvas Starfield Background

**Files:**
- Create: `src/hooks/useStarfield.ts`, `src/components/Starfield.tsx`

**Step 1: Create starfield hook**

The hook manages a full-screen canvas with twinkling stars, occasional shooting stars, and subtle nebula gradients. Uses `requestAnimationFrame` for smooth 60fps animation. Stars have random positions, sizes, and twinkle phases.

```typescript
// src/hooks/useStarfield.ts
import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  phase: number;
  speed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function useStarfield(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      const count = Math.floor((canvas!.width * canvas!.height) / 3000);
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        radius: Math.random() * 1.8 + 0.2,
        alpha: Math.random(),
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
      }));
    }

    function drawNebula(ctx: CanvasRenderingContext2D) {
      const g1 = ctx.createRadialGradient(
        canvas!.width * 0.3, canvas!.height * 0.4, 0,
        canvas!.width * 0.3, canvas!.height * 0.4, canvas!.width * 0.4
      );
      g1.addColorStop(0, "rgba(61, 31, 92, 0.08)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);

      const g2 = ctx.createRadialGradient(
        canvas!.width * 0.7, canvas!.height * 0.6, 0,
        canvas!.width * 0.7, canvas!.height * 0.6, canvas!.width * 0.3
      );
      g2.addColorStop(0, "rgba(26, 58, 92, 0.06)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
    }

    function animate() {
      time += 1;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Background gradient
      const bg = ctx!.createLinearGradient(0, 0, 0, canvas!.height);
      bg.addColorStop(0, "#0a0e27");
      bg.addColorStop(1, "#1a0533");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      drawNebula(ctx!);

      // Stars
      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * star.speed + star.phase) * 0.4 + 0.6;
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${star.alpha * twinkle})`;
        ctx!.fill();
      }

      // Shooting stars (random spawn)
      if (Math.random() < 0.003) {
        shootingStarsRef.current.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height * 0.5,
          vx: (Math.random() - 0.3) * 8,
          vy: Math.random() * 4 + 2,
          life: 0,
          maxLife: 40 + Math.random() * 30,
        });
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const alpha = 1 - s.life / s.maxLife;
        ctx!.beginPath();
        ctx!.moveTo(s.x, s.y);
        ctx!.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
        ctx!.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
        return s.life < s.maxLife;
      });

      animId = requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}
```

**Step 2: Create Starfield component**

```tsx
// src/components/Starfield.tsx
import { useRef } from "react";
import { useStarfield } from "../hooks/useStarfield";

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useStarfield(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
```

**Step 3: Commit**

```bash
git add src/hooks/useStarfield.ts src/components/Starfield.tsx
git commit -m "feat: add animated canvas starfield background"
```

### Task 11: Audio System

**Files:**
- Create: `src/hooks/useAudio.ts`, `src/components/AudioControls.tsx`, `src/components/AudioControls.module.css`

**Step 1: Create audio hook**

```typescript
// src/hooks/useAudio.ts
import { useRef, useState, useCallback, useEffect } from "react";
import { Howl, Howler } from "howler";

const tracks: Record<string, string> = {
  ambient: "/audio/ambient.mp3",
};

const sfx: Record<string, string> = {
  click: "/audio/click.mp3",
  solved: "/audio/solved.mp3",
  reveal: "/audio/reveal.mp3",
};

export function useAudio() {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const musicRef = useRef<Howl | null>(null);

  useEffect(() => {
    Howler.volume(volume);
  }, [volume]);

  useEffect(() => {
    Howler.mute(muted);
  }, [muted]);

  const playMusic = useCallback((track: keyof typeof tracks = "ambient") => {
    if (musicRef.current) {
      musicRef.current.stop();
    }
    musicRef.current = new Howl({
      src: [tracks[track]],
      loop: true,
      volume: 0.3,
    });
    musicRef.current.play();
  }, []);

  const stopMusic = useCallback(() => {
    musicRef.current?.stop();
  }, []);

  const playSfx = useCallback((name: keyof typeof sfx) => {
    new Howl({ src: [sfx[name]], volume: 0.5 }).play();
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return { muted, volume, setVolume, toggleMute, playMusic, stopMusic, playSfx };
}
```

**Step 2: Create AudioControls component**

```tsx
// src/components/AudioControls.tsx
import { useAudio } from "../hooks/useAudio";
import styles from "./AudioControls.module.css";

interface Props {
  audio: ReturnType<typeof useAudio>;
}

export default function AudioControls({ audio }: Props) {
  return (
    <div className={styles.controls}>
      <button className={styles.muteBtn} onClick={audio.toggleMute}>
        {audio.muted ? "🔇" : "🔊"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={audio.volume}
        onChange={(e) => audio.setVolume(parseFloat(e.target.value))}
        className={styles.slider}
      />
    </div>
  );
}
```

```css
/* src/components/AudioControls.module.css */
.controls {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(10, 14, 39, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: 1px solid rgba(192, 192, 224, 0.15);
}

.muteBtn {
  background: none;
  border: none;
  font-size: 1.2rem;
  padding: 0.25rem;
}

.slider {
  width: 80px;
  accent-color: #ffd700;
}
```

**Step 3: Commit**

```bash
git add src/hooks/useAudio.ts src/components/AudioControls.tsx src/components/AudioControls.module.css
git commit -m "feat: add audio system with music and SFX support"
```

### Task 12: Router & App Shell

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`
- Create: `src/components/Layout.tsx`, `src/components/Layout.module.css`

**Step 1: Create Layout component**

```tsx
// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Starfield from "./Starfield";
import AudioControls from "./AudioControls";
import { useAudio } from "../hooks/useAudio";
import styles from "./Layout.module.css";

export default function Layout() {
  const audio = useAudio();

  return (
    <div className={styles.layout}>
      <Starfield />
      <main className={styles.content}>
        <AnimatePresence mode="wait">
          <Outlet context={{ audio }} />
        </AnimatePresence>
      </main>
      <AudioControls audio={audio} />
    </div>
  );
}
```

```css
/* src/components/Layout.module.css */
.layout {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

**Step 2: Set up App.tsx with routes**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Layout from "./components/Layout";
import StartScreen from "./screens/StartScreen";
import SkyMap from "./screens/SkyMap";
import ChapterIntro from "./screens/ChapterIntro";
import PuzzleSelect from "./screens/PuzzleSelect";
import PuzzleScreen from "./screens/PuzzleScreen";
import PuzzleSolved from "./screens/PuzzleSolved";
import ConstellationReveal from "./screens/ConstellationReveal";
import Finale from "./screens/Finale";

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<StartScreen />} />
            <Route path="/map" element={<SkyMap />} />
            <Route path="/chapter/:chapterId" element={<ChapterIntro />} />
            <Route path="/chapter/:chapterId/puzzles" element={<PuzzleSelect />} />
            <Route path="/chapter/:chapterId/puzzle/:puzzleId" element={<PuzzleScreen />} />
            <Route path="/chapter/:chapterId/puzzle/:puzzleId/solved" element={<PuzzleSolved />} />
            <Route path="/chapter/:chapterId/reveal" element={<ConstellationReveal />} />
            <Route path="/finale" element={<Finale />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}
```

**Step 3: Update main.tsx**

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**Step 4: Verify app compiles and renders**

```bash
npm run dev
```

Expected: App loads with starfield background on `localhost:5173`.

**Step 5: Commit**

```bash
git add src/App.tsx src/main.tsx src/components/Layout.tsx src/components/Layout.module.css
git commit -m "feat: add router, app shell, and layout with starfield"
```

---

## Phase 4: UI Screens

### Task 13: Start Screen

**Files:**
- Create: `src/screens/StartScreen.tsx`, `src/screens/StartScreen.module.css`

The start screen shows the game title "Sternenreise" in a large Cinzel heading with a golden glow. Below it, a text input for the player's name and a "Reise beginnen" button. On submit, calls `login()` from GameContext. If returning player, show "Willkommen zurück, {name}!" before navigating to `/map`. Fade-in animation via Framer Motion.

**Step 1: Implement StartScreen component and CSS module**

Full implementation with:
- Title with golden text-shadow
- Name input with cosmic styling (dark background, gold border on focus)
- Submit button with gradient (violet → blue)
- Loading state during API call
- Error handling if API fails
- Navigate to `/map` on success

**Step 2: Commit**

```bash
git add src/screens/StartScreen.tsx src/screens/StartScreen.module.css
git commit -m "feat: add start screen with name input"
```

### Task 14: Sky Map Screen

**Files:**
- Create: `src/screens/SkyMap.tsx`, `src/screens/SkyMap.module.css`

The sky map displays 7 constellation positions on the screen. Each constellation is a clickable node:
- **Locked** (grey, no interaction): chapter not yet unlocked
- **Available** (silver, pulsing): chapter unlocked, puzzles remaining
- **Complete** (golden glow, constellation lines drawn): all puzzles solved

Clicking an available constellation navigates to `/chapter/{id}`. Uses `isChapterUnlocked` and `isChapterComplete` from GameContext. Constellation positions are hardcoded as percentage coordinates for responsive layout.

If all 7 are complete, auto-navigate to `/finale`.

**Step 1: Implement SkyMap component with constellation positioning and state rendering**

**Step 2: Commit**

```bash
git add src/screens/SkyMap.tsx src/screens/SkyMap.module.css
git commit -m "feat: add sky map screen with constellation nodes"
```

### Task 15: Chapter Intro Screen

**Files:**
- Create: `src/screens/ChapterIntro.tsx`, `src/screens/ChapterIntro.module.css`

Shows the chapter's generated intro image (full-width, slightly dimmed), overlaid with the chapter name ("Kapitel 1 — Lyra"), subtitle ("Musik & Harmonie"), and 2-3 sentences of story text. A "Rätsel erkunden" button at the bottom navigates to `/chapter/{id}/puzzles`.

Reads `chapterId` from route params, looks up chapter data from `src/data/chapters.ts`.

**Step 1: Implement ChapterIntro component**

**Step 2: Commit**

```bash
git add src/screens/ChapterIntro.tsx src/screens/ChapterIntro.module.css
git commit -m "feat: add chapter intro screen with story text"
```

### Task 16: Puzzle Select Screen

**Files:**
- Create: `src/screens/PuzzleSelect.tsx`, `src/screens/PuzzleSelect.module.css`

Shows the chapter's 4 puzzles as star-shaped interactive nodes arranged in a pattern. Each node shows:
- Puzzle title
- Solved state (golden) vs available (silver, pulsing) — all puzzles within a chapter are always available
- Click navigates to `/chapter/{id}/puzzle/{puzzleIndex}`

A "Zurück zur Karte" button returns to `/map`.
If all 4 are solved, show a "Sternbild enthüllen" button that goes to `/chapter/{id}/reveal`.

**Step 1: Implement PuzzleSelect component**

**Step 2: Commit**

```bash
git add src/screens/PuzzleSelect.tsx src/screens/PuzzleSelect.module.css
git commit -m "feat: add puzzle selection screen"
```

### Task 17: Puzzle Screen, Solved Screen, Constellation Reveal, Finale

**Files:**
- Create: `src/screens/PuzzleScreen.tsx`, `src/screens/PuzzleSolved.tsx`, `src/screens/ConstellationReveal.tsx`, `src/screens/Finale.tsx`, `src/components/PuzzleFrame.tsx`, `src/components/HintButton.tsx` + CSS modules for each

**PuzzleScreen:** Loads the puzzle definition from chapter data, renders the corresponding puzzle component via a registry lookup. Wraps it in `PuzzleFrame` which provides the hint button, back button, and chapter/puzzle title. On solve, calls `solvePuzzle()` from GameContext and navigates to solved screen.

**PuzzleSolved:** Celebratory screen with stardust particle animation, encouraging message ("Wunderbar! Du hast das Rätsel gelöst!"), and navigation back to puzzle select.

**ConstellationReveal:** Animated SVG drawing the constellation lines one by one in gold, with story outro text. Button to return to sky map.

**Finale:** Full-screen celebration. All 7 constellations drawn in gold. Personal message revealed: "Für dich leuchten die Sterne." (can be customized). Looping stardust/particle animation.

**HintButton:** Glowing lightbulb button. Click reveals hint text in a modal overlay. Shows "Hinweis 1/2" or "Hinweis 2/2". Tracks hints used via GameContext.

**Step 1: Implement PuzzleFrame with HintButton**

**Step 2: Implement PuzzleScreen that loads puzzle from registry**

**Step 3: Implement PuzzleSolved with particle animation**

**Step 4: Implement ConstellationReveal with SVG line-drawing animation**

**Step 5: Implement Finale screen**

**Step 6: Commit**

```bash
git add src/screens/ src/components/PuzzleFrame.tsx src/components/HintButton.tsx src/components/*.module.css
git commit -m "feat: add puzzle screen, solved, constellation reveal, and finale screens"
```

---

## Phase 5: Chapter Data

### Task 18: Chapter Definitions & Story Text

**Files:**
- Create: `src/data/chapters.ts`

Define all 7 chapters with: id, name, constellation, theme, storyIntro (2-3 sentences), storyOutro (1-2 sentences), introImage path, and puzzle references. Story text should be atmospheric and poetic, fitting the ethereal star theme.

Example:
```typescript
export const chapters: ChapterDef[] = [
  {
    id: 1,
    name: "Lyra",
    constellation: "Lyra",
    theme: "Musik & Harmonie",
    storyIntro: "In der Stille der Nacht hörst du ein zartes Summen. Die Lyra, einst das Instrument des Orpheus, hat ihre Melodie vergessen. Nur wer die richtigen Töne findet, kann ihre Saiten wieder zum Klingen bringen.",
    storyOutro: "Die Lyra erklingt wieder! Ihre Melodie schwebt durch die Nacht und weist den Weg zu neuen Sternen.",
    introImage: "/images/chapter1-lyra.png",
    puzzles: [/* puzzle definitions */],
  },
  // ... chapters 2-7
];
```

**Step 1: Write all 7 chapter definitions with German story text**

**Step 2: Commit**

```bash
git add src/data/chapters.ts
git commit -m "feat: add chapter definitions with story text"
```

---

## Phase 6: Puzzle Components (one task per puzzle type)

Each puzzle component receives `PuzzleComponentProps` and must call `onSolved()` when the player completes it. All puzzle components are self-contained with their own CSS modules.

### Task 19: Puzzle Registry

**Files:**
- Create: `src/puzzles/index.ts`

Maps `PuzzleType` → React component via lazy loading:

```typescript
import { lazy } from "react";
import { PuzzleType } from "../types";

const registry: Record<PuzzleType, React.LazyExoticComponent<any>> = {
  "melody-sequence": lazy(() => import("./MelodySequence")),
  "connections": lazy(() => import("./Connections")),
  "maze": lazy(() => import("./Maze")),
  // ... all 20 types
};

export default registry;
```

**Step 1: Create registry with lazy imports for all 20 types**

**Step 2: Create placeholder components for all 20 types** (each exports a default component that renders "TODO: {type}")

**Step 3: Commit**

```bash
git add src/puzzles/
git commit -m "feat: add puzzle registry with placeholder components"
```

### Task 20: Melody Sequence Puzzle (Chapter 1 Signature)

**Files:**
- Create: `src/puzzles/MelodySequence.tsx`, `src/puzzles/MelodySequence.module.css`

**Mechanic:** 5-7 stars are displayed, each mapped to a musical note (using Web Audio API). The game plays a sequence, then the player must click the stars in the correct order. Starts with 3 notes, adds one each round until the full sequence is played correctly.

**Data shape:** `{ notes: number[], starPositions: {x,y}[] }`

Stars glow when their note plays. Wrong click = gentle shake animation + reset current attempt. Correct full sequence = onSolved().

### Task 21: Connections Puzzle (Chapter 1)

**Files:**
- Create: `src/puzzles/Connections.tsx`, `src/puzzles/Connections.module.css`

**Mechanic:** 16 words displayed in a 4x4 grid. Player selects 4 words that belong to the same group. 4 groups total. When a correct group is found, the 4 words animate together and show the group label. Similar to NYT Connections.

**Data shape:** `{ groups: { label: string, words: string[], color: string }[] }`

### Task 22: Maze Puzzle (Chapter 1)

**Files:**
- Create: `src/puzzles/Maze.tsx`, `src/puzzles/Maze.module.css`

**Mechanic:** Canvas-rendered maze with glowing walls. Player moves a light orb using arrow keys or touch/swipe. Fog of war — only nearby area is visible. Reaching the exit star = onSolved(). Maze is generated from a grid definition in puzzle data.

**Data shape:** `{ grid: number[][], start: [number, number], end: [number, number], width: number, height: number }`

### Task 23: Word Chain Puzzle (Chapter 1)

**Files:**
- Create: `src/puzzles/WordChain.tsx`, `src/puzzles/WordChain.module.css`

**Mechanic:** Given a starting word, player must type words where each word begins with the last letter of the previous word. Must reach a target word in exactly N steps. Shows the chain building visually.

**Data shape:** `{ startWord: string, targetWord: string, steps: number, validPaths: string[][] }`

### Task 24: Star Compass Puzzle (Chapter 2 Signature)

**Mechanic:** A grid map with a hidden star. Player receives directional instructions one at a time ("3 Schritte nach Norden, 2 nach Osten..."). Must track position mentally and click the final cell. Map has cosmic decoration.

**Data shape:** `{ gridSize: number, start: [number, number], instructions: { direction: string, steps: number }[], answer: [number, number] }`

### Task 25: Crossword, Memory, Number Sequence (Chapter 2)

**Crossword:** Classic crossword grid with cosmic-themed clues. Player types letters into cells. Correct completion = onSolved().

**Memory:** Card-flip memory game with constellation artwork. Find all pairs. Cards have a starry back pattern.

**Number Sequence:** Show 5-6 numbers of a sequence, player must enter the next 2. Multiple sequences per puzzle, increasing difficulty.

### Task 26: Symmetry, Anagram, Slide Puzzle, Spot Difference (Chapter 3)

**Symmetry:** Half of a star pattern shown on a grid. Player clicks cells to mirror it. Correct mirror = onSolved().

**Anagram:** Jumbled letters displayed as floating stars. Player drags or clicks to rearrange into the correct constellation name.

**Slide Puzzle:** Classic 4x4 slide puzzle (15-puzzle) with a constellation image split into tiles.

**Spot Difference:** Two similar constellation images side by side. Player clicks on 5 differences. Found differences get a golden circle marker.

### Task 27: Logic Deduction, Rebus, Nonogram, Word Search (Chapter 4)

**Logic Deduction:** Einstein-riddle style. 4 stars, each with 3 attributes. Clues provided. Player fills a grid assigning attributes to stars.

**Rebus:** Series of images that phonetically form a word. Player types the answer.

**Nonogram:** Grid puzzle with row/column number hints. Player fills cells to reveal a pixel-art constellation.

**Word Search:** Letter grid with hidden astronomy words. Player clicks/drags to highlight words. Word list shown on the side.

### Task 28: Cipher, Jigsaw, Star Sudoku, Pipe Puzzle (Chapter 5)

**Cipher:** Encrypted message shown with a Caesar cipher. Player can adjust the shift with a rotary dial. Correct shift reveals the message. Player types the decoded keyword.

**Jigsaw:** Image split into irregular pieces. Player drags pieces to correct positions. Snap-to-grid when close enough.

**Star Sudoku:** 6x6 grid with star symbols (6 different star types) instead of numbers. Standard sudoku rules.

**Pipe Puzzle:** Grid of pipe segments. Player rotates pipes by clicking to connect starlight from source to target. All pipes glow when connected.

### Task 29: Quiz, Morse Code, Tangram, Syllable Puzzle (Chapter 6)

**Quiz:** 8 multiple-choice questions about astronomy and mythology. Need 6/8 correct. Shows correct/incorrect after each answer. Themed with star decorations.

**Morse Code:** Stars blink in Morse code pattern. Player has a Morse reference card and must decode the message. Replay button available.

**Tangram:** 7 geometric pieces to arrange into a dragon constellation shape. Drag & rotate pieces. Correct placement snaps into position.

**Syllable Puzzle:** Pool of syllables displayed as floating stars. Player combines them into astronomy terms. E.g., "Son" + "nen" + "sys" + "tem" → "Sonnensystem".

### Task 30: Meta Puzzle, Simon Says, Sorting, Image Puzzle (Chapter 7)

**Meta Puzzle:** Each solved chapter reveals a clue word. The 6 clue words from chapters 1-6 must be combined/decoded into a final answer. Interface shows collected clues and an input field.

**Simon Says:** Stars flash in a sequence. Player must repeat by clicking in order. Starts at 4, goes up to 8. Faster than Chapter 1's melody sequence.

**Sorting:** List of celestial objects that must be dragged into correct order (e.g., planets by distance from sun). Multiple rounds with different sorting criteria.

**Image Puzzle:** Details/crops from all chapter images are shown. Player must identify which chapter each comes from and enter the first letter of each constellation name to form a word.

---

## Phase 7: Puzzle Data

### Task 31: Create Puzzle Data for All 7 Chapters

**Files:**
- Create: `src/data/puzzles/chapter1.ts` through `chapter7.ts`
- Create: `src/data/hints.ts`

Each chapter file exports an array of 4 `PuzzleDef` objects with:
- Unique id (e.g., "ch1-melody")
- Puzzle type
- Title and description (in German)
- `data` object matching the puzzle component's expected shape
- Two hints in German
- Optional clue for the meta-puzzle

This task requires crafting actual puzzle content — real crossword clues, real quiz questions, real maze layouts, etc. All content in German.

**Step 1: Write puzzle data for chapters 1-3**

**Step 2: Write puzzle data for chapters 4-5**

**Step 3: Write puzzle data for chapters 6-7**

**Step 4: Write hints for all 28 puzzles**

**Step 5: Commit**

```bash
git add src/data/puzzles/ src/data/hints.ts
git commit -m "feat: add puzzle data and hints for all 7 chapters"
```

---

## Phase 8: Image Generation

### Task 32: Generate All Game Images via NanoBanana

**Files:**
- Output to: `public/images/`

Generate ~40-50 images. Use consistent art style prompt prefix for all images:
`"ethereal cosmic art, deep blue and violet space background, glowing stars, dreamy atmosphere, digital painting style"`

**Image list:**

| Filename | Prompt addition |
|----------|----------------|
| `title-screen.png` | ancient observatory under starry sky, telescope, golden light |
| `chapter1-lyra.png` | golden lyre floating among stars, musical notes as light |
| `chapter2-ursa.png` | little bear constellation, warm cozy northern lights |
| `chapter3-cassiopeia.png` | mirrored throne among stars, symmetrical nebula |
| `chapter4-orion.png` | mighty hunter silhouette in stars, bow and arrow of light |
| `chapter5-cygnus.png` | graceful swan made of starlight, transformation, metamorphosis |
| `chapter6-draco.png` | ancient dragon constellation, scrolls and wisdom, mystical |
| `chapter7-corona.png` | golden crown of stars, radiant, triumphant |
| `finale.png` | all constellations connected, full starry sky, golden light everywhere |
| `puzzle-bg-*.png` | 7 variations, one per chapter theme (subtle, darker, for puzzle backgrounds) |
| Per-puzzle images | ~21 puzzle-specific images (memory cards, jigsaw source, spot-difference pairs, rebus images, etc.) |

**Step 1: Generate chapter intro images (8 images)**

**Step 2: Generate puzzle background images (7 images)**

**Step 3: Generate puzzle-specific images (~25 images)**

**Step 4: Commit**

```bash
git add public/images/
git commit -m "feat: add NanoBanana-generated game images"
```

---

## Phase 9: Audio

### Task 33: Add Audio Files

**Files:**
- Output to: `public/audio/`

Source royalty-free ambient music and sound effects. Required files:

| File | Description | Source suggestion |
|------|-------------|-----------------|
| `ambient.mp3` | Main ambient track, 2-3 min loop, ethereal synth + piano | Pixabay |
| `click.mp3` | Soft chime/bell, < 1 second | Freesound |
| `solved.mp3` | Harmonious ascending chord, ~2 seconds | Freesound |
| `reveal.mp3` | Magical reveal/unveil sound, ~3 seconds | Freesound |

**Step 1: Download/source audio files**

**Step 2: Place in public/audio/**

**Step 3: Commit**

```bash
git add public/audio/
git commit -m "feat: add ambient music and sound effects"
```

---

## Phase 10: Integration & Polish

### Task 34: Wire Everything Together

**Step 1: Ensure all screens import from actual data**

- `ChapterIntro` reads from `chapters.ts`
- `PuzzleScreen` loads puzzle from chapter data and renders via registry
- `PuzzleSolved` receives solved puzzle info via route state
- `ConstellationReveal` draws the correct constellation

**Step 2: Add offline resilience**

In `useApi.ts`, add a queue that stores failed API calls in `localStorage` and retries on next successful connection.

**Step 3: Add error boundaries**

Wrap puzzle components in a React error boundary that shows a friendly message instead of crashing.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire all screens, add offline resilience and error boundaries"
```

### Task 35: Visual Polish & Responsive Design

**Step 1: Test and fix all screens on mobile viewport (375px width)**

**Step 2: Add particle burst animation for puzzle solved events**

**Step 3: Ensure all transitions use Framer Motion consistently**

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: responsive design and visual polish"
```

---

## Phase 11: Deployment

### Task 36: Deploy to Cloudflare Pages

**Step 1: Build project**

```bash
npm run build
```

**Step 2: Run D1 migration on production**

```bash
npx wrangler d1 execute sternenreise-db --remote --file=./migrations/0001_initial.sql
```

**Step 3: Deploy**

```bash
npx wrangler pages deploy ./dist
```

**Step 4: Verify deployment**

Open the deployed URL, enter a name, verify:
- Starfield animates
- Name saves to D1
- Can start chapter 1
- Progress persists across page reload
- Works on mobile

**Step 5: Commit any deployment config changes**

```bash
git add -A
git commit -m "chore: finalize deployment configuration"
```

---

## Task Dependency Graph

```
Task 1 (scaffold) → Task 2 (cloudflare config)
                  → Task 5 (types) → Task 9 (context) → Task 12 (router)
                  → Task 6 (theme) → Task 7 (animations)
Task 2 → Task 3 (API types) → Task 4 (API endpoints)
Task 5 → Task 8 (API client) → Task 9
Task 12 → Tasks 13-17 (screens) → Task 34 (integration)
Task 5 → Task 18 (chapters) → Task 31 (puzzle data) → Task 34
Task 19 (registry) → Tasks 20-30 (puzzle components) → Task 34
Task 10 (starfield) → Task 12
Task 11 (audio) → Task 12
Task 32 (images) → Task 34
Task 33 (audio files) → Task 34
Task 34 → Task 35 (polish) → Task 36 (deploy)
```

Phases 6-9 (puzzles, data, images, audio) can be worked on in parallel once the core framework (Phases 1-4) is complete.
