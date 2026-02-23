import { useState, useCallback, useMemo, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./WordSearch.module.css";

interface WordSearchData {
  gridSize: number;
  words: string[];
  grid: string[][];
  wordPositions: Record<string, [number, number, number, number]>;
}

export default function WordSearch({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as WordSearchData;
  const { gridSize, words, grid, wordPositions } = data;

  const [startCell, setStartCell] = useState<[number, number] | null>(null);
  const [hoverCell, setHoverCell] = useState<[number, number] | null>(null);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const solvedRef = useRef(false);

  // Get cells along a line between start and end
  const getCellsInLine = useCallback(
    (
      sr: number,
      sc: number,
      er: number,
      ec: number
    ): [number, number][] | null => {
      const dr = er - sr;
      const dc = ec - sc;

      // Must be horizontal, vertical, or diagonal (45 degrees)
      const absR = Math.abs(dr);
      const absC = Math.abs(dc);

      if (absR !== 0 && absC !== 0 && absR !== absC) return null;
      if (absR === 0 && absC === 0) return [[sr, sc]];

      const steps = Math.max(absR, absC);
      const stepR = steps === 0 ? 0 : dr / steps;
      const stepC = steps === 0 ? 0 : dc / steps;

      const cells: [number, number][] = [];
      for (let i = 0; i <= steps; i++) {
        cells.push([sr + stepR * i, sc + stepC * i]);
      }
      return cells;
    },
    []
  );

  // Current selection preview
  const selectedCells = useMemo(() => {
    if (!startCell) return new Set<string>();
    const end = hoverCell ?? startCell;
    const cells = getCellsInLine(startCell[0], startCell[1], end[0], end[1]);
    if (!cells) return new Set<string>();
    return new Set(cells.map(([r, c]) => `${r},${c}`));
  }, [startCell, hoverCell, getCellsInLine]);

  const handleCellMouseDown = useCallback(
    (row: number, col: number) => {
      if (solvedRef.current) return;
      setFeedback("");
      setFeedbackSuccess(false);
      setStartCell([row, col]);
      setHoverCell([row, col]);
    },
    []
  );

  const handleCellMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!startCell) return;
      setHoverCell([row, col]);
    },
    [startCell]
  );

  const handleCellMouseUp = useCallback(
    (row: number, col: number) => {
      if (!startCell || solvedRef.current) return;

      const endCell: [number, number] = [row, col];
      const cells = getCellsInLine(
        startCell[0],
        startCell[1],
        endCell[0],
        endCell[1]
      );

      setStartCell(null);
      setHoverCell(null);

      if (!cells) return;

      const selectedLetters = cells.map(([r, c]) => grid[r][c]).join("");
      const reversedLetters = [...selectedLetters].reverse().join("");

      // Check if the selection matches any unfound word
      let matchedWord: string | null = null;

      for (const word of words) {
        if (foundWords.has(word)) continue;

        // Check position-based matching
        const pos = wordPositions[word];
        if (pos) {
          const [sr, sc, er, ec] = pos;
          const fwd =
            startCell[0] === sr &&
            startCell[1] === sc &&
            endCell[0] === er &&
            endCell[1] === ec;
          const bwd =
            startCell[0] === er &&
            startCell[1] === ec &&
            endCell[0] === sr &&
            endCell[1] === sc;
          if (fwd || bwd) {
            matchedWord = word;
            break;
          }
        }

        // Fallback: check by letters
        if (selectedLetters === word || reversedLetters === word) {
          matchedWord = word;
          break;
        }
      }

      if (matchedWord) {
        const newFound = new Set(foundWords);
        newFound.add(matchedWord);
        setFoundWords(newFound);

        const newCells = new Set(foundCells);
        for (const [r, c] of cells) {
          newCells.add(`${r},${c}`);
        }
        setFoundCells(newCells);

        if (newFound.size === words.length) {
          solvedRef.current = true;
          setFeedback("Alle Wörter gefunden!");
          setFeedbackSuccess(true);
          setTimeout(() => onSolved(), 1200);
        } else {
          setFeedback(`"${matchedWord}" gefunden!`);
          setFeedbackSuccess(true);
        }
      }
    },
    [startCell, getCellsInLine, grid, words, foundWords, wordPositions, foundCells, onSolved]
  );

  const handleMouseLeave = useCallback(() => {
    setStartCell(null);
    setHoverCell(null);
  }, []);

  const getCellClass = (row: number, col: number): string => {
    const key = `${row},${col}`;
    const isFound = foundCells.has(key);
    const isSelected = selectedCells.has(key);
    const isStart = startCell && startCell[0] === row && startCell[1] === col;

    const classes = [styles.cell];
    if (isFound) classes.push(styles.cellFound);
    if (isStart) classes.push(styles.cellStart);
    else if (isSelected) classes.push(styles.cellSelected);
    return classes.join(" ");
  };

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>
      <p className={styles.instructions}>
        Klicke auf den Startbuchstaben und ziehe zum Endbuchstaben.
      </p>

      <div className={styles.layout}>
        <div
          className={styles.gridWrapper}
          onMouseLeave={handleMouseLeave}
        >
          <table className={styles.gridTable}>
            <tbody>
              {Array.from({ length: gridSize }, (_, row) => (
                <tr key={row}>
                  {Array.from({ length: gridSize }, (_, col) => (
                    <td
                      key={col}
                      className={getCellClass(row, col)}
                      onMouseDown={() => handleCellMouseDown(row, col)}
                      onMouseEnter={() => handleCellMouseEnter(row, col)}
                      onMouseUp={() => handleCellMouseUp(row, col)}
                    >
                      {grid[row][col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.wordListSection}>
          <h4 className={styles.wordListTitle}>Wörter</h4>
          <ul className={styles.wordList}>
            {words.map((word) => (
              <li
                key={word}
                className={`${styles.wordItem} ${foundWords.has(word) ? styles.wordItemFound : ""}`}
              >
                {word}
              </li>
            ))}
          </ul>
          <p className={styles.progress} style={{ marginTop: "0.75rem" }}>
            {foundWords.size} / {words.length}
          </p>
        </div>
      </div>

      <p
        className={`${styles.feedback} ${feedbackSuccess ? styles.feedbackSuccess : ""}`}
      >
        {feedback}
      </p>
    </div>
  );
}
