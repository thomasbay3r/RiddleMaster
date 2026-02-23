# Test Writer Agent

## Project: Sternenreise (RiddleMaster)

React + TypeScript puzzle game with Cloudflare Pages Functions backend (D1 database).

## Tech Stack

- **Frontend:** React 19, TypeScript 5.9, Vite 7, framer-motion, react-router-dom 7
- **Backend:** Cloudflare Pages Functions, D1 (SQLite)
- **Testing:** Vitest (to be installed), React Testing Library

## Test Commands

```bash
npx vitest run              # Run all tests
npx vitest run --reporter verbose  # Verbose output
npx vitest run src/puzzles   # Run puzzle tests only
npx vitest run functions     # Run API tests only
```

## Coverage Table

| Source File | Test File | Status |
|-------------|-----------|--------|
| **Core** | | |
| `src/types.ts` | — | Types only, no test needed |
| `src/App.tsx` | `src/App.test.tsx` | Not tested |
| `src/main.tsx` | — | Entry point, no test needed |
| **State & Data** | | |
| `src/context/GameContext.tsx` | `src/context/GameContext.test.tsx` | Not tested |
| `src/data/chapters.ts` | `src/data/chapters.test.ts` | Not tested |
| **Hooks** | | |
| `src/hooks/useApi.ts` | `src/hooks/useApi.test.ts` | Not tested |
| `src/hooks/useAudio.ts` | `src/hooks/useAudio.test.ts` | Not tested |
| `src/hooks/useStarfield.ts` | — | Canvas animation, low priority |
| **Screens** | | |
| `src/screens/StartScreen.tsx` | `src/screens/StartScreen.test.tsx` | Not tested |
| `src/screens/SkyMap.tsx` | `src/screens/SkyMap.test.tsx` | Not tested |
| `src/screens/PuzzleScreen.tsx` | `src/screens/PuzzleScreen.test.tsx` | Not tested |
| `src/screens/PuzzleSolved.tsx` | `src/screens/PuzzleSolved.test.tsx` | Not tested |
| `src/screens/ConstellationReveal.tsx` | — | Low priority |
| `src/screens/ChapterIntro.tsx` | — | Low priority |
| `src/screens/PuzzleSelect.tsx` | — | Low priority |
| `src/screens/Finale.tsx` | — | Low priority |
| **Components** | | |
| `src/components/HintButton.tsx` | `src/components/HintButton.test.tsx` | Not tested |
| `src/components/PuzzleFrame.tsx` | — | Low priority |
| `src/components/Layout.tsx` | — | Low priority |
| **Puzzles (27 components)** | | |
| `src/puzzles/WordChain.tsx` | `src/puzzles/WordChain.test.tsx` | Not tested |
| `src/puzzles/Connections.tsx` | `src/puzzles/Connections.test.tsx` | Not tested |
| `src/puzzles/MetaPuzzle.tsx` | `src/puzzles/MetaPuzzle.test.tsx` | Not tested |
| `src/puzzles/Quiz.tsx` | `src/puzzles/Quiz.test.tsx` | Not tested |
| `src/puzzles/MelodySequence.tsx` | — | Low priority |
| `src/puzzles/[other 22 puzzles]` | — | Low priority |
| **Backend (Cloudflare Pages Functions)** | | |
| `functions/api/player.ts` | `functions/api/player.test.ts` | Not tested |
| `functions/api/progress.ts` | `functions/api/progress.test.ts` | Not tested |
| `functions/api/clue.ts` | `functions/api/clue.test.ts` | Not tested |
| `functions/api/progress/[playerId].ts` | `functions/api/progress/playerId.test.ts` | Not tested |

## Priority List (Highest Risk)

1. **`src/data/chapters.ts`** — All game data. Test: puzzle solvability, valid word chains, correct hints, clue presence
2. **`src/context/GameContext.tsx`** — All state management. Test: login, progress tracking, clue collection, unlock logic
3. **`src/puzzles/WordChain.tsx`** — Complex validation logic. Test: chain rules, early completion, step limits
4. **`src/puzzles/Connections.tsx`** — Auto-resolve logic. Test: group matching, auto-resolve timing
5. **`src/puzzles/MetaPuzzle.tsx`** — Clue gate + space-normalized matching. Test: allCollected gate, answer normalization
6. **`src/components/HintButton.tsx`** — Recent fix for duplicate hints. Test: correct hint displayed per click
7. **`functions/api/player.ts`** — Login/create flow. Test: new player, returning player, invalid input
8. **`src/screens/PuzzleSolved.tsx`** — Route protection. Test: NaN params, unsolved puzzle redirect

## Test Patterns

### Unit tests (pure functions)
```typescript
import { describe, it, expect } from "vitest";
import { getChapter, getAllChapters } from "../data/chapters";

describe("chapters data", () => {
  it("has 7 chapters with 4 puzzles each", () => {
    const chapters = getAllChapters();
    expect(chapters).toHaveLength(7);
    chapters.forEach((ch) => {
      expect(ch.puzzles).toHaveLength(4);
    });
  });
});
```

### Component tests (React Testing Library)
```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HintButton from "./HintButton";

describe("HintButton", () => {
  const hints: [string, string] = ["First hint", "Second hint"];

  it("shows first hint on first click", () => {
    const onHint = vi.fn();
    render(<HintButton hints={hints} hintsUsed={0} onHint={onHint} />);
    fireEvent.click(screen.getByText("Hinweis"));
    expect(screen.getByText("First hint")).toBeInTheDocument();
  });
});
```

### API tests (mocked D1)
```typescript
import { describe, it, expect, vi } from "vitest";

// Mock D1Database
const mockDB = {
  prepare: vi.fn().mockReturnValue({
    bind: vi.fn().mockReturnValue({
      first: vi.fn().mockResolvedValue(null),
      all: vi.fn().mockResolvedValue({ results: [] }),
      run: vi.fn().mockResolvedValue({}),
    }),
  }),
};
```

## Rules

- Test file lives next to source file: `Foo.tsx` -> `Foo.test.tsx`
- Use German labels in assertions when testing UI text (game is in German)
- Always mock `useNavigate`, `useParams` for screen tests
- Always mock `useGame` for components using GameContext
- Wrap components in `MemoryRouter` for routing tests
- Never import from `node_modules` test files
