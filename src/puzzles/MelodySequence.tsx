import { useState, useCallback, useRef, useEffect } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./MelodySequence.module.css";

const NOTES = [
  { freq: 261.63, label: "do" },
  { freq: 293.66, label: "re" },
  { freq: 329.63, label: "mi" },
  { freq: 349.23, label: "fa" },
  { freq: 392.0, label: "sol" },
  { freq: 440.0, label: "la" },
  { freq: 493.88, label: "si" },
];

interface StarPos {
  x: number;
  y: number;
}

interface MelodyData {
  sequence: number[];
  starPositions: StarPos[];
}

function playNote(audioCtx: AudioContext, freq: number, duration = 0.3) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}

export default function MelodySequence({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as MelodyData;
  const fullSequence = data.sequence;
  const starPositions = data.starPositions;

  const [currentLength, setCurrentLength] = useState(3);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStarIdx, setActiveStarIdx] = useState<number | null>(null);
  const [wrongStarIdx, setWrongStarIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<"listen" | "input" | "success">("listen");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const solvedRef = useRef(false);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playSequence = useCallback(
    async (length: number) => {
      const ctx = getAudioCtx();
      setIsPlaying(true);
      setPhase("listen");
      setPlayerInput([]);

      const seq = fullSequence.slice(0, length);
      for (let i = 0; i < seq.length; i++) {
        const noteIdx = seq[i];
        setActiveStarIdx(noteIdx);
        playNote(ctx, NOTES[noteIdx].freq, 0.35);
        await new Promise((r) => setTimeout(r, 500));
        setActiveStarIdx(null);
        await new Promise((r) => setTimeout(r, 150));
      }

      setIsPlaying(false);
      setPhase("input");
    },
    [fullSequence, getAudioCtx]
  );

  // Auto-play on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      playSequence(currentLength);
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStarClick = useCallback(
    (starIdx: number) => {
      if (isPlaying || phase !== "input" || solvedRef.current) return;

      const ctx = getAudioCtx();
      playNote(ctx, NOTES[starIdx].freq, 0.3);

      setActiveStarIdx(starIdx);
      setTimeout(() => setActiveStarIdx(null), 250);

      const expectedSeq = fullSequence.slice(0, currentLength);
      const nextExpected = expectedSeq[playerInput.length];

      if (starIdx === nextExpected) {
        const newInput = [...playerInput, starIdx];
        setPlayerInput(newInput);

        if (newInput.length === currentLength) {
          // Current sub-sequence complete
          if (currentLength >= fullSequence.length) {
            // Full puzzle solved!
            setPhase("success");
            solvedRef.current = true;
            setTimeout(() => onSolved(), 1000);
          } else {
            // Extend sequence
            const nextLen = currentLength + 1;
            setCurrentLength(nextLen);
            setTimeout(() => {
              playSequence(nextLen);
            }, 1000);
          }
        }
      } else {
        // Wrong note
        setWrongStarIdx(starIdx);
        setTimeout(() => setWrongStarIdx(null), 500);
        setPlayerInput([]);
      }
    },
    [isPlaying, phase, fullSequence, currentLength, playerInput, getAudioCtx, playSequence, onSolved]
  );

  const expectedSeq = fullSequence.slice(0, currentLength);

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.starField}>
        {starPositions.map((pos, idx) => {
          const isActive = activeStarIdx === idx;
          const isWrong = wrongStarIdx === idx;
          const classNames = [
            styles.star,
            isActive ? styles.starPlaying : "",
            isWrong ? styles.starWrong : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={idx}
              className={classNames}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => handleStarClick(idx)}
              disabled={isPlaying || phase === "success"}
              aria-label={NOTES[idx].label}
            >
              <span className={styles.starDot} />
              <span className={styles.starLabel}>{NOTES[idx].label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.controls}>
        <div className={styles.progressBar}>
          {fullSequence.map((_, i) => {
            let dotClass = styles.progressDot;
            if (i < currentLength - 1) {
              dotClass += ` ${styles.progressDotActive}`;
            } else if (i === currentLength - 1) {
              dotClass += ` ${styles.progressDotCurrent}`;
            }
            return <span key={i} className={dotClass} />;
          })}
        </div>

        <p className={styles.status}>
          {phase === "listen" && "H\u00f6re zu..."}
          {phase === "input" &&
            `Ton ${playerInput.length + 1} von ${expectedSeq.length}`}
          {phase === "success" && "Wunderbar! Die Melodie erklingt!"}
        </p>

        <button
          className={styles.playButton}
          onClick={() => playSequence(currentLength)}
          disabled={isPlaying}
        >
          Melodie abspielen
        </button>
      </div>
    </div>
  );
}
