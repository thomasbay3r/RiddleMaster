// functions/api/player.ts
import type { Env, Player, Progress, CollectedClue } from "./_types";
import { jsonResponse, errorResponse } from "./_types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const name = (body.name ?? "").trim();
  if (!name) {
    return errorResponse("Name is required");
  }

  // Try to find existing player by name
  const existing = await env.DB.prepare(
    "SELECT * FROM players WHERE name = ?"
  )
    .bind(name)
    .first<Player>();

  if (existing) {
    // Returning player -- load their progress and clues
    const progressRows = await env.DB.prepare(
      "SELECT * FROM progress WHERE player_id = ? ORDER BY chapter, puzzle"
    )
      .bind(existing.id)
      .all<Progress>();

    const clueRows = await env.DB.prepare(
      "SELECT * FROM collected_clues WHERE player_id = ? ORDER BY chapter"
    )
      .bind(existing.id)
      .all<CollectedClue>();

    return jsonResponse({
      player: existing,
      progress: progressRows.results,
      clues: clueRows.results,
      isReturning: true,
    });
  }

  // New player
  const id = crypto.randomUUID();
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  await env.DB.prepare(
    "INSERT INTO players (id, name, created_at) VALUES (?, ?, ?)"
  )
    .bind(id, name, now)
    .run();

  const player: Player = { id, name, created_at: now };

  return jsonResponse(
    {
      player,
      progress: [],
      clues: [],
      isReturning: false,
    },
    201
  );
};
