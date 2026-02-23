import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "../styles/animations.ts";
import styles from "./Finale.module.css";

const CONSTELLATIONS = [
  "Lyra",
  "Ursa Minor",
  "Cassiopeia",
  "Orion",
  "Cygnus",
  "Draco",
  "Corona Borealis",
];

const PARTICLE_COUNT = 25;

const slowFadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2.0 } },
  exit: { opacity: 0, transition: { duration: 0.6 } },
};

export default function Finale() {
  const navigate = useNavigate();

  return (
    <motion.div
      className={styles.container}
      variants={slowFadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Intense stardust particles */}
      <div className={styles.particles}>
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <span key={i} className={styles.particle} />
        ))}
      </div>

      <motion.div className={styles.constellations} variants={fadeIn}>
        {CONSTELLATIONS.map((name) => (
          <span key={name} className={styles.constellationName}>
            {name}
          </span>
        ))}
      </motion.div>

      <motion.h1 className={styles.heading} variants={slideUp}>
        Für dich leuchten die Sterne.
      </motion.h1>

      <motion.p className={styles.subtitle} variants={slideUp}>
        Du hast alle Sternbilder zum Leben erweckt.
      </motion.p>

      <motion.button
        className={styles.mapLink}
        variants={slideUp}
        onClick={() => navigate("/map")}
      >
        Zur Himmelskarte
      </motion.button>
    </motion.div>
  );
}
