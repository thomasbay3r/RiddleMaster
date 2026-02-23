import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./MorseCode.module.css";

interface MorseData {
  message: string;
  morseMap: Record<string, string>;
}

const DOT_MS = 200;
const DASH_MS = 600;
const SYMBOL_GAP_MS = 150;
const LETTER_GAP_MS = 400;
const WORD_GAP_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export default function MorseCode({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as MorseData;
  const { message, morseMap } = data;

  const [isPlaying, setIsPlaying] = useState(false);
  const [starActive, setStarActive] = useState(false);
  const [currentLetterIdx, setCurrentLetterIdx] = useState<number | null>(null);
  const [currentMorseSymbols, setCurrentMorseSymbols] = useState("");
  const [showReference, setShowReference] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const solvedRef = useRef(false);
  const abortRef = useRef(false);

  const playMessage = useCallback(async () => {
    if (isPlaying || solvedRef.current) return;
    setIsPlaying(true);
    abortRef.current = false;

    const letters = message.toUpperCase().split("");

    for (let li = 0; li < letters.length; li++) {
      if (abortRef.current) break;
      const letter = letters[li];
      setCurrentLetterIdx(li);

      if (letter === " ") {
        setCurrentMorseSymbols("");
        await sleep(WORD_GAP_MS);
        continue;
      }

      const morse = morseMap[letter];
      if (!morse) continue;

      const symbols = morse.split("");
      let displayedSoFar = "";

      for (let si = 0; si < symbols.length; si++) {
        if (abortRef.current) break;
        const sym = symbols[si];
        displayedSoFar += sym;
        setCurrentMorseSymbols(displayedSoFar);

        // Blink
        setStarActive(true);
        await sleep(sym === "." ? DOT_MS : DASH_MS);
        setStarActive(false);

        // Gap between symbols within same letter
        if (si < symbols.length - 1) {
          await sleep(SYMBOL_GAP_MS);
        }
      }

      // Gap between letters
      if (li < letters.length - 1 && letters[li + 1] !== " ") {
        await sleep(LETTER_GAP_MS);
      }
    }

    setStarActive(false);
    setCurrentLetterIdx(null);
    setCurrentMorseSymbols("");
    setIsPlaying(false);
  }, [isPlaying, message, morseMap]);

  const handleSubmit = useCallback(() => {
    if (solvedRef.current) return;
    const normalized = inputValue.replace(/\s+/g, "").toUpperCase();
    const expected = message.replace(/\s+/g, "").toUpperCase();

    if (normalized === expected) {
      setFeedback("Richtig! Die Botschaft lautet: " + message);
      setFeedbackSuccess(true);
      solvedRef.current = true;
      abortRef.current = true;
      setTimeout(() => onSolved(), 1000);
    } else {
      setFeedback("Das ist leider nicht richtig. Versuche es erneut.");
      setFeedbackSuccess(false);
    }
  }, [inputValue, message, onSolved]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit]
  );

  // Sorted letters for the reference table
  const morseEntries = Object.entries(morseMap).sort(([a], [b]) => a.localeCompare(b));

  // Determine which letter is currently being blinked (for highlight in reference)
  const currentBlinkLetter =
    currentLetterIdx !== null ? message.toUpperCase().charAt(currentLetterIdx) : null;

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      {/* Star display */}
      <div className={styles.starArea}>
        <div className={`${styles.blinkStar} ${starActive ? styles.blinkStarActive : ""}`} />
      </div>

      {/* Current letter info */}
      <p className={styles.currentLetter}>
        {currentLetterIdx !== null
          ? `Buchstabe ${currentLetterIdx + 1} von ${message.replace(/\s/g, "").length}`
          : "\u00A0"}
      </p>
      <p className={styles.currentMorse}>{currentMorseSymbols || "\u00A0"}</p>

      <button
        className={styles.playButton}
        onClick={playMessage}
        disabled={isPlaying}
      >
        {isPlaying ? "Wird abgespielt..." : "Abspielen"}
      </button>

      {/* Morse reference toggle */}
      <button
        className={styles.referenceToggle}
        onClick={() => setShowReference((prev) => !prev)}
      >
        {showReference ? "Tabelle ausblenden" : "Morse-Tabelle anzeigen"}
      </button>

      {showReference && (
        <div className={styles.referenceTable}>
          {morseEntries.map(([letter, morse]) => (
            <div key={letter} className={styles.referenceEntry}>
              <span
                className={`${styles.refLetter} ${
                  currentBlinkLetter === letter ? styles.refLetterHighlight : ""
                }`}
              >
                {letter}
              </span>
              <span className={styles.refMorse}>{morse}</span>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.textInput}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setFeedback("");
            setFeedbackSuccess(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Entschl\u00FCsselte Nachricht..."
          maxLength={message.length + 5}
        />
        <button className={styles.submitButton} onClick={handleSubmit}>
          Pr&uuml;fen
        </button>
      </div>

      <p className={`${styles.feedback} ${feedbackSuccess ? styles.feedbackSuccess : ""}`}>
        {feedback}
      </p>
    </div>
  );
}
