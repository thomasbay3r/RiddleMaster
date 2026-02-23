import { useState, useCallback, useMemo, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./LogicDeduction.module.css";

interface LogicData {
  stars: string[];
  categories: Record<string, string[]>;
  solution: Record<string, Record<string, string>>;
  clues: string[];
}

type Assignments = Record<string, Record<string, string>>;

export default function LogicDeduction({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as LogicData;
  const { stars, categories, clues, solution } = data;
  const categoryKeys = useMemo(() => Object.keys(categories), [categories]);

  const [assignments, setAssignments] = useState<Assignments>(() => {
    const init: Assignments = {};
    for (const star of stars) {
      init[star] = {};
      for (const cat of Object.keys(categories)) {
        init[star][cat] = "";
      }
    }
    return init;
  });

  const [wrongRows, setWrongRows] = useState<Set<string>>(new Set());
  const [correctRows, setCorrectRows] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const solvedRef = useRef(false);

  // Track which values are used per category
  const usedValues = useMemo(() => {
    const used: Record<string, Record<string, string>> = {};
    for (const cat of categoryKeys) {
      used[cat] = {};
      for (const star of stars) {
        const val = assignments[star][cat];
        if (val) {
          used[cat][val] = star;
        }
      }
    }
    return used;
  }, [assignments, categoryKeys, stars]);

  const handleChange = useCallback(
    (star: string, category: string, value: string) => {
      if (solvedRef.current) return;
      setWrongRows(new Set());
      setCorrectRows(new Set());
      setFeedback("");
      setFeedbackSuccess(false);
      setAssignments((prev) => ({
        ...prev,
        [star]: { ...prev[star], [category]: value },
      }));
    },
    []
  );

  const allFilled = useMemo(() => {
    return stars.every((star) =>
      categoryKeys.every((cat) => assignments[star][cat] !== "")
    );
  }, [assignments, stars, categoryKeys]);

  const handleCheck = useCallback(() => {
    if (!allFilled || solvedRef.current) return;

    const wrong = new Set<string>();
    const correct = new Set<string>();

    for (const star of stars) {
      const isCorrect = categoryKeys.every(
        (cat) => assignments[star][cat] === solution[star][cat]
      );
      if (isCorrect) {
        correct.add(star);
      } else {
        wrong.add(star);
      }
    }

    setWrongRows(wrong);
    setCorrectRows(correct);

    if (wrong.size === 0) {
      solvedRef.current = true;
      setFeedback("Perfekt! Alle Zuordnungen sind korrekt!");
      setFeedbackSuccess(true);
      setTimeout(() => onSolved(), 1200);
    } else {
      setFeedback(
        `${wrong.size} ${wrong.size === 1 ? "Zeile ist" : "Zeilen sind"} noch nicht richtig.`
      );
      setFeedbackSuccess(false);
    }
  }, [allFilled, stars, categoryKeys, assignments, solution, onSolved]);

  const getCategoryLabel = (cat: string): string => {
    if (cat === "color") return "Farbe";
    if (cat === "planet") return "Planet";
    return cat;
  };

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.layout}>
        <div className={styles.gridSection}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.headerRow}>
                <th>Stern</th>
                {categoryKeys.map((cat) => (
                  <th key={cat}>{getCategoryLabel(cat)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stars.map((star) => {
                const isWrong = wrongRows.has(star);
                const isCorrect = correctRows.has(star);
                const rowClass = isCorrect
                  ? styles.rowCorrect
                  : isWrong
                    ? styles.rowWrong
                    : "";

                return (
                  <tr key={star} className={rowClass}>
                    <td className={styles.starCell}>
                      <span className={styles.starIcon}>&#9733;</span>
                      {star}
                    </td>
                    {categoryKeys.map((cat) => {
                      const currentVal = assignments[star][cat];
                      const selectClass = [
                        styles.select,
                        isCorrect ? styles.selectCorrect : "",
                        isWrong ? styles.selectWrong : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <td key={cat} className={styles.selectCell}>
                          <select
                            className={selectClass}
                            value={currentVal}
                            onChange={(e) =>
                              handleChange(star, cat, e.target.value)
                            }
                            disabled={solvedRef.current}
                          >
                            <option value="">--</option>
                            {categories[cat].map((option) => {
                              const usedBy = usedValues[cat][option];
                              const isUsedElsewhere =
                                usedBy !== undefined && usedBy !== star;
                              return (
                                <option
                                  key={option}
                                  value={option}
                                  disabled={isUsedElsewhere}
                                >
                                  {option}
                                  {isUsedElsewhere ? ` (${usedBy})` : ""}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
            <button
              className={styles.checkButton}
              onClick={handleCheck}
              disabled={!allFilled || solvedRef.current}
            >
              Pr&uuml;fen
            </button>
          </div>

          <p
            className={`${styles.feedback} ${feedbackSuccess ? styles.feedbackSuccess : ""}`}
          >
            {feedback}
          </p>
        </div>

        <div className={styles.cluesSection}>
          <h4 className={styles.cluesTitle}>Hinweise</h4>
          <ul className={styles.cluesList}>
            {clues.map((clue, i) => (
              <li key={i} className={styles.clueItem}>
                {i + 1}. {clue}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
