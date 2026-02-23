// functions/api/clue.ts
import type { Env } from "./_types";
import { jsonResponse, errorResponse } from "./_types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let body: { playerId?: string; chapter?: number; clueText?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const { playerId, chapter, clueText } = body;

  if (!playerId || chapter == null || !clueText) {
    return errorResponse(
      "Missing required fields: playerId, chapter, clueText"
    );
  }

  const id = crypto.randomUUID();
  const collectedAt = new Date().toISOString().replace("T", " ").slice(0, 19);

  await env.DB.prepare(
    `INSERT INTO collected_clues (id, player_id, chapter, clue_text, collected_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (player_id, chapter) DO NOTHING`
  )
    .bind(id, playerId, chapter, clueText, collectedAt)
    .run();

  return jsonResponse({ success: true });
};
