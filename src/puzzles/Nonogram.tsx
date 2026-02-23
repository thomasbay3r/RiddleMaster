import { Fragment, useState, useCallback, useMemo, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./Nonogram.module.css";

interface NonogramData {
  size: number;
  solution: number[][];
  rowHints: number[][];
  colHints: number[][];
}

// Cell states: 0 = empty, 1 = filled, 2 = marked-empty
type CellState = 0 | 1 | 2;

export default function Nonogram({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as NonogramData;
  const { size, solution, rowHints, colHints } = data;

  const [grid, setGrid] = useState<CellState[][]>(() =>
    Array.from({ length: size }, () => Array<CellState>(size).fill(0))
  );
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const solvedRef = useRef(false);

  // Max hint length for row/column layout
  const maxRowHintLen = useMemo(
    () => Math.max(...rowHints.map((h) => h.length)),
    [rowHints]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (solvedRef.current) return;
      setWrongCells(new Set());
      setFeedback("");
      setFeedbackSuccess(false);
      setGrid((prev) => {
        const next = prev.map((r) => [...r]);
        // Cycle: empty(0) -> filled(1) -> marked(2) -> empty(0)
        next[row][col] = ((next[row][col] + 1) % 3) as CellState;
        return next;
      });
    },
    []
  );

  const handleCheck = useCallback(() => {
    if (solvedRef.current) return;

    const wrong = new Set<string>();
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const playerFilled = grid[r][c] === 1;
        const shouldBeFilled = solution[r][c] === 1;
        if (playerFilled !== shouldBeFilled) {
          wrong.add(`${r},${c}`);
        }
      }
    }

    if (wrong.size === 0) {
      solvedRef.current = true;
      setSolved(true);
      setFeedback("Perfekt! Das Bild ist enthüllt!");
      setFeedbackSuccess(true);
      setTimeout(() => onSolved(), 1200);
    } else {
      setWrongCells(wrong);
      setFeedback(`${wrong.size} ${wrong.size === 1 ? "Zelle ist" : "Zellen sind"} noch falsch.`);
      setFeedbackSuccess(false);
      // Clear wrong indicators after a moment
      setTimeout(() => setWrongCells(new Set()), 1500);
    }
  }, [grid, size, solution, onSolved]);

  const handleClear = useCallback(() => {
    if (solvedRef.current) return;
    setGrid(Array.from({ length: size }, () => Array<CellState>(size).fill(0)));
    setWrongCells(new Set());
    setFeedback("");
    setFeedbackSuccess(false);
  }, [size]);

  const getCellClass = (row: number, col: number): string => {
    const state = grid[row][col];
    const key = `${row},${col}`;
    const isWrong = wrongCells.has(key);

    if (solved && state === 1) return `${styles.cell} ${styles.cellGold}`;
    if (isWrong) return `${styles.cell} ${styles.cellWrong}`;
    if (state === 1) return `${styles.cell} ${styles.cellFilled}`;
    if (state === 2) return `${styles.cell} ${styles.cellMarked}`;
    return styles.cell;
  };

  // Grid template: row hints column + N cell columns
  const gridTemplate = `auto repeat(${size}, 32px)`;

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>
      <p className={styles.legend}>
        Klicken: füllen &rarr; markieren (X) &rarr; leeren
      </p>

      <div
        className={styles.boardWrapper}
        style={{
          gridTemplateColumns: gridTemplate,
          gridTemplateRows: `auto repeat(${size}, 32px)`,
          display: "inline-grid",
        }}
      >
        {/* Corner spacer */}
        <div className={styles.cornerSpacer} />

        {/* Column hints */}
        {colHints.map((hints, c) => (
          <div key={`ch-${c}`} className={styles.colHintsCell}>
            {hints.map((n, i) => (
              <span key={i} className={styles.hintNumber}>
                {n}
              </span>
            ))}
          </div>
        ))}

        {/* Rows */}
        {Array.from({ length: size }, (_, r) => (
          <Fragment key={`row-${r}`}>
            {/* Row hints */}
            <div className={styles.rowHintsCell}>
              {rowHints[r].map((n, i) => (
                <span
                  key={i}
                  className={styles.hintNumber}
                  style={{
                    marginLeft:
                      i === 0
                        ? `${(maxRowHintLen - rowHints[r].length) * 14}px`
                        : undefined,
                  }}
                >
                  {n}
                </span>
              ))}
            </div>

            {/* Cells */}
            {Array.from({ length: size }, (_, c) => (
              <div
                key={`${r}-${c}`}
                className={getCellClass(r, c)}
                onClick={() => handleCellClick(r, c)}
              />
            ))}
          </Fragment>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          className={styles.clearButton}
          onClick={handleClear}
          disabled={solvedRef.current}
        >
          Zurücksetzen
        </button>
        <button
          className={styles.checkButton}
          onClick={handleCheck}
          disabled={solvedRef.current}
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
  );
}
