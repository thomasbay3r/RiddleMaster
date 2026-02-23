import type { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

export const stagger = (staggerDelay = 0.1): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerDelay } },
});

export const starPulse: Variants = {
  idle: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export const goldenGlow: Variants = {
  idle: {
    filter: [
      "drop-shadow(0 0 8px #ffd70066)",
      "drop-shadow(0 0 16px #ffd700aa)",
      "drop-shadow(0 0 8px #ffd70066)",
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};
