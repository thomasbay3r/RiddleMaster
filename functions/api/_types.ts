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
