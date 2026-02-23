import { lazy } from "react";
import type { ComponentType } from "react";
import type { PuzzleType, PuzzleComponentProps } from "../types.ts";

const registry: Record<
  PuzzleType,
  React.LazyExoticComponent<ComponentType<PuzzleComponentProps>>
> = {
  // Kapitel 1 — Lyra
  "melody-sequence": lazy(() => import("./MelodySequence.tsx")),
  connections: lazy(() => import("./Connections.tsx")),
  maze: lazy(() => import("./Maze.tsx")),
  "word-chain": lazy(() => import("./WordChain.tsx")),

  // Kapitel 2 — Ursa Minor
  "star-compass": lazy(() => import("./StarCompass.tsx")),
  crossword: lazy(() => import("./Crossword.tsx")),
  memory: lazy(() => import("./Memory.tsx")),
  "number-sequence": lazy(() => import("./NumberSequence.tsx")),

  // Kapitel 3 — Cassiopeia
  symmetry: lazy(() => import("./SymmetryPuzzle.tsx")),
  anagram: lazy(() => import("./Anagram.tsx")),
  "slide-puzzle": lazy(() => import("./SlidePuzzle.tsx")),
  "spot-difference": lazy(() => import("./SpotDifference.tsx")),

  // Kapitel 4 — Orion
  "logic-deduction": lazy(() => import("./LogicDeduction.tsx")),
  rebus: lazy(() => import("./Rebus.tsx")),
  nonogram: lazy(() => import("./Nonogram.tsx")),
  "word-search": lazy(() => import("./WordSearch.tsx")),

  // Kapitel 5 — Cygnus
  cipher: lazy(() => import("./CipherBreaker.tsx")),
  jigsaw: lazy(() => import("./JigsawPuzzle.tsx")),
  "star-sudoku": lazy(() => import("./StarSudoku.tsx")),
  "pipe-puzzle": lazy(() => import("./PipePuzzle.tsx")),

  // Kapitel 6 — Draco
  quiz: lazy(() => import("./Quiz.tsx")),
  "morse-code": lazy(() => import("./MorseCode.tsx")),
  tangram: lazy(() => import("./Tangram.tsx")),
  "syllable-puzzle": lazy(() => import("./SyllablePuzzle.tsx")),

  // Kapitel 7 — Corona Borealis
  "meta-puzzle": lazy(() => import("./MetaPuzzle.tsx")),
  "simon-says": lazy(() => import("./SimonSays.tsx")),
  sorting: lazy(() => import("./SortingPuzzle.tsx")),
  "image-puzzle": lazy(() => import("./ImagePuzzle.tsx")),
};

export default registry;
