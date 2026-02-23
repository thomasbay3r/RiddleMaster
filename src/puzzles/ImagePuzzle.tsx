import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./ImagePuzzle.module.css";

interface ImageQuestion {
  question: string;
  answer: string;
}

interface ImagePuzzleData {
  finalWord: string;
  questions: ImageQuestion[];
}

export default function ImagePuzzle({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as ImagePuzzleData;
  const { finalWord, questions } = data;

  const [answers, setAnswers] = useState<string[]>(
    () => new Array(questions.length).fill(""),
  );
  const [revealed, setRevealed] = useState<boolean[]>(
    () => new Array(questions.length).fill(false),
  );
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [finalInput, setFinalInput] = useState("");
  const [finalError, setFinalError] = useState(false);
  const [solved, setSolved] = useState(false);
  const solvedRef = useRef(false);

  const allRevealed = revealed.every(Boolean);
  const revealedLetters = questions.map((q, i) =>
    revealed[i] ? q.answer.charAt(0).toUpperCase() : "?",
  );

  const handleAnswerChange = useCallback(
    (index: number, value: string) => {
      if (revealed[index]) return;
      setAnswers((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    },
    [revealed],
  );

  const handleCheckAnswer = useCallback(
    (index: number) => {
      if (revealed[index]) return;

      const userAnswer = answers[index].trim().toUpperCase();
      const expected = questions[index].answer.toUpperCase();

      if (userAnswer === expected) {
        setRevealed((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      } else {
        setShakeIndex(index);
        setTimeout(() => setShakeIndex(null), 500);
      }
    },
    [answers, questions, revealed],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter") {
        handleCheckAnswer(index);
      }
    },
    [handleCheckAnswer],
  );

  const handleFinalSubmit = useCallback(() => {
    if (solvedRef.current) return;

    const normalized = finalInput.trim().toUpperCase();
    if (normalized === finalWord.toUpperCase()) {
      solvedRef.current = true;
      setSolved(true);
      setTimeout(() => onSolved(), 1500);
    } else {
      setFinalError(true);
      setTimeout(() => setFinalError(false), 500);
    }
  }, [finalInput, finalWord, onSolved]);

  const handleFinalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleFinalSubmit();
      }
    },
    [handleFinalSubmit],
  );

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      {/* Letter display */}
      <div className={styles.letterDisplay}>
        {revealedLetters.map((letter, i) => (
          <span
            key={i}
            className={`${styles.letterSlot} ${revealed[i] ? styles.letterRevealed : ""}`}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Questions */}
      <div className={styles.questionList}>
        {questions.map((q, index) => {
          const isRevealed = revealed[index];
          const isShaking = shakeIndex === index;

          return (
            <div
              key={index}
              className={`${styles.questionRow} ${isRevealed ? styles.questionSolved : ""} ${isShaking ? styles.shake : ""}`}
            >
              <span className={styles.questionNumber}>{index + 1}</span>
              <div className={styles.questionContent}>
                <p className={styles.questionText}>{q.question}</p>
                <div className={styles.answerRow}>
                  {isRevealed ? (
                    <div className={styles.answeredDisplay}>
                      <span className={styles.answeredFirst}>
                        {q.answer.charAt(0).toUpperCase()}
                      </span>
                      <span className={styles.answeredRest}>
                        {q.answer.slice(1).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <>
                      <input
                        className={styles.answerInput}
                        type="text"
                        placeholder="Antwort..."
                        value={answers[index]}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        autoComplete="off"
                        spellCheck={false}
                      />
                      <button
                        className={styles.checkButton}
                        onClick={() => handleCheckAnswer(index)}
                        disabled={answers[index].trim().length === 0}
                      >
                        OK
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final word input */}
      {allRevealed && !solved && (
        <div className={`${styles.finalSection} ${finalError ? styles.shake : ""}`}>
          <p className={styles.finalPrompt}>
            Welches Wort ergeben die Anfangsbuchstaben?
          </p>
          <div className={styles.finalRow}>
            <input
              className={styles.finalInput}
              type="text"
              placeholder="Das Lösungswort..."
              value={finalInput}
              onChange={(e) => {
                setFinalInput(e.target.value);
                setFinalError(false);
              }}
              onKeyDown={handleFinalKeyDown}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              className={styles.finalButton}
              onClick={handleFinalSubmit}
              disabled={finalInput.trim().length === 0}
            >
              Lösen
            </button>
          </div>
          {finalError && (
            <p className={styles.errorMsg}>Das ist nicht ganz richtig...</p>
          )}
        </div>
      )}

      {solved && (
        <div className={styles.successSection}>
          <p className={styles.successWord}>{finalWord}</p>
          <p className={styles.successText}>
            Die Krone erstrahlt am Himmel!
          </p>
        </div>
      )}
    </div>
  );
}
