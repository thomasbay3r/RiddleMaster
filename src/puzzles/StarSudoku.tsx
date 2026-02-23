import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./StarSudoku.module.css";

interface SudokuData {
  symbols: string[];
  given: number[][];
  solution: number[][];
}

export default function StarSudoku({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as SudokuData;
  const { symbols, given, solution } = data;

  // Player grid: 0 = empty, 1-6 = symbol index + 1
  const [grid, setGrid] = useState<number[][]>(() =>
    given.map((row) => [...row])
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errorCells, setErrorCells] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [solved, setSolved] = useState(false);
  const solvedRef = useRef(false);

  const isGiven = (row: number, col: number) => given[row][col] !== 0;

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (solvedRef.current) return;
      if (isGiven(row, col)) return;
      setErrorCells(new Set());
      setFeedback("");
      setFeedbackSuccess(false);

      if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
        setSelectedCell(null);
      } else {
        setSelectedCell([row, col]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCell]
  );

  const handlePaletteClick = useCallback(
    (symbolValue: number) => {
      if (solvedRef.current || !selectedCell) return;
      const [row, col] = selectedCell;
      if (isGiven(row, col)) return;

      setGrid((prev) => {
        const next = prev.map((r) => [...r]);
        // Toggle: if already this value, clear it
        next[row][col] = prev[row][col] === symbolValue ? 0 : symbolValue;
        return next;
      });
      setErrorCells(new Set());
      setFeedback("");
      setFeedbackSuccess(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCell]
  );

  const handleClear = useCallback(() => {
    if (solvedRef.current || !selectedCell) return;
    const [row, col] = selectedCell;
    if (isGiven(row, col)) return;

    setGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = 0;
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCell]);

  const handleCheck = useCallback(() => {
    if (solvedRef.current) return;

    const errors = new Set<string>();
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (grid[r][c] !== solution[r][c]) {
          errors.add(`${r},${c}`);
        }
      }
    }

    if (errors.size === 0) {
      solvedRef.current = true;
      setSolved(true);
      setSelectedCell(null);
      setFeedback("Perfekt! Das Sternen-Sudoku ist gelöst!");
      setFeedbackSuccess(true);
      setTimeout(() => onSolved(), 1200);
    } else {
      setErrorCells(errors);
      const emptyCount = [...errors].filter(
        (key) => {
          const [r, c] = key.split(",").map(Number);
          return grid[r][c] === 0;
        }
      ).length;
      const wrongCount = errors.size - emptyCount;
      const parts: string[] = [];
      if (emptyCount > 0) parts.push(`${emptyCount} leer`);
      if (wrongCount > 0) parts.push(`${wrongCount} falsch`);
      setFeedback(`Noch nicht korrekt: ${parts.join(", ")}.`);
      setFeedbackSuccess(false);
      setTimeout(() => setErrorCells(new Set()), 2000);
    }
  }, [grid, solution, onSolved]);

  // Determine box borders: 2x3 boxes (2 rows x 3 columns per box)
  const isBoxRightBorder = (col: number) => col === 2;
  const isBoxBottomBorder = (row: number) => row === 1 || row === 3;

  const getCellClass = (row: number, col: number): string => {
    const classes = [styles.cell];

    if (isBoxRightBorder(col)) classes.push(styles.cellBoxRight);
    if (isBoxBottomBorder(row)) classes.push(styles.cellBoxBottom);

    if (isGiven(row, col)) {
      classes.push(styles.cellGiven);
    } else {
      classes.push(styles.cellEditable);
    }

    if (solved && !isGiven(row, col)) {
      classes.push(styles.cellGold);
    }

    if (
      selectedCell &&
      selectedCell[0] === row &&
      selectedCell[1] === col
    ) {
      classes.push(styles.cellSelected);
    }

    if (errorCells.has(`${row},${col}`)) {
      classes.push(styles.cellError);
    }

    return classes.join(" ");
  };

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.board}>
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={getCellClass(r, c)}
              onClick={() => handleCellClick(r, c)}
            >
              {val > 0 ? symbols[val - 1] : ""}
            </div>
          ))
        )}
      </div>

      <div className={styles.palette}>
        <span className={styles.paletteLabel}>Symbol:</span>
        {symbols.map((sym, idx) => (
          <button
            key={idx}
            className={styles.paletteButton}
            onClick={() => handlePaletteClick(idx + 1)}
            disabled={solvedRef.current || !selectedCell}
          >
            {sym}
          </button>
        ))}
        <button
          className={`${styles.paletteButton} ${styles.paletteClear}`}
          onClick={handleClear}
          disabled={solvedRef.current || !selectedCell}
        >
          &times;
        </button>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.checkButton}
          onClick={handleCheck}
          disabled={solvedRef.current}
        >
          Pr&uuml;fen
        </button>
      </div>

      <p className={`${styles.feedback} ${feedbackSuccess ? styles.feedbackSuccess : ""}`}>
        {feedback}
      </p>
    </div>
  );
}
