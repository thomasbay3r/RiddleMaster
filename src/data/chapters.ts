import type { ChapterDef } from "../types.ts";

/**
 * Chapter data will be populated in a later task.
 * For now this provides the lookup function that screens depend on.
 */
const chapters: ChapterDef[] = [];

export function getChapter(id: number): ChapterDef | undefined {
  return chapters.find((c) => c.id === id);
}

export function getAllChapters(): ChapterDef[] {
  return chapters;
}
