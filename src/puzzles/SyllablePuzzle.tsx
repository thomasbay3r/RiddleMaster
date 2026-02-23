import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./SyllablePuzzle.module.css";

interface WordDef {
  answer: string;
  syllables: string[];
}

interface SyllablePuzzleData {
  words: WordDef[];
  allSyllables: string[];
}

export default function SyllablePuzzle({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as SyllablePuzzleData;
  const { words, allSyllables } = data;

  const [activeSlot, setActiveSlot] = useState(0);
  const [solvedSlots, setSolvedSlots] = useState<boolean[]>(() => words.map(() => false));
  // slotSyllables[i] holds the syllables placed in slot i
  const [slotSyllables, setSlotSyllables] = useState<string[][]>(() => words.map(() => []));
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [shakeSlot, setShakeSlot] = useState<number | null>(null);
  const solvedRef = useRef(false);

  // Determine which syllables are currently in use (either solved slots or active placement)
  const usedSyllables: string[] = [];
  slotSyllables.forEach((syls) => {
    syls.forEach((s) => usedSyllables.push(s));
  });

  // Count how many of each syllable are used (to handle duplicates correctly)
  function countInArr(arr: string[], val: string): number {
    return arr.filter((s) => s === val).length;
  }

  const solvedCount = solvedSlots.filter(Boolean).length;

  const handleSyllableClick = useCallback(
    (syllable: string) => {
      if (solvedRef.current || solvedSlots[activeSlot]) return;

      // Add syllable to active slot
      setSlotSyllables((prev) => {
        const next = [...prev];
        next[activeSlot] = [...next[activeSlot], syllable];
        return next;
      });
      setFeedback("");
      setFeedbackSuccess(false);
    },
    [activeSlot, solvedSlots]
  );

  const handleSlotSyllableClick = useCallback(
    (slotIdx: number, syllableIdx: number) => {
      if (solvedRef.current || solvedSlots[slotIdx]) return;

      // Return syllable to pool
      setSlotSyllables((prev) => {
        const next = [...prev];
        next[slotIdx] = next[slotIdx].filter((_, i) => i !== syllableIdx);
        return next;
      });
      setFeedback("");
      setFeedbackSuccess(false);
    },
    [solvedSlots]
  );

  const handleSlotClick = useCallback(
    (slotIdx: number) => {
      if (solvedRef.current || solvedSlots[slotIdx]) return;
      setActiveSlot(slotIdx);
      setFeedback("");
      setFeedbackSuccess(false);
    },
    [solvedSlots]
  );

  const handleCheck = useCallback(() => {
    if (solvedRef.current || solvedSlots[activeSlot]) return;

    const currentSyllables = slotSyllables[activeSlot];
    const builtWord = currentSyllables.join("");
    const expected = words[activeSlot].answer;

    if (builtWord === expected) {
      // Correct!
      const newSolved = [...solvedSlots];
      newSolved[activeSlot] = true;
      setSolvedSlots(newSolved);

      const totalSolved = newSolved.filter(Boolean).length;
      if (totalSolved === words.length) {
        setFeedback("Alle W\u00f6rter gefunden!");
        setFeedbackSuccess(true);
        solvedRef.current = true;
        setTimeout(() => onSolved(), 1000);
      } else {
        setFeedback("Richtig!");
        setFeedbackSuccess(true);
        // Move to next unsolved slot
        const nextUnsolved = newSolved.findIndex((s, i) => !s && i > activeSlot);
        const fallback = newSolved.findIndex((s) => !s);
        setActiveSlot(nextUnsolved !== -1 ? nextUnsolved : fallback);
      }
    } else {
      // Wrong
      setShakeSlot(activeSlot);
      setFeedback("Das ist leider nicht richtig.");
      setFeedbackSuccess(false);

      // Return syllables to pool
      setSlotSyllables((prev) => {
        const next = [...prev];
        next[activeSlot] = [];
        return next;
      });

      setTimeout(() => setShakeSlot(null), 400);
    }
  }, [activeSlot, slotSyllables, solvedSlots, words, onSolved]);

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>
      <p className={styles.progress}>
        Wort {Math.min(solvedCount + 1, words.length)} von {words.length}
      </p>

      {/* Syllable pool */}
      <div className={styles.syllablePool}>
        {allSyllables.map((syl, idx) => {
          // Check if this particular syllable instance is used
          const totalInPool = countInArr(allSyllables.slice(0, idx + 1), syl);
          const totalUsed = countInArr(usedSyllables, syl);
          const isUsed = totalInPool <= totalUsed;

          return (
            <button
              key={`${syl}-${idx}`}
              className={`${styles.syllableBubble} ${isUsed ? styles.syllableBubbleUsed : ""}`}
              onClick={() => handleSyllableClick(syl)}
              disabled={isUsed}
            >
              {syl}
            </button>
          );
        })}
      </div>

      {/* Word slots */}
      <div className={styles.wordSlots}>
        {words.map((word, slotIdx) => {
          const isSolved = solvedSlots[slotIdx];
          const isActive = activeSlot === slotIdx && !isSolved;
          const isShaking = shakeSlot === slotIdx;

          let slotClass = styles.wordSlot;
          if (isSolved) slotClass += ` ${styles.wordSlotSolved}`;
          else if (isActive) slotClass += ` ${styles.wordSlotActive}`;
          if (isShaking) slotClass += ` ${styles.wordSlotShake}`;

          return (
            <div
              key={slotIdx}
              className={slotClass}
              onClick={() => handleSlotClick(slotIdx)}
            >
              <span className={styles.slotNumber}>{slotIdx + 1}.</span>
              <div className={styles.slotSyllables}>
                {isSolved ? (
                  <span className={styles.slotSolvedLabel}>{word.answer}</span>
                ) : slotSyllables[slotIdx].length > 0 ? (
                  slotSyllables[slotIdx].map((syl, si) => (
                    <button
                      key={si}
                      className={styles.slotSyllable}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSlotSyllableClick(slotIdx, si);
                      }}
                    >
                      {syl}
                    </button>
                  ))
                ) : (
                  <span className={styles.slotPlaceholder}>
                    {isActive ? "Klicke auf Silben oben..." : `${word.syllables.length} Silben`}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Check button */}
      <button
        className={styles.checkButton}
        onClick={handleCheck}
        disabled={solvedRef.current || slotSyllables[activeSlot]?.length === 0}
      >
        Pr&uuml;fen
      </button>

      <p className={`${styles.feedback} ${feedbackSuccess ? styles.feedbackSuccess : ""}`}>
        {feedback}
      </p>
    </div>
  );
}
