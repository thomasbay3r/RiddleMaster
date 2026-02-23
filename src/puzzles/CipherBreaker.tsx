import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./CipherBreaker.module.css";

interface CipherData {
  encrypted: string;
  shift: number;
  decrypted: string;
  keyword: string;
}

function decryptCaesar(text: string, shift: number): string {
  return text
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      }
      return ch;
    })
    .join("");
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function CipherBreaker({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as CipherData;
  const { encrypted, shift: correctShift, keyword } = data;

  const [currentShift, setCurrentShift] = useState(0);
  const [keywordInput, setKeywordInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const solvedRef = useRef(false);

  const currentDecrypted = decryptCaesar(encrypted, currentShift);
  const isCorrectShift = currentShift === correctShift;

  const handleShiftChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentShift(Number(e.target.value));
    setFeedback("");
    setFeedbackSuccess(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (solvedRef.current) return;

    if (keywordInput.trim().toUpperCase() === keyword.toUpperCase()) {
      solvedRef.current = true;
      setFeedback("Perfekt! Die Botschaft ist entschlüsselt!");
      setFeedbackSuccess(true);
      setTimeout(() => onSolved(), 1200);
    } else {
      setFeedback("Das ist nicht das gesuchte Schlüsselwort. Versuche es erneut.");
      setFeedbackSuccess(false);
    }
  }, [keywordInput, keyword, onSolved]);

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

      <div className={styles.encryptedText}>{encrypted}</div>

      <div className={styles.shiftControl}>
        <span className={styles.shiftLabel}>Verschiebung (Shift)</span>
        <span className={styles.shiftValue}>{currentShift}</span>
        <input
          type="range"
          min={0}
          max={25}
          value={currentShift}
          onChange={handleShiftChange}
          className={styles.slider}
          disabled={solvedRef.current}
        />
      </div>

      <div
        className={`${styles.decryptedPreview} ${isCorrectShift ? styles.decryptedCorrect : ""}`}
      >
        {currentDecrypted || "\u00A0"}
      </div>

      <div className={styles.alphabetMapping}>
        {ALPHABET.split("").map((letter) => {
          const mapped = decryptCaesar(letter, currentShift);
          return (
            <div key={letter} className={styles.letterMap}>
              <span className={styles.letterFrom}>{letter}</span>
              <span className={styles.letterArrow}>&darr;</span>
              <span className={styles.letterTo}>{mapped}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.keywordSection}>
        <span className={styles.keywordLabel}>
          Welches Schlüsselwort verbirgt sich in der Nachricht?
        </span>
        <div className={styles.keywordRow}>
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.keywordInput}
            placeholder="Schlüsselwort..."
            disabled={solvedRef.current}
            autoComplete="off"
          />
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={solvedRef.current || keywordInput.trim().length === 0}
          >
            Pr&uuml;fen
          </button>
        </div>
      </div>

      {isCorrectShift && !solvedRef.current && (
        <p style={{ color: "#00d4ff", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif" }}>
          Die Nachricht sieht lesbar aus! Finde das Schlüsselwort.
        </p>
      )}

      <p className={`${styles.feedback} ${feedbackSuccess ? styles.feedbackSuccess : ""}`}>
        {feedback}
      </p>
    </div>
  );
}
