import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./WordChain.module.css";

interface WordChainData {
  startWord: string;
  targetWord: string;
  steps: number;
  validWords: string[];
}

export default function WordChain({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as WordChainData;
  const { startWord, targetWord, steps, validWords } = data;
  const validSet = useRef(new Set(validWords.map((w) => w.toUpperCase()))).current;

  const [chain, setChain] = useState<string[]>([startWord.toUpperCase()]);
  const [inputValue, setInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [solved, setSolved] = useState(false);
  const solvedRef = useRef(false);

  const lastWord = chain[chain.length - 1];
  const lastLetter = lastWord[lastWord.length - 1];

  const handleSubmit = useCallback(() => {
    if (solvedRef.current) return;
    const word = inputValue.trim().toUpperCase();
    if (!word) return;

    setErrorMsg("");

    // Validate: starts with last letter of previous word
    if (word[0] !== lastLetter) {
      setErrorMsg(
        `Das Wort muss mit "${lastLetter}" beginnen.`
      );
      setInputValue("");
      return;
    }

    // Validate: is a valid word
    if (!validSet.has(word)) {
      setErrorMsg("Dieses Wort ist nicht in der Wortliste enthalten.");
      setInputValue("");
      return;
    }

    // Validate: not already used
    if (chain.includes(word)) {
      setErrorMsg("Dieses Wort wurde bereits verwendet.");
      setInputValue("");
      return;
    }

    const isTarget = word === targetWord.toUpperCase();

    // Require at least one intermediate word before accepting target
    if (isTarget && chain.length < 2) {
      setErrorMsg("Baue erst eine Kette auf, bevor du das Zielwort eingibst.");
      setInputValue("");
      return;
    }

    // Check if we used all steps without reaching the target
    if (chain.length === steps && !isTarget) {
      setErrorMsg(
        `Das letzte Wort muss "${targetWord}" sein. Versuche eine andere Kette.`
      );
      setInputValue("");
      return;
    }

    const newChain = [...chain, word];
    setChain(newChain);
    setInputValue("");

    // Accept target word (early or on-time completion)
    if (isTarget) {
      solvedRef.current = true;
      setSolved(true);
      setTimeout(() => onSolved(), 1200);
    }
  }, [inputValue, lastLetter, validSet, chain, steps, targetWord, onSolved]);

  const handleBacktrack = useCallback(() => {
    if (chain.length <= 1 || solvedRef.current) return;
    setChain(chain.slice(0, -1));
    setErrorMsg("");
  }, [chain]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const canAddMore = chain.length < steps + 1 && !solved;

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <p className={styles.stepCounter}>
        Schritt {Math.min(chain.length - 1, steps)} von {steps}
      </p>

      <div className={styles.chain}>
        {chain.map((word, i) => {
          const isLast = i === chain.length - 1;
          const isTarget = solved && isLast;
          let bubbleStyle = styles.startWord;
          if (i > 0) {
            bubbleStyle = isTarget ? styles.targetWordReached : styles.chainWord;
          }
          return (
            <div key={`${word}-${i}`} style={{ display: "contents" }}>
              {i > 0 && (
                <div
                  className={`${styles.connector} ${styles.connectorActive}`}
                />
              )}
              <div className={`${styles.wordBubble} ${bubbleStyle}`}>
                {word}
              </div>
            </div>
          );
        })}

        {/* Show target placeholder if not yet reached */}
        {canAddMore && (
          <>
            <div className={styles.connector} />
            {chain.length === steps ? (
              <div className={`${styles.wordBubble} ${styles.targetWord}`}>
                {targetWord}
              </div>
            ) : (
              <div className={`${styles.wordBubble} ${styles.targetWord}`}>
                ?
              </div>
            )}
          </>
        )}
      </div>

      {canAddMore && (
        <div className={styles.inputArea}>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setErrorMsg("");
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Wort mit "${lastLetter}"...`}
              autoFocus
            />
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
            >
              Eingabe
            </button>
          </div>

          <button
            className={styles.backtrackButton}
            onClick={handleBacktrack}
            disabled={chain.length <= 1}
          >
            Letztes Wort entfernen
          </button>

          <p className={styles.hint}>
            Zielwort: <strong>{targetWord}</strong> (in {steps} Schritten)
          </p>
        </div>
      )}

      <p className={errorMsg ? styles.error : styles.success}>
        {errorMsg}
        {solved && "Wortkette vollendet!"}
      </p>
    </div>
  );
}
