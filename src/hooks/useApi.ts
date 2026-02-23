import type { ProgressEntry } from "../types";

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
