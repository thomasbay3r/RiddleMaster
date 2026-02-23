import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext.tsx";
import { fadeIn, slideUp } from "../styles/animations.ts";
import { getChapter } from "../data/chapters.ts";
import styles from "./ChapterIntro.module.css";

export default function ChapterIntro() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { setCurrentChapter } = useGame();

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

  function handleExplore() {
    setCurrentChapter(id);
    navigate(`/chapter/${id}/puzzles`);
  }

  return (
    <motion.div
      className={styles.container}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className={styles.imageWrapper} variants={fadeIn}>
        <img
          className={styles.image}
          src={chapter.introImage}
          alt={chapter.name}
        />
        <div className={styles.imageOverlay} />
      </motion.div>

      <motion.div className={styles.content} variants={slideUp}>
        <span className={styles.chapterLabel}>Kapitel {id}</span>
        <h1 className={styles.chapterName}>{chapter.name}</h1>
        <p className={styles.theme}>{chapter.theme}</p>
        <p className={styles.story}>{chapter.storyIntro}</p>

        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={handleExplore}>
            Rätsel erkunden
          </button>
          <button className={styles.backButton} onClick={() => navigate("/map")}>
            Zurück
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
