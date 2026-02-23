import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext.tsx";
import { fadeIn, scaleIn } from "../styles/animations.ts";
import { getChapter } from "../data/chapters.ts";
import styles from "./PuzzleSolved.module.css";

const PARTICLE_COUNT = 15;

export default function PuzzleSolved() {
  const { chapterId, puzzleId } = useParams<{
    chapterId: string;
    puzzleId: string;
  }>();
  const navigate = useNavigate();
  const { clues } = useGame();

  const chapNum = Number(chapterId);
  const puzzNum = Number(puzzleId);

  const chapter = getChapter(chapNum);
  const puzzle = chapter?.puzzles.find((p) => p.puzzleIndex === puzzNum);

  /* Check if there's a clue associated with this puzzle */
  const clueEntry = clues.find((c) => c.chapter === chapNum);
  const clueText = puzzle?.clue || clueEntry?.clueText;

  return (
    <motion.div
      className={styles.container}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Stardust particles */}
      <div className={styles.particles}>
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <span key={i} className={styles.particle} />
        ))}
      </div>

      <motion.h1 className={styles.heading} variants={scaleIn}>
        Wunderbar!
      </motion.h1>

      <motion.p className={styles.subtext} variants={scaleIn}>
        Du hast das Rätsel gelöst!
      </motion.p>

      {clueText && (
        <motion.div className={styles.clue} variants={scaleIn}>
          <span className={styles.clueLabel}>Du hast einen Hinweis gefunden:</span>
          {clueText}
        </motion.div>
      )}

      <motion.button
        className={styles.continueButton}
        variants={scaleIn}
        onClick={() => navigate(`/chapter/${chapNum}/puzzles`)}
      >
        Weiter
      </motion.button>
    </motion.div>
  );
}
