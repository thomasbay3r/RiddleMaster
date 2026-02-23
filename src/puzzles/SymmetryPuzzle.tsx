import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./SymmetryPuzzle.module.css";

interface SymmetryData {
  gridSize: number;
  pattern: [number, number][];
}

export default function SymmetryPuzzle({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as SymmetryData;
  const { gridSize, pattern } = data;

  // Build set of left-half pattern cells for quick lookup
  const patternSet = useRef(
    new Set(pattern.map(([r, c]) => `${r},${c}`))
  );

  // Player-filled cells on the right side
  const [filled, setFilled] = useState<Set<string>>(new Set());
  const [errorCells, setErrorCells] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState("");
  const [solved, setSolved] = useState(false);

  const mirrorCol = gridSize / 2; // column 5 is the mirror boundary (cols 0-4 left, 5-9 right)

  const toggleCell = useCallback(
    (row: number, col: number) => {
      if (solved) return;
      // Only allow clicking on the right half (col >= mirrorCol)
      if (col < mirrorCol) return;

      const key = `${row},${col}`;
      setFilled((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });

      // Clear any previous error states and feedback
      setErrorCells(new Set());
      setFeedback("");
    },
    [mirrorCol, solved]
  );

  const checkSolution = useCallback(() => {
    if (solved) return;

    // Compute expected right-side cells by mirroring the pattern
    const expected = new Set<string>();
    for (const [r, c] of pattern) {
      const mirroredCol = gridSize - 1 - c;
      expected.add(`${r},${mirroredCol}`);
    }

    // Check if player's filled cells match expected
    const errors = new Set<string>();

    // Find cells that are filled but shouldn't be
    for (const key of filled) {
      if (!expected.has(key)) {
        errors.add(key);
      }
    }

    // Find cells that should be filled but aren't
    for (const key of expected) {
      if (!filled.has(key)) {
        errors.add(key);
      }
    }

    if (errors.size === 0) {
      setSolved(true);
      setFeedback("Perfekte Symmetrie!");
      setTimeout(() => onSolved(), 800);
    } else {
      setErrorCells(errors);
      setFeedback("Nicht ganz symmetrisch...");
      // Clear error highlights after a moment
      setTimeout(() => {
        setErrorCells(new Set());
      }, 1500);
    }
  }, [solved, pattern, gridSize, filled, onSolved]);

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>
      <p className={styles.instruction}>Spiegle das Muster auf die rechte Seite</p>

      <div className={styles.gridWrapper}>
        <div className={styles.grid}>
          {Array.from({ length: gridSize }, (_, row) =>
            Array.from({ length: gridSize }, (_, col) => {
              const key = `${row},${col}`;
              const isLeftHalf = col < mirrorCol;
              const isPattern = patternSet.current.has(key);
              const isFilled = filled.has(key);
              const isError = errorCells.has(key);
              const isMirrorEdge = col === mirrorCol - 1;

              let cellClass = styles.cell;
              if (!isLeftHalf && !solved) cellClass += ` ${styles.cellClickable}`;
              if (isPattern && isLeftHalf) cellClass += ` ${styles.cellPattern}`;
              if (isFilled && !isLeftHalf) cellClass += ` ${styles.cellFilled}`;
              if (isError) cellClass += ` ${styles.cellError}`;
              if (isMirrorEdge) cellClass += ` ${styles.cellMirrorLine}`;

              return (
                <button
                  key={key}
                  className={cellClass}
                  onClick={() => toggleCell(row, col)}
                  aria-label={
                    isLeftHalf
                      ? isPattern
                        ? `Muster Zeile ${row + 1}, Spalte ${col + 1}`
                        : `Leer Zeile ${row + 1}, Spalte ${col + 1}`
                      : isFilled
                        ? `Gefüllt Zeile ${row + 1}, Spalte ${col + 1}`
                        : `Leer Zeile ${row + 1}, Spalte ${col + 1}`
                  }
                />
              );
            })
          )}
        </div>
      </div>

      <div className={styles.controls}>
        {!solved && (
          <button className={styles.checkButton} onClick={checkSolution}>
            Pr&uuml;fen
          </button>
        )}
        <p className={`${styles.feedback} ${solved ? styles.feedbackSuccess : ""}`}>
          {feedback}
        </p>
      </div>
    </div>
  );
}
