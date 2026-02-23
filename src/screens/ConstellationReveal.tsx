import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "../styles/animations.ts";
import { getChapter, getAllChapters } from "../data/chapters.ts";
import styles from "./ConstellationReveal.module.css";

/**
 * Generic star patterns for each chapter (7 connected stars).
 * Each pattern is an array of [x, y] coordinates within a 200x200 viewBox.
 */
const STAR_PATTERNS: Record<number, [number, number][]> = {
  // Act 1 — Die Erweckung
  1: [[100, 30], [60, 60], [140, 60], [40, 110], [160, 110], [70, 160], [130, 160]],   // Lyra
  2: [[100, 20], [70, 50], [130, 50], [55, 90], [145, 90], [80, 140], [120, 140]],      // Ursa Minor
  3: [[30, 80], [70, 40], [100, 90], [130, 30], [170, 70], [100, 150], [140, 130]],     // Cassiopeia
  4: [[100, 20], [80, 60], [120, 60], [60, 110], [140, 110], [90, 160], [110, 160]],    // Orion
  5: [[100, 25], [50, 70], [150, 70], [30, 130], [170, 130], [80, 170], [120, 170]],    // Cygnus
  6: [[40, 40], [90, 30], [140, 50], [160, 100], [130, 150], [70, 160], [40, 110]],     // Draco
  7: [[60, 70], [90, 30], [120, 30], [150, 70], [130, 120], [100, 150], [70, 120]],     // Corona Borealis
  // Act 2 — Die Prüfung
  8: [[50, 30], [150, 30], [170, 80], [130, 130], [70, 130], [30, 80], [100, 60]],      // Pegasus
  9: [[100, 20], [140, 50], [160, 100], [140, 150], [100, 170], [60, 140], [40, 90]],   // Scorpius
  10: [[70, 30], [130, 30], [150, 80], [130, 130], [70, 130], [50, 80], [100, 100]],    // Gemini
  11: [[100, 15], [60, 50], [140, 50], [40, 100], [160, 100], [100, 140], [100, 180]],  // Aquila
  12: [[80, 20], [120, 40], [150, 80], [130, 130], [80, 160], [50, 120], [60, 70]],     // Perseus
  13: [[30, 60], [70, 30], [120, 40], [160, 80], [140, 140], [80, 160], [40, 120]],     // Centaurus
  14: [[100, 20], [150, 50], [170, 110], [130, 160], [70, 160], [30, 110], [50, 50]],   // Phoenix
  // Act 3 — Die Vollendung
  15: [[20, 90], [60, 50], [100, 30], [140, 50], [180, 70], [160, 130], [100, 160]],    // Hydra
  16: [[100, 20], [140, 60], [160, 110], [130, 160], [80, 170], [50, 130], [60, 70]],   // Sagittarius
  17: [[60, 30], [140, 30], [170, 80], [150, 140], [100, 170], [50, 140], [30, 80]],    // Leo
  18: [[100, 15], [70, 50], [130, 50], [50, 100], [150, 100], [80, 150], [120, 150]],   // Virgo
  19: [[40, 50], [80, 20], [130, 30], [160, 70], [150, 130], [90, 160], [40, 120]],     // Aquarius
  20: [[100, 20], [60, 60], [140, 60], [80, 110], [120, 110], [60, 160], [140, 160]],   // Aries
  21: [[100, 15], [50, 50], [150, 50], [30, 110], [170, 110], [70, 170], [130, 170]],   // Ophiuchus
};

/** Build line segments connecting stars in sequence */
function getLines(stars: [number, number][]): [number, number, number, number][] {
  const lines: [number, number, number, number][] = [];
  for (let i = 0; i < stars.length - 1; i++) {
    lines.push([stars[i][0], stars[i][1], stars[i + 1][0], stars[i + 1][1]]);
  }
  return lines;
}

export default function ConstellationReveal() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

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

  const totalChapters = getAllChapters().length;
  const stars = STAR_PATTERNS[id] ?? STAR_PATTERNS[1]!;
  const lines = getLines(stars);

  return (
    <motion.div
      className={styles.container}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={styles.svgWrapper}>
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          {/* Lines drawn first so stars appear on top */}
          {lines.map(([x1, y1, x2, y2], i) => (
            <line
              key={`line-${i}`}
              className={styles.constellationLine}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          ))}
          {/* Star endpoints */}
          {stars.map(([cx, cy], i) => (
            <circle
              key={`star-${i}`}
              className={styles.constellationStar}
              cx={cx}
              cy={cy}
              r={5}
            />
          ))}
        </svg>
      </div>

      <motion.h2 className={styles.chapterName} variants={slideUp}>
        {chapter.name}
      </motion.h2>

      <motion.p className={styles.outroText} variants={slideUp}>
        {chapter.storyOutro}
      </motion.p>

      <motion.button
        className={styles.mapButton}
        variants={slideUp}
        onClick={() => navigate(id === totalChapters ? "/finale" : "/map")}
      >
        {id === totalChapters ? "Sternenreise vollenden" : "Zur Himmelskarte"}
      </motion.button>
    </motion.div>
  );
}
