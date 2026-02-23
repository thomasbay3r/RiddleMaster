import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext.tsx";
import { fadeIn, slideUp } from "../styles/animations.ts";
import styles from "./StartScreen.module.css";

export default function StartScreen() {
  const navigate = useNavigate();
  const { login, player, devMode, toggleDevMode } = useGame();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [welcomeBack, setWelcomeBack] = useState<string | null>(null);

  // Dev mode: skip login, go straight to map
  useEffect(() => {
    if (devMode) navigate("/map", { replace: true });
  }, [devMode, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const isReturning = await login(trimmed);

      if (isReturning) {
        setWelcomeBack(trimmed);
        setTimeout(() => navigate("/map"), 1800);
      } else {
        navigate("/map");
      }
    } catch {
      setError("Verbindung fehlgeschlagen. Bitte versuche es erneut.");
      setLoading(false);
    }
  }

  /* If already logged in and returning player greeting is showing */
  if (welcomeBack) {
    return (
      <motion.div
        className={styles.container}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.p className={styles.welcomeBack} variants={slideUp}>
          Willkommen zurück, {welcomeBack}!
        </motion.p>
      </motion.div>
    );
  }

  /* If player is already logged in (e.g. navigated back), send to map */
  if (player && !loading) {
    // Already logged in — could auto-redirect, but keep the form visible
  }

  return (
    <motion.div
      className={styles.container}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1 className={styles.title} variants={slideUp}>
        Sternenreise
      </motion.h1>

      <motion.p className={styles.subtitle} variants={slideUp}>
        Eine Reise durch die Sterne
      </motion.p>

      <motion.form
        className={styles.form}
        variants={slideUp}
        onSubmit={handleSubmit}
      >
        <input
          className={styles.input}
          type="text"
          placeholder="Dein Name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          autoFocus
        />

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} type="submit" disabled={loading || !name.trim()}>
          {loading ? <span className={styles.spinner} /> : "Reise beginnen"}
        </button>
      </motion.form>

      <button className={styles.devToggle} onClick={toggleDevMode} type="button">
        {devMode ? "Dev Mode: ON" : "Dev Mode: OFF"}
      </button>
    </motion.div>
  );
}
