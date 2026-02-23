// functions/api/progress.ts
import type { Env } from "./_types";
import { jsonResponse, errorResponse } from "./_types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let body: {
    playerId?: string;
    chapter?: number;
    puzzle?: number;
    hintsUsed?: number;
  };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const { playerId, chapter, puzzle, hintsUsed } = body;

  if (!playerId || chapter == null || puzzle == null || hintsUsed == null) {
    return errorResponse(
      "Missing required fields: playerId, chapter, puzzle, hintsUsed"
    );
  }

  const id = crypto.randomUUID();
  const solvedAt = new Date().toISOString().replace("T", " ").slice(0, 19);

  await env.DB.prepare(
    `INSERT INTO progress (id, player_id, chapter, puzzle, solved, hints_used, solved_at)
     VALUES (?, ?, ?, ?, 1, ?, ?)
     ON CONFLICT (player_id, chapter, puzzle)
     DO UPDATE SET solved = 1, hints_used = excluded.hints_used, solved_at = excluded.solved_at`
  )
    .bind(id, playerId, chapter, puzzle, hintsUsed, solvedAt)
    .run();

  return jsonResponse({ success: true });
};
