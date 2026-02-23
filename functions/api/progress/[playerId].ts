// functions/api/progress/[playerId].ts
import type { Env, Progress, CollectedClue } from "../_types";
import { jsonResponse, errorResponse } from "../_types";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, params } = context;
  const playerId = params.playerId as string;

  if (!playerId) {
    return errorResponse("Player ID is required");
  }

  const progressRows = await env.DB.prepare(
    "SELECT * FROM progress WHERE player_id = ? ORDER BY chapter, puzzle"
  )
    .bind(playerId)
    .all<Progress>();

  const clueRows = await env.DB.prepare(
    "SELECT * FROM collected_clues WHERE player_id = ? ORDER BY chapter"
  )
    .bind(playerId)
    .all<CollectedClue>();

  return jsonResponse({
    progress: progressRows.results,
    clues: clueRows.results,
  });
};
