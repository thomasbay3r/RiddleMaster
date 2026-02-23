import { Suspense, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext.tsx";
import { fadeIn } from "../styles/animations.ts";
import { getChapter } from "../data/chapters.ts";
import PuzzleFrame from "../components/PuzzleFrame.tsx";
import styles from "./PuzzleScreen.module.css";

export default function PuzzleScreen() {
  const { chapterId, puzzleId } = useParams<{
    chapterId: string;
    puzzleId: string;
  }>();
  const navigate = useNavigate();
  const { solvePuzzle, collectClue, getHintsUsed } = useGame();

  const chapNum = Number(chapterId);
  const puzzNum = Number(puzzleId);

  const chapter = getChapter(chapNum);
  const puzzle = chapter?.puzzles.find((p) => p.puzzleIndex === puzzNum);

  const currentHintsUsed = getHintsUsed(chapNum, puzzNum);
  const [hintsUsed, setHintsUsed] = useState(currentHintsUsed);

  const handleHint = useCallback(
    (_hintIndex: number) => {
      setHintsUsed((prev) => Math.min(prev + 1, 2));
    },
    [],
  );

  const handleSolved = useCallback(async () => {
    await solvePuzzle(chapNum, puzzNum, hintsUsed);
    if (puzzle?.clue) {
      await collectClue(chapNum, puzzle.clue);
    }
    navigate(`/chapter/${chapNum}/puzzle/${puzzNum}/solved`);
  }, [chapNum, puzzNum, hintsUsed, solvePuzzle, collectClue, puzzle, navigate]);

  if (!chapter || !puzzle) {
    return (
      <motion.div
        className={styles.notFound}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <p className={styles.notFoundText}>Rätsel nicht gefunden</p>
        <button
          className={styles.backButton}
          onClick={() =>
            chapter
              ? navigate(`/chapter/${chapNum}/puzzles`)
              : navigate("/map")
          }
        >
          Zurück
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.container}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <PuzzleFrame
        chapterId={chapNum}
        puzzle={puzzle}
        hintsUsed={hintsUsed}
        onHint={handleHint}
      >
        <Suspense
          fallback={
            <div className={styles.placeholder}>
              <p className={styles.placeholderText}>Rätsel wird geladen...</p>
            </div>
          }
        >
          {/*
            Puzzle component registry will be implemented in a future task.
            For now, show a placeholder with puzzle info.
          */}
          <div className={styles.placeholder}>
            <p className={styles.placeholderText}>Rätsel wird geladen...</p>
            <span className={styles.placeholderType}>{puzzle.type}</span>
            <p className={styles.placeholderText}>{puzzle.description}</p>

            {/* Temporary solve button for testing */}
            <button
              className={styles.backButton}
              onClick={handleSolved}
              style={{ marginTop: "2rem", borderColor: "rgba(255,215,0,0.3)", color: "#ffd700" }}
            >
              (Debug) Rätsel lösen
            </button>
          </div>
        </Suspense>
      </PuzzleFrame>
    </motion.div>
  );
}
