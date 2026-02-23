import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext.tsx";
import { fadeIn, slideUp, stagger, starPulse, goldenGlow } from "../styles/animations.ts";
import { getChapter } from "../data/chapters.ts";
import styles from "./PuzzleSelect.module.css";

export default function PuzzleSelect() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { isPuzzleSolved, isChapterComplete } = useGame();

  const id = Number(chapterId);
  const chapter = getChapter(id);

  if (!chapter) {
    return (
      <motion.div
        className={styles.notFound}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <p className={styles.notFoundText}>Kapitel nicht gefunden</p>
        <button className={styles.backButton} onClick={() => navigate("/map")}>
          Zur Himmelskarte
        </button>
      </motion.div>
    );
  }

  const puzzles = chapter.puzzles;
  const allSolved = isChapterComplete(id);

  return (
    <motion.div
      className={styles.container}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1 className={styles.header} variants={slideUp}>
        {chapter.name}
      </motion.h1>
      <motion.p className={styles.subheader} variants={slideUp}>
        {chapter.theme}
      </motion.p>

      <motion.div
        className={styles.grid}
        variants={stagger(0.1)}
        initial="hidden"
        animate="visible"
      >
        {puzzles.map((puzzle, idx) => {
          const solved = isPuzzleSolved(id, puzzle.puzzleIndex);
          const stateClass = solved ? styles.solved : styles.available;
          const motionVariant = solved ? goldenGlow : starPulse;

          return (
            <motion.button
              key={puzzle.id}
              className={`${styles.puzzleNode} ${stateClass}`}
              variants={motionVariant}
              animate="idle"
              onClick={() =>
                navigate(`/chapter/${id}/puzzle/${puzzle.puzzleIndex}`)
              }
            >
              <span className={styles.starIcon}>
                {solved ? "\u2713" : "\u2606"}
              </span>
              <span className={styles.puzzleTitle}>
                {puzzle.title || `Rätsel ${idx + 1}`}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      <div className={styles.actions}>
        {allSolved && (
          <motion.button
            className={styles.revealButton}
            variants={slideUp}
            initial="hidden"
            animate="visible"
            onClick={() => navigate(`/chapter/${id}/reveal`)}
          >
            Sternbild enthüllen
          </motion.button>
        )}
        <button
          className={styles.backButton}
          onClick={() => navigate("/map")}
        >
          Zurück zur Karte
        </button>
      </div>
    </motion.div>
  );
}
