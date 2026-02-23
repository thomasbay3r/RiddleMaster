import { useState, useCallback, useRef, useEffect } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./SimonSays.module.css";

interface SimonSaysData {
  sequence: number[];
  starColors: string[];
  startLength: number;
  winLength: number;
}

const STAR_LABELS = ["Gold", "Cyan", "Violett", "Silber", "Rot"];

/** Pentagon positions (5 points), in % relative to container */
const PENTAGON_POSITIONS = [
  { x: 50, y: 8 },   // top
  { x: 88, y: 38 },  // top-right
  { x: 74, y: 82 },  // bottom-right
  { x: 26, y: 82 },  // bottom-left
  { x: 12, y: 38 },  // top-left
];

export default function SimonSays({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as SimonSaysData;
  const { sequence, starColors, startLength, winLength } = data;

  const [currentLength, setCurrentLength] = useState(startLength);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStar, setActiveStar] = useState<number | null>(null);
  const [clickedStar, setClickedStar] = useState<number | null>(null);
  const [phase, setPhase] = useState<"watch" | "input" | "wrong" | "success">("watch");
  const [errorMsg, setErrorMsg] = useState("");
  const solvedRef = useRef(false);

  const currentRound = currentLength - startLength + 1;
  const totalRounds = winLength - startLength + 1;

  const playSequence = useCallback(
    async (length: number) => {
      setIsPlaying(true);
      setPhase("watch");
      setPlayerInput([]);
      setErrorMsg("");

      const seq = sequence.slice(0, length);
      // Small initial delay
      await new Promise((r) => setTimeout(r, 400));

      for (let i = 0; i < seq.length; i++) {
        setActiveStar(seq[i]);
        await new Promise((r) => setTimeout(r, 500));
        setActiveStar(null);
        await new Promise((r) => setTimeout(r, 200));
      }

      setIsPlaying(false);
      setPhase("input");
    },
    [sequence],
  );

  // Auto-play on mount and when round changes
  useEffect(() => {
    const timer = setTimeout(() => {
      playSequence(currentLength);
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStarClick = useCallback(
    (starIdx: number) => {
      if (isPlaying || phase !== "input" || solvedRef.current) return;

      // Visual feedback
      setClickedStar(starIdx);
      setTimeout(() => setClickedStar(null), 200);

      const expectedSeq = sequence.slice(0, currentLength);
      const nextExpected = expectedSeq[playerInput.length];

      if (starIdx === nextExpected) {
        const newInput = [...playerInput, starIdx];
        setPlayerInput(newInput);

        if (newInput.length === currentLength) {
          // Current round complete
          if (currentLength >= winLength) {
            // Full puzzle solved!
            setPhase("success");
            solvedRef.current = true;
            setTimeout(() => onSolved(), 1200);
          } else {
            // Advance to next round
            const nextLen = currentLength + 1;
            setCurrentLength(nextLen);
            setTimeout(() => {
              playSequence(nextLen);
            }, 1000);
          }
        }
      } else {
        // Wrong click
        setPhase("wrong");
        setErrorMsg("Falsche Reihenfolge!");
        setTimeout(() => {
          setPlayerInput([]);
          playSequence(currentLength);
        }, 1500);
      }
    },
    [isPlaying, phase, sequence, currentLength, winLength, playerInput, playSequence, onSolved],
  );

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.roundInfo}>
        <span className={styles.roundLabel}>
          Runde {currentRound} von {totalRounds}
        </span>
        <div className={styles.roundDots}>
          {Array.from({ length: totalRounds }, (_, i) => (
            <span
              key={i}
              className={`${styles.roundDot} ${i < currentRound - 1 ? styles.roundDotDone : ""} ${i === currentRound - 1 ? styles.roundDotCurrent : ""}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.starField}>
        {PENTAGON_POSITIONS.map((pos, idx) => {
          const isActive = activeStar === idx;
          const isClicked = clickedStar === idx;
          const color = starColors[idx];

          const classList = [
            styles.star,
            isActive ? styles.starActive : "",
            isClicked ? styles.starClicked : "",
            phase === "wrong" ? styles.starDisabled : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={idx}
              className={classList}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                "--star-color": color,
                "--star-glow": `${color}80`,
              } as React.CSSProperties}
              onClick={() => handleStarClick(idx)}
              disabled={isPlaying || phase === "success" || phase === "wrong"}
              aria-label={STAR_LABELS[idx]}
            >
              <span className={styles.starInner} />
              <span className={styles.starLabel}>{STAR_LABELS[idx]}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.controls}>
        <p className={styles.status}>
          {phase === "watch" && "Beobachte die Sequenz..."}
          {phase === "input" &&
            `Stern ${playerInput.length + 1} von ${currentLength}`}
          {phase === "wrong" && errorMsg}
          {phase === "success" && "Hervorragend! Alle Sequenzen gemeistert!"}
        </p>

        <button
          className={styles.replayButton}
          onClick={() => playSequence(currentLength)}
          disabled={isPlaying || phase === "success"}
        >
          Sequenz wiederholen
        </button>
      </div>
    </div>
  );
}
