# Sternenreise (RiddleMaster)

A star-themed puzzle game built as a personal gift. 7 chapters with 4 puzzles each, exploring constellations.

## Tech Stack

- **Frontend:** React 19 + TypeScript 5.9 + Vite 7 + framer-motion + react-router-dom 7
- **Backend:** Cloudflare Pages Functions (D1 SQLite database)
- **Deployment:** Cloudflare Pages (git-connected to GitHub `thomasbay3r/RiddleMaster`, branch `main`)
- **Language:** German (all UI text, puzzle content, hints)

## Project Structure

```
src/
  main.tsx                    # Entry point
  App.tsx                     # Router (8 routes)
  types.ts                    # Shared TypeScript types
  context/
    GameContext.tsx            # Game state: player, progress, clues, unlock logic
  data/
    chapters.ts               # All 7 chapters with 28 puzzles (data-only, no JSX)
  hooks/
    useApi.ts                 # API client (login, saveProgress, saveClue)
    useAudio.ts               # Background music
    useStarfield.ts            # Canvas star animation
  screens/
    StartScreen.tsx            # Player name login
    SkyMap.tsx                 # Constellation overview (chapter select)
    ChapterIntro.tsx           # Story intro per chapter
    PuzzleSelect.tsx           # Diamond grid of 4 puzzles
    PuzzleScreen.tsx           # Puzzle wrapper with frame + hints
    PuzzleSolved.tsx           # Celebration + clue reveal
    ConstellationReveal.tsx    # Chapter completion animation
    Finale.tsx                 # Game completion screen
  components/
    Layout.tsx                 # Page layout
    Starfield.tsx              # Background stars (canvas)
    AudioControls.tsx          # Music toggle
    PuzzleFrame.tsx            # Puzzle container with back button
    HintButton.tsx             # Hint modal (2 hints per puzzle)
  puzzles/
    index.ts                   # Lazy-loaded puzzle registry
    MelodySequence.tsx         # Ch1: Simon-Says with stars
    Connections.tsx            # Ch1: Group 16 words into 4 categories
    Maze.tsx                   # Ch1: Navigate star maze
    WordChain.tsx              # Ch1: Word chain (last letter = first letter)
    [... 23 more puzzle types]
  styles/
    global.css                 # Global styles (dark theme)
    theme.ts                   # Color constants
    animations.ts              # framer-motion variants
functions/
  api/
    _types.ts                  # Shared types (Env, Player, Progress, CollectedClue)
    player.ts                  # POST /api/player — login/create
    progress.ts                # POST /api/progress — save puzzle solve
    progress/[playerId].ts     # GET /api/progress/:id — load progress + clues
    clue.ts                    # POST /api/clue — save collected clue
```

## Key Architecture Patterns

- **CSS Modules** for styling (`.module.css` next to each component)
- **Lazy loading** puzzles via `React.lazy()` in `puzzles/index.ts`
- **GameContext** manages all game state; `login()` hydrates from API
- **Optimistic updates** in `solvePuzzle()` / `collectClue()` — local state updated before API call
- **framer-motion** for all transitions and animations
- Puzzles implement `PuzzleComponentProps` interface: `{ puzzle, onSolved, onHint, hintsUsed }`

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Database (D1)

- **Name:** `sternenreise-db`
- **ID:** `4f37e7f2-afb0-4319-b719-37d38519ba08`
- **Tables:** `players`, `progress` (UNIQUE player_id+chapter+puzzle), `collected_clues` (UNIQUE player_id+chapter)

## Game Flow

1. StartScreen → login by name → SkyMap
2. SkyMap → click unlocked constellation → ChapterIntro
3. ChapterIntro → PuzzleSelect (4 puzzles in diamond grid)
4. PuzzleSelect → PuzzleScreen → solve → PuzzleSolved (shows clue)
5. All 4 puzzles solved → ConstellationReveal → back to SkyMap
6. All 7 chapters → Finale

## Testing

No test framework installed yet. See `.claude/agents/test-writer.md` for coverage plan and priorities.
