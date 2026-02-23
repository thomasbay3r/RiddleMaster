import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext.tsx";
import { fadeIn, slideUp, stagger } from "../styles/animations.ts";
import styles from "./SkyMap.module.css";

interface ConstellationNode {
  id: number;
  name: string;
  top: string;
  left: string;
}

interface ActDef {
  act: number;
  title: string;
  subtitle: string;
  constellations: ConstellationNode[];
}

const ACTS: ActDef[] = [
  {
    act: 1,
    title: "Akt I",
    subtitle: "Die Erweckung",
    constellations: [
      { id: 1, name: "Lyra", top: "20%", left: "25%" },
      { id: 2, name: "Ursa Minor", top: "15%", left: "55%" },
      { id: 3, name: "Cassiopeia", top: "35%", left: "75%" },
      { id: 4, name: "Orion", top: "50%", left: "40%" },
      { id: 5, name: "Cygnus", top: "45%", left: "15%" },
      { id: 6, name: "Draco", top: "65%", left: "65%" },
      { id: 7, name: "Corona Borealis", top: "75%", left: "35%" },
    ],
  },
  {
    act: 2,
    title: "Akt II",
    subtitle: "Die Prüfung",
    constellations: [
      { id: 8, name: "Pegasus", top: "18%", left: "30%" },
      { id: 9, name: "Scorpius", top: "22%", left: "65%" },
      { id: 10, name: "Gemini", top: "40%", left: "20%" },
      { id: 11, name: "Aquila", top: "38%", left: "78%" },
      { id: 12, name: "Perseus", top: "55%", left: "50%" },
      { id: 13, name: "Centaurus", top: "70%", left: "30%" },
      { id: 14, name: "Phoenix", top: "72%", left: "68%" },
    ],
  },
  {
    act: 3,
    title: "Akt III",
    subtitle: "Die Vollendung",
    constellations: [
      { id: 15, name: "Hydra", top: "15%", left: "40%" },
      { id: 16, name: "Sagittarius", top: "25%", left: "72%" },
      { id: 17, name: "Leo", top: "35%", left: "18%" },
      { id: 18, name: "Virgo", top: "48%", left: "55%" },
      { id: 19, name: "Aquarius", top: "60%", left: "25%" },
      { id: 20, name: "Aries", top: "65%", left: "75%" },
      { id: 21, name: "Ophiuchus", top: "78%", left: "48%" },
    ],
  },
];

export default function SkyMap() {
  const navigate = useNavigate();
  const { isChapterUnlocked, isChapterComplete, isActComplete, isActUnlocked, devMode } = useGame();

  const [activeAct, setActiveAct] = useState(1);

  const allComplete = isActComplete(1) && isActComplete(2) && isActComplete(3);

  // Update active tab when progress loads asynchronously (skip in dev mode)
  useEffect(() => {
    if (devMode) return;
    const act = isActComplete(2) ? 3 : isActComplete(1) ? 2 : 1;
    setActiveAct(act);
  }, [isActComplete, devMode]);

  // Auto-redirect to finale when all acts complete (skip in dev mode)
  useEffect(() => {
    if (allComplete && !devMode) {
      const timer = setTimeout(() => navigate("/finale"), 1500);
      return () => clearTimeout(timer);
    }
  }, [allComplete, devMode, navigate]);

  const currentActDef = ACTS[activeAct - 1];

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

      <div className={styles.actTabs}>
        {ACTS.map((actDef) => {
          const unlocked = isActUnlocked(actDef.act);
          const complete = isActComplete(actDef.act);
          const active = activeAct === actDef.act;

          return (
            <button
              key={actDef.act}
              className={`${styles.actTab} ${active ? styles.actTabActive : ""} ${!unlocked ? styles.actTabLocked : ""} ${complete ? styles.actTabComplete : ""}`}
              onClick={() => unlocked && setActiveAct(actDef.act)}
              disabled={!unlocked}
            >
              <span className={styles.actTabTitle}>{actDef.title}</span>
              <span className={styles.actTabSubtitle}>{actDef.subtitle}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeAct}
          className={styles.mapArea}
          variants={stagger(0.12)}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {currentActDef.constellations.map((c) => {
            const state = getState(c.id);
            const stateClass =
              state === "complete"
                ? styles.complete
                : state === "available"
                  ? styles.available
                  : styles.locked;

            // Use slideUp for entry/exit; idle animations handled via CSS classes
            const motionProps = { variants: slideUp };

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
      </AnimatePresence>
    </motion.div>
  );
}
