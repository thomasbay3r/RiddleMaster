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
  puzzleIndex: number;
  type: PuzzleType;
  title: string;
  description: string;
  isSignature: boolean;
  data: Record<string, unknown>;
  hints: [string, string];
  clue?: string;
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
