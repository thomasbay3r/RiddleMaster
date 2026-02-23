import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "../styles/animations.ts";
import styles from "./Finale.module.css";

const ACTS = [
  {
    title: "Akt I — Die Erweckung",
    constellations: ["Lyra", "Ursa Minor", "Cassiopeia", "Orion", "Cygnus", "Draco", "Corona Borealis"],
    phrase: "Sternlicht weist den Weg heim",
  },
  {
    title: "Akt II — Die Prüfung",
    constellations: ["Pegasus", "Scorpius", "Gemini", "Aquila", "Perseus", "Centaurus", "Phoenix"],
    phrase: "Mut trägt durch die dunkle Nacht",
  },
  {
    title: "Akt III — Die Vollendung",
    constellations: ["Hydra", "Sagittarius", "Leo", "Virgo", "Aquarius", "Aries", "Ophiuchus"],
    phrase: "Für immer vereint im Sternenglanz",
  },
];

const PARTICLE_COUNT = 35;

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

      {ACTS.map((act) => (
        <motion.div key={act.title} className={styles.actSection} variants={fadeIn}>
          <h3 className={styles.actTitle}>{act.title}</h3>
          <div className={styles.constellations}>
            {act.constellations.map((name) => (
              <span key={name} className={styles.constellationName}>
                {name}
              </span>
            ))}
          </div>
          <p className={styles.phrase}>{act.phrase}</p>
        </motion.div>
      ))}

      <motion.h1 className={styles.heading} variants={slideUp}>
        Für dich leuchten die Sterne.
      </motion.h1>

      <motion.p className={styles.subtitle} variants={slideUp}>
        Du hast alle 21 Sternbilder zum Leben erweckt und drei kosmische Botschaften enthüllt.
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
