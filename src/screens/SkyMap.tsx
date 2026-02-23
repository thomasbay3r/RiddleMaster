import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext.tsx";
import { fadeIn, slideUp, stagger, starPulse, goldenGlow } from "../styles/animations.ts";
import styles from "./SkyMap.module.css";

interface ConstellationNode {
  id: number;
  name: string;
  top: string;
  left: string;
}

const CONSTELLATIONS: ConstellationNode[] = [
  { id: 1, name: "Lyra", top: "20%", left: "25%" },
  { id: 2, name: "Ursa Minor", top: "15%", left: "55%" },
  { id: 3, name: "Cassiopeia", top: "35%", left: "75%" },
  { id: 4, name: "Orion", top: "50%", left: "40%" },
  { id: 5, name: "Cygnus", top: "45%", left: "15%" },
  { id: 6, name: "Draco", top: "65%", left: "65%" },
  { id: 7, name: "Corona Borealis", top: "75%", left: "35%" },
];

export default function SkyMap() {
  const navigate = useNavigate();
  const { isChapterUnlocked, isChapterComplete } = useGame();

  const allComplete = CONSTELLATIONS.every((c) => isChapterComplete(c.id));

  useEffect(() => {
    if (allComplete) {
      const timer = setTimeout(() => navigate("/finale"), 1500);
      return () => clearTimeout(timer);
    }
  }, [allComplete, navigate]);

  function getState(id: number): "locked" | "available" | "complete" {
    if (isChapterComplete(id)) return "complete";
    if (isChapterUnlocked(id)) return "available";
    return "locked";
  }

  function handleClick(id: number) {
    const state = getState(id);
    if (state === "available") {
      navigate(`/chapter/${id}`);
    }
  }

  return (
    <motion.div
      className={styles.container}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1 className={styles.header} variants={slideUp}>
        Himmelskarte
      </motion.h1>

      <motion.div
        className={styles.mapArea}
        variants={stagger(0.12)}
        initial="hidden"
        animate="visible"
      >
        {CONSTELLATIONS.map((c) => {
          const state = getState(c.id);
          const stateClass =
            state === "complete"
              ? styles.complete
              : state === "available"
                ? styles.available
                : styles.locked;

          /* Choose the right motion variant per state */
          const motionProps =
            state === "complete"
              ? { variants: goldenGlow, animate: "idle" }
              : state === "available"
                ? { variants: starPulse, animate: "idle" }
                : { variants: slideUp };

          return (
            <motion.button
              key={c.id}
              className={`${styles.node} ${stateClass}`}
              style={{ top: c.top, left: c.left }}
              onClick={() => handleClick(c.id)}
              disabled={state === "locked"}
              {...motionProps}
            >
              <span className={styles.star} />
              <span className={styles.label}>{c.name}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
