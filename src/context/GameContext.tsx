import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { GameState, PlayerState, ProgressEntry } from "../types.ts";
import { useApi } from "../hooks/useApi.ts";

/* ------------------------------------------------------------------ */
/*  Context value shape                                                */
/* ------------------------------------------------------------------ */

interface GameContextValue extends GameState {
  /* mutations */
  login: (name: string) => Promise<boolean>;
  solvePuzzle: (
    chapter: number,
    puzzle: number,
    hintsUsed: number,
  ) => Promise<void>;
  collectClue: (chapter: number, clueText: string) => Promise<void>;
  setCurrentChapter: (chapter: number | null) => void;
  setCurrentPuzzle: (puzzle: number | null) => void;

  /* queries */
  isPuzzleSolved: (chapter: number, puzzle: number) => boolean;
  isChapterComplete: (chapter: number) => boolean;
  isChapterUnlocked: (chapter: number) => boolean;
  getHintsUsed: (chapter: number, puzzle: number) => number;
}

const GameContext = createContext<GameContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Number of puzzles per chapter (1 signature + 3 regular) */
const PUZZLES_PER_CHAPTER = 4;

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function GameProvider({ children }: { children: ReactNode }) {
  const api = useApi();

  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [clues, setClues] = useState<{ chapter: number; clueText: string }[]>(
    [],
  );
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<number | null>(null);

  /* ---- mutations ------------------------------------------------- */

  const login = useCallback(
    async (name: string): Promise<boolean> => {
      const res = await api.loginOrCreate(name);

      setPlayer({ id: res.player.id, name: res.player.name });

      // Map API snake_case → frontend camelCase for progress
      setProgress(
        res.progress.map((p) => ({
          chapter: p.chapter,
          puzzle: p.puzzle,
          solved: p.solved,
          hintsUsed:
            (p as unknown as Record<string, unknown>).hints_used != null
              ? Number((p as unknown as Record<string, unknown>).hints_used)
              : p.hintsUsed,
        })),
      );

      // Map API snake_case (clue_text) → frontend camelCase (clueText)
      setClues(
        res.clues.map((c) => ({
          chapter: c.chapter,
          clueText: c.clue_text ?? "",
        })),
      );

      return res.isReturning;
    },
    [api],
  );

  const solvePuzzle = useCallback(
    async (chapter: number, puzzle: number, hintsUsed: number) => {
      // Optimistic local update
      setProgress((prev) => {
        const exists = prev.some(
          (e) => e.chapter === chapter && e.puzzle === puzzle,
        );
        if (exists) {
          return prev.map((e) =>
            e.chapter === chapter && e.puzzle === puzzle
              ? { ...e, solved: true, hintsUsed }
              : e,
          );
        }
        return [...prev, { chapter, puzzle, solved: true, hintsUsed }];
      });

      // Persist to API
      if (player) {
        await api.savePuzzleSolved(player.id, chapter, puzzle, hintsUsed);
      }
    },
    [api, player],
  );

  const collectClue = useCallback(
    async (chapter: number, clueText: string) => {
      setClues((prev) => [...prev, { chapter, clueText }]);

      if (player) {
        await api.saveClue(player.id, chapter, clueText);
      }
    },
    [api, player],
  );

  /* ---- queries --------------------------------------------------- */

  const isPuzzleSolved = useCallback(
    (chapter: number, puzzle: number): boolean =>
      progress.some(
        (e) => e.chapter === chapter && e.puzzle === puzzle && e.solved,
      ),
    [progress],
  );

  const isChapterComplete = useCallback(
    (chapter: number): boolean => {
      const solved = progress.filter(
        (e) => e.chapter === chapter && e.solved,
      ).length;
      return solved >= PUZZLES_PER_CHAPTER;
    },
    [progress],
  );

  const isChapterUnlocked = useCallback(
    (chapter: number): boolean => {
      if (chapter <= 1) return true;
      return isChapterComplete(chapter - 1);
    },
    [isChapterComplete],
  );

  const getHintsUsed = useCallback(
    (chapter: number, puzzle: number): number => {
      const entry = progress.find(
        (e) => e.chapter === chapter && e.puzzle === puzzle,
      );
      return entry?.hintsUsed ?? 0;
    },
    [progress],
  );

  /* ---- value ----------------------------------------------------- */

  const value: GameContextValue = {
    player,
    progress,
    clues,
    currentChapter,
    currentPuzzle,
    login,
    solvePuzzle,
    collectClue,
    setCurrentChapter,
    setCurrentPuzzle,
    isPuzzleSolved,
    isChapterComplete,
    isChapterUnlocked,
    getHintsUsed,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return ctx;
}
