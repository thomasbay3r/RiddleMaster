-- migrations/0001_initial.sql
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id),
  chapter INTEGER NOT NULL CHECK(chapter BETWEEN 1 AND 21),
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
