import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./Anagram.module.css";

interface WordDef {
  scrambled: string;
  answer: string;
}

interface AnagramData {
  words: WordDef[];
}

export default function Anagram({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as AnagramData;
  const { words } = data;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [textInput, setTextInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const solvedRef = useRef(false);

  const currentWord = words[currentIndex];
  const scrambledLetters = currentWord.scrambled.split("");

  // The answer built from clicking tiles
  const builtAnswer = selectedIndices.map((i) => scrambledLetters[i]).join("");

  const handleLetterClick = useCallback(
    (index: number) => {
      if (solvedRef.current) return;
      if (selectedIndices.includes(index)) return;
      setSelectedIndices((prev) => [...prev, index]);
      setFeedback("");
      setFeedbackSuccess(false);
    },
    [selectedIndices]
  );

  const handleAnswerTileClick = useCallback(
    (position: number) => {
      if (solvedRef.current) return;
      // Remove tile at this position from answer, returning it to pool
      setSelectedIndices((prev) => prev.filter((_, i) => i !== position));
      setFeedback("");
      setFeedbackSuccess(false);
    },
    []
  );

  const advanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      // All words solved
      solvedRef.current = true;
      setFeedback("Alle Anagramme gelöst!");
      setFeedbackSuccess(true);
      setTimeout(() => onSolved(), 800);
    } else {
      setCurrentIndex(nextIndex);
      setSelectedIndices([]);
      setTextInput("");
      setFeedback("");
      setFeedbackSuccess(false);
    }
  }, [currentIndex, words.length, onSolved]);

  const checkAnswer = useCallback(
    (answer: string) => {
      if (solvedRef.current) return;
      const normalized = answer.trim().toUpperCase();

      if (normalized === currentWord.answer) {
        setFeedback(`Richtig! ${currentWord.answer}`);
        setFeedbackSuccess(true);
        setTimeout(() => advanceToNext(), 1000);
      } else {
        setFeedback("Das ist leider nicht richtig...");
        setFeedbackSuccess(false);
      }
    },
    [currentWord, advanceToNext]
  );

  const handleTileSubmit = useCallback(() => {
    checkAnswer(builtAnswer);
  }, [checkAnswer, builtAnswer]);

  const handleTextSubmit = useCallback(() => {
    checkAnswer(textInput);
  }, [checkAnswer, textInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleTextSubmit();
      }
    },
    [handleTextSubmit]
  );

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>
      <p className={styles.progress}>
        Wort {currentIndex + 1} von {words.length}
      </p>

      {/* Letter pool */}
      <div className={styles.letterPool}>
        {scrambledLetters.map((letter, index) => {
          const used = selectedIndices.includes(index);
          return (
            <button
              key={index}
              className={`${styles.letterTile} ${used ? styles.letterTileUsed : ""}`}
              onClick={() => handleLetterClick(index)}
              aria-label={`Buchstabe ${letter}`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Answer area - built from tile clicks */}
      <div className={styles.answerArea}>
        {selectedIndices.length === 0 ? (
          <span className={styles.answerPlaceholder}>
            Klicke auf die Buchstaben oben...
          </span>
        ) : (
          selectedIndices.map((letterIndex, position) => (
            <button
              key={`${position}-${letterIndex}`}
              className={styles.answerTile}
              onClick={() => handleAnswerTileClick(position)}
              aria-label={`Antwort Position ${position + 1}: ${scrambledLetters[letterIndex]}`}
            >
              {scrambledLetters[letterIndex]}
            </button>
          ))
        )}
      </div>

      {selectedIndices.length > 0 && (
        <button className={styles.submitButton} onClick={handleTileSubmit}>
          Pr&uuml;fen
        </button>
      )}

      <span className={styles.divider}>oder tippe deine Antwort</span>

      {/* Text input alternative */}
      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.textInput}
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
            setFeedback("");
            setFeedbackSuccess(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Antwort..."
          maxLength={currentWord.answer.length + 2}
        />
        <button className={styles.submitButton} onClick={handleTextSubmit}>
          OK
        </button>
      </div>

      <p className={`${styles.feedback} ${feedbackSuccess ? styles.feedbackSuccess : ""}`}>
        {feedback}
      </p>
    </div>
  );
}
