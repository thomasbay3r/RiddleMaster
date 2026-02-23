import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./Rebus.module.css";

interface RebusDef {
  display: string;
  answer: string;
  hint: string;
}

interface RebusData {
  rebuses: RebusDef[];
}

export default function Rebus({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as RebusData;
  const { rebuses } = data;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"" | "success" | "wrong">("");
  const [showHint, setShowHint] = useState(false);
  const [solvedIndices, setSolvedIndices] = useState<Set<number>>(new Set());
  const solvedRef = useRef(false);

  const currentRebus = rebuses[currentIndex];

  const advanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= rebuses.length) {
      solvedRef.current = true;
      setFeedback("Alle Rebus-Rätsel gelöst!");
      setFeedbackType("success");
      setTimeout(() => onSolved(), 1000);
    } else {
      setCurrentIndex(nextIndex);
      setInput("");
      setFeedback("");
      setFeedbackType("");
      setShowHint(false);
    }
  }, [currentIndex, rebuses.length, onSolved]);

  const handleSubmit = useCallback(() => {
    if (solvedRef.current || !input.trim()) return;

    const normalized = input.trim().toUpperCase().replace(/\s+/g, "");
    const answer = currentRebus.answer.toUpperCase().replace(/\s+/g, "");

    if (normalized === answer) {
      setSolvedIndices((prev) => new Set([...prev, currentIndex]));
      setFeedback(`Richtig! ${currentRebus.answer}`);
      setFeedbackType("success");
      setTimeout(() => advanceToNext(), 1200);
    } else {
      setFeedback("Das ist leider nicht richtig. Versuche es erneut.");
      setFeedbackType("wrong");
    }
  }, [input, currentRebus, currentIndex, advanceToNext]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <p className={styles.progress}>
        Rätsel {currentIndex + 1} von {rebuses.length}
      </p>

      <div className={styles.progressDots}>
        {rebuses.map((_, i) => {
          const dotClass = [
            styles.dot,
            solvedIndices.has(i) ? styles.dotSolved : "",
            i === currentIndex && !solvedIndices.has(i) ? styles.dotCurrent : "",
          ]
            .filter(Boolean)
            .join(" ");
          return <span key={i} className={dotClass} />;
        })}
      </div>

      <div className={styles.rebusCard}>
        <div className={styles.rebusDisplay}>{currentRebus.display}</div>

        {!showHint ? (
          <button
            className={styles.hintButton}
            onClick={() => setShowHint(true)}
          >
            Tipp anzeigen
          </button>
        ) : (
          <p className={styles.hintText}>{currentRebus.hint}</p>
        )}
      </div>

      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.textInput}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setFeedback("");
            setFeedbackType("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="Antwort..."
          disabled={solvedRef.current}
        />
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={solvedRef.current}
        >
          Pr&uuml;fen
        </button>
      </div>

      <p
        className={`${styles.feedback} ${
          feedbackType === "success"
            ? styles.feedbackSuccess
            : feedbackType === "wrong"
              ? styles.feedbackShake
              : ""
        }`}
      >
        {feedback}
      </p>
    </div>
  );
}
