import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { PuzzleDef } from "../types.ts";
import HintButton from "./HintButton.tsx";
import styles from "./PuzzleFrame.module.css";

interface PuzzleFrameProps {
  chapterId: number;
  puzzle: PuzzleDef;
  hintsUsed: number;
  onHint: (hintIndex: number) => void;
  children: ReactNode;
}

export default function PuzzleFrame({
  chapterId,
  puzzle,
  hintsUsed,
  onHint,
  children,
}: PuzzleFrameProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.frame}>
      <div className={styles.topBar}>
        <div className={styles.titleBlock}>
          <span className={styles.chapterLabel}>Kapitel {chapterId}</span>
          <h2 className={styles.puzzleTitle}>{puzzle.title}</h2>
        </div>

        <div className={styles.controls}>
          <HintButton
            hints={puzzle.hints}
            hintsUsed={hintsUsed}
            onHint={onHint}
          />
          <button
            className={styles.backButton}
            onClick={() => navigate(`/chapter/${chapterId}/puzzles`)}
          >
            Zurück
          </button>
        </div>
      </div>

      <div className={styles.puzzleArea}>{children}</div>
    </div>
  );
}
