import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, scaleIn } from "../styles/animations.ts";
import styles from "./HintButton.module.css";

interface HintButtonProps {
  hints: [string, string];
  hintsUsed: number;
  onHint: (hintIndex: number) => void;
}

export default function HintButton({ hints, hintsUsed, onHint }: HintButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const allUsed = hintsUsed >= 2;

  function handleClick() {
    if (allUsed) return;
    const nextHint = hintsUsed; // 0 or 1
    setDisplayIndex(nextHint);
    setShowModal(true);
    onHint(nextHint);
  }

  function handleClose() {
    setShowModal(false);
  }

  return (
    <>
      <button
        className={styles.hintButton}
        onClick={handleClick}
        disabled={allUsed}
        title={allUsed ? "Alle Hinweise verwendet" : `Hinweis ${hintsUsed + 1} anzeigen`}
      >
        <span className={styles.icon}>Hinweis</span>
        <span>({hintsUsed}/2)</span>
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className={styles.overlay}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
          >
            <motion.div
              className={styles.modal}
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={styles.modalTitle}>
                Hinweis {displayIndex + 1}
              </h3>
              <p className={styles.modalText}>
                {hints[displayIndex]}
              </p>
              <button className={styles.closeButton} onClick={handleClose}>
                Verstanden
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
