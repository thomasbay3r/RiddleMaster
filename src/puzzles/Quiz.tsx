import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./Quiz.module.css";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface QuizData {
  requiredCorrect: number;
  questions: Question[];
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function Quiz({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as QuizData;
  const { questions, requiredCorrect } = data;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const solvedRef = useRef(false);

  const handleOptionClick = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null || isTransitioning || solvedRef.current || showResult) return;

      setSelectedOption(optionIndex);
      const isCorrect = optionIndex === questions[currentIndex].correct;

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }

      setIsTransitioning(true);

      // Auto-advance after 1.5s
      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= questions.length) {
          // Show result screen
          setShowResult(true);
          const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
          if (finalCorrect >= requiredCorrect && !solvedRef.current) {
            solvedRef.current = true;
            setTimeout(() => onSolved(), 1200);
          }
        } else {
          setCurrentIndex(nextIndex);
          setSelectedOption(null);
        }
        setIsTransitioning(false);
      }, 1500);
    },
    [selectedOption, isTransitioning, showResult, currentIndex, questions, correctCount, requiredCorrect, onSolved]
  );

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsTransitioning(false);
    solvedRef.current = false;
  }, []);

  const finalCorrect = showResult ? correctCount : 0;

  if (showResult) {
    const passed = correctCount >= requiredCorrect;
    return (
      <div className={styles.container}>
        <p className={styles.description}>{puzzle.description}</p>
        <div className={styles.resultCard}>
          <p className={styles.resultScore}>
            {correctCount} von {questions.length} richtig!
          </p>
          <div className={styles.resultStars}>
            {questions.map((_, i) => (
              <span key={i} className={i < finalCorrect ? styles.starFilled : styles.starEmpty}>
                &#9733;
              </span>
            ))}
          </div>
          <p className={`${styles.resultMessage} ${passed ? styles.resultPass : styles.resultFail}`}>
            {passed ? "Bestanden!" : "Versuche es noch einmal!"}
          </p>
          {!passed && (
            <button className={styles.retryButton} onClick={handleRetry}>
              Nochmal
            </button>
          )}
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.progressBar}>
        <p className={styles.progressLabel}>
          Frage {currentIndex + 1} von {questions.length}
        </p>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className={styles.questionCard}>
        <p className={styles.questionText}>{question.question}</p>
        <div className={styles.optionsGrid}>
          {question.options.map((option, i) => {
            let optionClass = styles.optionButton;
            if (selectedOption !== null) {
              if (i === question.correct) {
                optionClass += ` ${styles.optionCorrect}`;
              } else if (i === selectedOption && i !== question.correct) {
                optionClass += ` ${styles.optionWrong}`;
              }
            }

            return (
              <button
                key={i}
                className={optionClass}
                onClick={() => handleOptionClick(i)}
                disabled={selectedOption !== null}
              >
                <span className={styles.optionLetter}>{OPTION_LETTERS[i]}</span>
                <span className={styles.optionText}>{option}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
