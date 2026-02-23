import { describe, it, expect } from "vitest";
import { getChapter, getAllChapters } from "./chapters.ts";

describe("chapters data", () => {
  const chapters = getAllChapters();

  it("has exactly 21 chapters (3 acts x 7)", () => {
    expect(chapters).toHaveLength(21);
  });

  it("each chapter has 4 puzzles", () => {
    for (const ch of chapters) {
      expect(ch.puzzles).toHaveLength(4);
    }
  });

  it("chapters have sequential IDs 1-21", () => {
    const expected = Array.from({ length: 21 }, (_, i) => i + 1);
    expect(chapters.map((c) => c.id)).toEqual(expected);
  });

  it("each puzzle has exactly 2 distinct hints", () => {
    for (const ch of chapters) {
      for (const p of ch.puzzles) {
        expect(p.hints).toHaveLength(2);
        expect(p.hints[0]).not.toBe(p.hints[1]);
      }
    }
  });

  it("every puzzle has a non-empty title and description", () => {
    for (const ch of chapters) {
      for (const p of ch.puzzles) {
        expect(p.title.length).toBeGreaterThan(0);
        expect(p.description.length).toBeGreaterThan(0);
      }
    }
  });

  it("each chapter has exactly one signature puzzle", () => {
    for (const ch of chapters) {
      const sigs = ch.puzzles.filter((p) => p.isSignature);
      expect(sigs).toHaveLength(1);
    }
  });

  it("puzzle indices are 1-4 within each chapter", () => {
    for (const ch of chapters) {
      const indices = ch.puzzles.map((p) => p.puzzleIndex).sort();
      expect(indices).toEqual([1, 2, 3, 4]);
    }
  });

  it("non-meta chapters have a clue on their signature puzzle", () => {
    // Chapters 1-6 (Act 1), 8-13 (Act 2), 15-20 (Act 3) should have clues
    const nonMetaIds = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20];
    for (const id of nonMetaIds) {
      const ch = getChapter(id)!;
      const sig = ch.puzzles.find((p) => p.isSignature)!;
      expect(sig.clue, `Chapter ${id} signature puzzle should have a clue`).toBeTruthy();
    }
  });

  it("getChapter returns undefined for invalid ID", () => {
    expect(getChapter(0)).toBeUndefined();
    expect(getChapter(22)).toBeUndefined();
    expect(getChapter(-1)).toBeUndefined();
  });

  it("getChapter returns correct chapter by ID", () => {
    const ch3 = getChapter(3);
    expect(ch3).toBeDefined();
    expect(ch3!.id).toBe(3);
    expect(ch3!.name).toBe("Cassiopeia");

    const ch14 = getChapter(14);
    expect(ch14).toBeDefined();
    expect(ch14!.name).toBe("Phoenix");

    const ch21 = getChapter(21);
    expect(ch21).toBeDefined();
    expect(ch21!.name).toBe("Ophiuchus");
  });

  it("all puzzle IDs are unique", () => {
    const ids = chapters.flatMap((ch) => ch.puzzles.map((p) => p.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("act boundaries are correct (7 chapters per act)", () => {
    const act1 = chapters.filter((c) => c.id >= 1 && c.id <= 7);
    const act2 = chapters.filter((c) => c.id >= 8 && c.id <= 14);
    const act3 = chapters.filter((c) => c.id >= 15 && c.id <= 21);
    expect(act1).toHaveLength(7);
    expect(act2).toHaveLength(7);
    expect(act3).toHaveLength(7);
  });
});

describe("word chain puzzle solvability", () => {
  it("has at least one valid path from STERN to NACHT", () => {
    const ch1 = getChapter(1)!;
    const wc = ch1.puzzles.find((p) => p.type === "word-chain")!;
    const data = wc.data as {
      startWord: string;
      targetWord: string;
      steps: number;
      validWords: string[];
    };

    const validSet = new Set(data.validWords.map((w) => w.toUpperCase()));
    const start = data.startWord.toUpperCase();
    const target = data.targetWord.toUpperCase();

    // BFS to find paths of length <= steps
    type Path = string[];
    const queue: Path[] = [[start]];
    let found = false;

    while (queue.length > 0 && !found) {
      const path = queue.shift()!;
      const lastWord = path[path.length - 1];
      const lastLetter = lastWord[lastWord.length - 1];

      for (const word of validSet) {
        if (word[0] !== lastLetter) continue;
        if (path.includes(word)) continue;

        const newPath = [...path, word];
        if (word === target && newPath.length >= 3) {
          // At least start + 1 intermediate + target
          found = true;
          break;
        }
        if (newPath.length <= data.steps) {
          queue.push(newPath);
        }
      }
    }

    expect(found).toBe(true);
  });

  it("STERN and NACHT are both in the valid words list", () => {
    const ch1 = getChapter(1)!;
    const wc = ch1.puzzles.find((p) => p.type === "word-chain")!;
    const data = wc.data as { validWords: string[] };
    const upper = data.validWords.map((w) => w.toUpperCase());
    expect(upper).toContain("STERN");
    expect(upper).toContain("NACHT");
  });

  it("has no duplicate words in valid words list", () => {
    const ch1 = getChapter(1)!;
    const wc = ch1.puzzles.find((p) => p.type === "word-chain")!;
    const data = wc.data as { validWords: string[] };
    const upper = data.validWords.map((w) => w.toUpperCase());
    expect(new Set(upper).size).toBe(upper.length);
  });
});

describe("meta puzzle answers", () => {
  it("Act 1 meta (ch7) matches clues when spaces are removed", () => {
    const ch7 = getChapter(7)!;
    const meta = ch7.puzzles.find((p) => p.type === "meta-puzzle")!;
    const data = meta.data as {
      answer: string;
      cluesByChapter: Record<number, string>;
    };

    const clueWords: string[] = [];
    for (let i = 1; i <= 6; i++) {
      clueWords.push(data.cluesByChapter[i]);
    }

    const clueJoined = clueWords.join("").replace(/\s+/g, "").toLowerCase();
    const answerNormalized = data.answer.replace(/\s+/g, "").toLowerCase();
    expect(clueJoined).toBe(answerNormalized);
  });

  it("Act 2 meta (ch14) matches clues when spaces are removed", () => {
    const ch14 = getChapter(14)!;
    const meta = ch14.puzzles.find((p) => p.type === "meta-puzzle")!;
    const data = meta.data as {
      answer: string;
      cluesByChapter: Record<number, string>;
    };

    const clueWords: string[] = [];
    for (let i = 8; i <= 13; i++) {
      clueWords.push(data.cluesByChapter[i]);
    }

    const clueJoined = clueWords.join("").replace(/\s+/g, "").toLowerCase();
    const answerNormalized = data.answer.replace(/\s+/g, "").toLowerCase();
    expect(clueJoined).toBe(answerNormalized);
  });

  it("Act 3 meta (ch21) matches clues when spaces are removed", () => {
    const ch21 = getChapter(21)!;
    const meta = ch21.puzzles.find((p) => p.type === "meta-puzzle")!;
    const data = meta.data as {
      answer: string;
      cluesByChapter: Record<number, string>;
    };

    const clueWords: string[] = [];
    for (let i = 15; i <= 20; i++) {
      clueWords.push(data.cluesByChapter[i]);
    }

    const clueJoined = clueWords.join("").replace(/\s+/g, "").toLowerCase();
    const answerNormalized = data.answer.replace(/\s+/g, "").toLowerCase();
    expect(clueJoined).toBe(answerNormalized);
  });
});
