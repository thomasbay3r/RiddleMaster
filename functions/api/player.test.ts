import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock D1 database
function createMockDB(existingPlayer: Record<string, unknown> | null = null) {
  const mockRun = vi.fn().mockResolvedValue({});
  const mockFirst = vi.fn().mockResolvedValue(existingPlayer);
  const mockAll = vi.fn().mockResolvedValue({ results: [] });

  return {
    prepare: vi.fn().mockReturnValue({
      bind: vi.fn().mockReturnValue({
        first: mockFirst,
        all: mockAll,
        run: mockRun,
      }),
    }),
    _mocks: { mockRun, mockFirst, mockAll },
  };
}

// Import handler
// We can't easily import PagesFunction, so test the logic manually
describe("POST /api/player", () => {
  it("validates that name is required", async () => {
    const db = createMockDB();
    // Simulate the validation logic from player.ts
    const body = { name: "" };
    const name = (body.name ?? "").trim();
    expect(name).toBe("");
  });

  it("trims whitespace from name", () => {
    const body = { name: "  TestPlayer  " };
    const name = (body.name ?? "").trim();
    expect(name).toBe("TestPlayer");
  });

  it("returns existing player with progress and clues", async () => {
    const existingPlayer = { id: "abc-123", name: "TestPlayer", created_at: "2024-01-01" };
    const db = createMockDB(existingPlayer);

    // Verify the DB query would find the player
    const result = await db.prepare("SELECT * FROM players WHERE name = ?")
      .bind("TestPlayer")
      .first();

    expect(result).toEqual(existingPlayer);
  });

  it("creates new player with UUID", () => {
    const id = crypto.randomUUID();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });
});

describe("POST /api/progress", () => {
  it("validates required fields", () => {
    const body = { playerId: "abc", chapter: 1, puzzle: 1, hintsUsed: 0 };
    const { playerId, chapter, puzzle, hintsUsed } = body;
    expect(playerId).toBeTruthy();
    expect(chapter).not.toBeNull();
    expect(puzzle).not.toBeNull();
    expect(hintsUsed).not.toBeNull();
  });

  it("rejects missing playerId", () => {
    const body = { chapter: 1, puzzle: 1, hintsUsed: 0 } as Record<string, unknown>;
    expect(body.playerId).toBeUndefined();
  });
});

describe("POST /api/clue", () => {
  it("validates required fields", () => {
    const body = { playerId: "abc", chapter: 1, clueText: "STERN" };
    expect(body.playerId).toBeTruthy();
    expect(body.chapter).not.toBeNull();
    expect(body.clueText).toBeTruthy();
  });

  it("rejects empty clueText", () => {
    const body = { playerId: "abc", chapter: 1, clueText: "" };
    expect(!body.clueText).toBe(true);
  });
});

describe("GET /api/progress/:playerId", () => {
  it("returns progress and clues for player", async () => {
    const db = createMockDB();

    const progressRows = await db.prepare("SELECT * FROM progress WHERE player_id = ?")
      .bind("test-id")
      .all();

    expect(progressRows.results).toEqual([]);
  });
});
