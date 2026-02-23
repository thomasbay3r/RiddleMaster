import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./NumberSequence.module.css";

interface SequenceDef {
  shown: number[];
  answers: number[];
  hint: string;
}

interface NumberSequenceData {
  sequences: SequenceDef[];
}

export default function NumberSequence({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as NumberSequenceData;
  const { sequences } = data;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputs, setInputs] = useState<string[]>(["", ""]);
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [solvedSequences, setSolvedSequences] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const solvedRef = useRef(false);

  const currentSeq = sequences[currentIndex];

  const handleInputChange = useCallback(
    (idx: number, value: string) => {
      if (status === "correct") return;
      // Only allow digits and minus sign
      const cleaned = value.replace(/[^0-9-]/g, "");
      setInputs((prev) => {
        const next = [...prev];
        next[idx] = cleaned;
        return next;
      });
      if (status === "wrong") setStatus("idle");
    },
    [status]
  );

  const handleCheck = useCallback(() => {
    if (solvedRef.current) return;

    const expected = currentSeq.answers;
    const userAnswers = inputs.map((v) => parseInt(v, 10));

    if (
      userAnswers.length === expected.length &&
      userAnswers.every((v, i) => !isNaN(v) && v === expected[i])
    ) {
      setStatus("correct");
      const newSolved = new Set(solvedSequences);
      newSolved.add(currentIndex);
      setSolvedSequences(newSolved);

      if (newSolved.size === sequences.length) {
        // All sequences solved
        solvedRef.current = true;
        setTimeout(() => onSolved(), 1200);
      } else {
        // Move to next sequence after delay
        setTimeout(() => {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          setInputs(["", ""]);
          setStatus("idle");
          setShowHint(false);
        }, 1500);
      }
    } else {
      setStatus("wrong");
      setTimeout(() => setStatus("idle"), 800);
    }
  }, [currentSeq, inputs, currentIndex, solvedSequences, sequences.length, onSolved]);

  const allSolved = solvedSequences.size === sequences.length;

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.progressDots}>
        {sequences.map((_, i) => {
          let dotClass = styles.progressDot;
          if (solvedSequences.has(i)) dotClass += ` ${styles.progressDotDone}`;
          else if (i === currentIndex) dotClass += ` ${styles.progressDotActive}`;
          return <span key={i} className={dotClass} />;
        })}
      </div>

      <p className={styles.progress}>
        Folge {currentIndex + 1} von {sequences.length}
      </p>

      <div
        className={`${styles.sequenceCard} ${
          status === "correct" ? styles.sequenceCardCorrect : ""
        }`}
      >
        <div className={styles.sequenceRow}>
          {currentSeq.shown.map((num, i) => (
            <div key={i}>
              <div className={`${styles.numberCircle} ${styles.numberCircleGiven}`}>
                {num}
              </div>
              {i < currentSeq.shown.length - 1 && (
                <span className={styles.arrow} />
              )}
            </div>
          ))}

          {currentSeq.answers.map((ans, i) => {
            const isCorrect = status === "correct";
            const isWrong = status === "wrong";
            return (
              <div key={`answer-${i}`}>
                {isCorrect ? (
                  <div className={`${styles.numberCircle} ${styles.numberCircleCorrect}`}>
                    {ans}
                  </div>
                ) : (
                  <input
                    className={`${styles.answerInput} ${
                      isWrong ? styles.answerInputWrong : ""
                    }`}
                    type="text"
                    inputMode="numeric"
                    placeholder="?"
                    value={inputs[i]}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCheck();
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {showHint && status !== "correct" && (
          <p className={styles.hintText}>{currentSeq.hint}</p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            className={styles.checkButton}
            onClick={handleCheck}
            disabled={status === "correct" || inputs.some((v) => v === "")}
          >
            Pr&uuml;fen
          </button>
          {!showHint && status !== "correct" && (
            <button
              className={styles.checkButton}
              onClick={() => setShowHint(true)}
            >
              Tipp zeigen
            </button>
          )}
        </div>
      </div>

      <p
        className={`${styles.status} ${
          status === "wrong" ? styles.statusError : ""
        } ${allSolved ? styles.statusSuccess : ""}`}
      >
        {status === "idle" && !allSolved && "Finde die n\u00e4chsten zwei Zahlen der Folge."}
        {status === "wrong" && "Nicht ganz richtig. Versuch es nochmal!"}
        {status === "correct" && !allSolved && "Richtig! Weiter zur n\u00e4chsten Folge..."}
        {allSolved && "Alle Folgen gel\u00f6st! Ausgezeichnet!"}
      </p>
    </div>
  );
}
