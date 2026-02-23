import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import { useGame } from "../context/GameContext.tsx";
import styles from "./MetaPuzzle.module.css";

interface MetaPuzzleData {
  answer: string;
  cluesByChapter: Record<number, string>;
}

const CHAPTER_NAMES: Record<number, string> = {
  1: "Lyra",
  2: "Ursa Minor",
  3: "Cassiopeia",
  4: "Orion",
  5: "Cygnus",
  6: "Draco",
};

export default function MetaPuzzle({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as MetaPuzzleData;
  const { clues } = useGame();

  const [input, setInput] = useState("");
  const [shaking, setShaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [solved, setSolved] = useState(false);
  const solvedRef = useRef(false);

  // Map collected clues by chapter
  const collectedClueMap = new Map<number, string>();
  for (const c of clues) {
    collectedClueMap.set(c.chapter, c.clueText);
  }

  const chapterNumbers = Object.keys(data.cluesByChapter)
    .map(Number)
    .sort((a, b) => a - b);

  const allCollected = chapterNumbers.every((ch) => collectedClueMap.has(ch));
  const missingChapters = chapterNumbers.filter(
    (ch) => !collectedClueMap.has(ch),
  );

  const handleSubmit = useCallback(() => {
    if (solvedRef.current) return;

    const normalized = input.replace(/\s+/g, " ").trim().toLowerCase();
    const expected = data.answer.replace(/\s+/g, " ").trim().toLowerCase();

    if (normalized === expected) {
      solvedRef.current = true;
      setSolved(true);
      setErrorMsg("");
      setTimeout(() => onSolved(), 1500);
    } else {
      setErrorMsg("Das ist noch nicht ganz richtig...");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }, [input, data.answer, onSolved]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <p className={styles.instruction}>
        Kombiniere die gesammelten Hinweise zu einem Satz.
      </p>

      {/* Clue slots */}
      <div className={styles.clueGrid}>
        {chapterNumbers.map((ch) => {
          const collected = collectedClueMap.has(ch);
          const word = collected
            ? collectedClueMap.get(ch)
            : data.cluesByChapter[ch];

          return (
            <div
              key={ch}
              className={`${styles.clueSlot} ${collected ? styles.clueCollected : styles.clueMissing}`}
            >
              <span className={styles.clueChapter}>
                Kapitel {ch} — {CHAPTER_NAMES[ch]}
              </span>
              <span className={styles.clueWord}>
                {collected ? word : "???"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Missing chapters notice */}
      {!allCollected && (
        <div className={styles.missingNotice}>
          <p>
            Dir fehlen noch Hinweise aus:{" "}
            {missingChapters
              .map((ch) => `Kapitel ${ch} (${CHAPTER_NAMES[ch]})`)
              .join(", ")}
          </p>
        </div>
      )}

      {/* Input area */}
      <div className={`${styles.inputArea} ${shaking ? styles.shake : ""}`}>
        <input
          className={`${styles.answerInput} ${solved ? styles.answerCorrect : ""}`}
          type="text"
          placeholder="Gib den vollständigen Satz ein..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setErrorMsg("");
          }}
          onKeyDown={handleKeyDown}
          disabled={solved}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={solved || input.trim().length === 0}
        >
          {solved ? "Gelöst!" : "Prüfen"}
        </button>
      </div>

      {/* Error / success messages */}
      {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
      {solved && (
        <div className={styles.successMsg}>
          <p className={styles.successText}>
            &bdquo;{data.answer}&ldquo;
          </p>
          <p className={styles.successSubtext}>
            Die Sternenreise ist vollendet!
          </p>
        </div>
      )}
    </div>
  );
}
