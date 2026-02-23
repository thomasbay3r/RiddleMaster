import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { GameProvider, useGame } from "./GameContext.tsx";
import type { ReactNode } from "react";

// Mock useApi
vi.mock("../hooks/useApi.ts", () => ({
  useApi: () => ({
    loginOrCreate: vi.fn().mockResolvedValue({
      player: { id: "test-id", name: "TestPlayer", created_at: "2024-01-01" },
      progress: [
        { chapter: 1, puzzle: 1, solved: 1, hints_used: 0 },
        { chapter: 1, puzzle: 2, solved: 1, hints_used: 1 },
        { chapter: 1, puzzle: 3, solved: 1, hints_used: 0 },
        { chapter: 1, puzzle: 4, solved: 1, hints_used: 2 },
      ],
      clues: [
        { chapter: 1, clue_text: "STERN" },
      ],
      isReturning: true,
    }),
    loadProgress: vi.fn(),
    savePuzzleSolved: vi.fn().mockResolvedValue({ success: true }),
    saveClue: vi.fn().mockResolvedValue({ success: true }),
  }),
}));

function wrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

describe("GameContext", () => {
  it("starts with null player", () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(result.current.player).toBeNull();
  });

  it("login sets player and loads progress", async () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    await act(async () => {
      const isReturning = await result.current.login("TestPlayer");
      expect(isReturning).toBe(true);
    });

    expect(result.current.player).toEqual({ id: "test-id", name: "TestPlayer" });
  });

  it("isPuzzleSolved returns correct state after login", async () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    await act(async () => {
      await result.current.login("TestPlayer");
    });

    expect(result.current.isPuzzleSolved(1, 1)).toBe(true);
    expect(result.current.isPuzzleSolved(1, 2)).toBe(true);
    expect(result.current.isPuzzleSolved(2, 1)).toBe(false);
  });

  it("isChapterComplete returns true when all 4 puzzles solved", async () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    await act(async () => {
      await result.current.login("TestPlayer");
    });

    expect(result.current.isChapterComplete(1)).toBe(true);
    expect(result.current.isChapterComplete(2)).toBe(false);
  });

  it("isChapterUnlocked returns true for chapter 1 always", async () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    expect(result.current.isChapterUnlocked(1)).toBe(true);
    expect(result.current.isChapterUnlocked(0)).toBe(true);
  });

  it("isChapterUnlocked returns true for chapter 2 when chapter 1 is complete", async () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    await act(async () => {
      await result.current.login("TestPlayer");
    });

    expect(result.current.isChapterUnlocked(2)).toBe(true);
    expect(result.current.isChapterUnlocked(3)).toBe(false);
  });

  it("solvePuzzle adds progress optimistically", async () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    await act(async () => {
      await result.current.login("TestPlayer");
    });

    await act(async () => {
      await result.current.solvePuzzle(2, 1, 0);
    });

    expect(result.current.isPuzzleSolved(2, 1)).toBe(true);
  });

  it("collectClue adds clue", async () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    await act(async () => {
      await result.current.login("TestPlayer");
    });

    await act(async () => {
      await result.current.collectClue(2, "LICHT");
    });

    expect(result.current.clues).toContainEqual({ chapter: 2, clueText: "LICHT" });
  });

  it("getHintsUsed returns correct value", async () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    await act(async () => {
      await result.current.login("TestPlayer");
    });

    expect(result.current.getHintsUsed(1, 2)).toBe(1);
    expect(result.current.getHintsUsed(1, 1)).toBe(0);
    expect(result.current.getHintsUsed(3, 1)).toBe(0); // no entry
  });

  it("maps snake_case hints_used from API to camelCase", async () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    await act(async () => {
      await result.current.login("TestPlayer");
    });

    // puzzle 4 had hints_used: 2
    expect(result.current.getHintsUsed(1, 4)).toBe(2);
  });
});
