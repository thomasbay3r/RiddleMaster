import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./Crossword.module.css";

interface ClueEntry {
  number: number;
  row: number;
  col: number;
  length: number;
  text: string;
  answer: string;
}

interface CrosswordData {
  grid: string[][];
  emptyGrid: string[][];
  clues: {
    across: ClueEntry[];
    down: ClueEntry[];
  };
}

type Direction = "across" | "down";

interface CellPos {
  row: number;
  col: number;
}

export default function Crossword({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as CrosswordData;
  const { grid: solutionGrid, emptyGrid, clues } = data;
  const rows = solutionGrid.length;
  const cols = solutionGrid[0].length;

  // Build player grid from emptyGrid
  const [playerGrid, setPlayerGrid] = useState<string[][]>(() =>
    emptyGrid.map((row) => row.map((c) => (c === "." ? "." : "")))
  );

  const [selectedCell, setSelectedCell] = useState<CellPos | null>(null);
  const [activeDirection, setActiveDirection] = useState<Direction>("across");
  const [solved, setSolved] = useState(false);
  const solvedRef = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Build a map of cell -> clue number
  const cellNumbers = useMemo(() => {
    const nums: Record<string, number> = {};
    for (const clue of [...clues.across, ...clues.down]) {
      const key = `${clue.row}-${clue.col}`;
      if (!(key in nums)) {
        nums[key] = clue.number;
      }
    }
    return nums;
  }, [clues]);

  // Find the active clue based on selected cell and direction
  const activeClue = useMemo(() => {
    if (!selectedCell) return null;
    const { row, col } = selectedCell;

    const findClue = (dir: Direction): ClueEntry | undefined => {
      const clueList = dir === "across" ? clues.across : clues.down;
      return clueList.find((c) => {
        if (dir === "across") {
          return c.row === row && col >= c.col && col < c.col + c.length;
        } else {
          return c.col === col && row >= c.row && row < c.row + c.length;
        }
      });
    };

    // Try the active direction first, then fall back
    return findClue(activeDirection) || findClue(activeDirection === "across" ? "down" : "across") || null;
  }, [selectedCell, activeDirection, clues]);

  // Get cells belonging to the active clue for highlighting
  const highlightedCells = useMemo(() => {
    if (!activeClue) return new Set<string>();
    const cells = new Set<string>();
    const dir = clues.across.includes(activeClue) ? "across" : "down";
    for (let i = 0; i < activeClue.length; i++) {
      const r = dir === "across" ? activeClue.row : activeClue.row + i;
      const c = dir === "across" ? activeClue.col + i : activeClue.col;
      cells.add(`${r}-${c}`);
    }
    return cells;
  }, [activeClue, clues.across]);

  // Check if the puzzle is fully solved
  const checkSolved = useCallback(
    (grid: string[][]) => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (emptyGrid[r][c] !== ".") {
            if (grid[r][c].toUpperCase() !== solutionGrid[r][c].toUpperCase()) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [rows, cols, emptyGrid, solutionGrid]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (emptyGrid[row][col] === ".") return;
      if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
        // Toggle direction
        setActiveDirection((d) => (d === "across" ? "down" : "across"));
      } else {
        setSelectedCell({ row, col });
      }
    },
    [emptyGrid, selectedCell]
  );

  const moveToNextCell = useCallback(
    (row: number, col: number, dir: Direction): CellPos | null => {
      let r = row;
      let c = col;
      if (dir === "across") {
        c += 1;
        while (c < cols && emptyGrid[r][c] === ".") c++;
        if (c < cols && emptyGrid[r][c] !== ".") return { row: r, col: c };
      } else {
        r += 1;
        while (r < rows && emptyGrid[r][c] === ".") r++;
        if (r < rows && emptyGrid[r][c] !== ".") return { row: r, col: c };
      }
      return null;
    },
    [cols, rows, emptyGrid]
  );

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell || solvedRef.current) return;
      const { row, col } = selectedCell;

      if (e.key === "Tab") {
        e.preventDefault();
        setActiveDirection((d) => (d === "across" ? "down" : "across"));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        for (let r = row - 1; r >= 0; r--) {
          if (emptyGrid[r][col] !== ".") {
            setSelectedCell({ row: r, col });
            setActiveDirection("down");
            return;
          }
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        for (let r = row + 1; r < rows; r++) {
          if (emptyGrid[r][col] !== ".") {
            setSelectedCell({ row: r, col });
            setActiveDirection("down");
            return;
          }
        }
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        for (let c = col - 1; c >= 0; c--) {
          if (emptyGrid[row][c] !== ".") {
            setSelectedCell({ row, col: c });
            setActiveDirection("across");
            return;
          }
        }
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        for (let c = col + 1; c < cols; c++) {
          if (emptyGrid[row][c] !== ".") {
            setSelectedCell({ row, col: c });
            setActiveDirection("across");
            return;
          }
        }
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        if (playerGrid[row][col] !== "") {
          setPlayerGrid((prev) => {
            const next = prev.map((r) => [...r]);
            next[row][col] = "";
            return next;
          });
        }
        return;
      }

      if (/^[a-zA-ZäöüÄÖÜß]$/.test(e.key)) {
        e.preventDefault();
        const letter = e.key.toUpperCase();
        setPlayerGrid((prev) => {
          const next = prev.map((r) => [...r]);
          next[row][col] = letter;
          if (checkSolved(next)) {
            setSolved(true);
            solvedRef.current = true;
            setTimeout(() => onSolved(), 1200);
          }
          return next;
        });

        // Move to next cell
        const next = moveToNextCell(row, col, activeDirection);
        if (next) {
          setSelectedCell(next);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, playerGrid, activeDirection, emptyGrid, rows, cols, checkSolved, moveToNextCell, onSolved]);

  const handleClueClick = useCallback(
    (clue: ClueEntry, dir: Direction) => {
      setSelectedCell({ row: clue.row, col: clue.col });
      setActiveDirection(dir);
    },
    []
  );

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.gridWrapper}>
        <div
          ref={gridRef}
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${cols}, 42px)`,
            gridTemplateRows: `repeat(${rows}, 42px)`,
          }}
        >
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: cols }, (_, c) => {
              const isBlack = emptyGrid[r][c] === ".";
              const isSelected = selectedCell?.row === r && selectedCell?.col === c;
              const isHighlighted = highlightedCells.has(`${r}-${c}`);
              const number = cellNumbers[`${r}-${c}`];
              const letter = playerGrid[r][c];
              const isCorrect = solved && !isBlack;

              let cellClass = styles.cell;
              if (isBlack) {
                cellClass += ` ${styles.cellBlack}`;
              } else {
                cellClass += ` ${styles.cellInput}`;
                if (isSelected) cellClass += ` ${styles.cellSelected}`;
                else if (isHighlighted) cellClass += ` ${styles.cellHighlighted}`;
                if (isCorrect) cellClass += ` ${styles.cellCorrect}`;
              }

              return (
                <div
                  key={`${r}-${c}`}
                  className={cellClass}
                  onClick={() => handleCellClick(r, c)}
                >
                  {number !== undefined && (
                    <span className={styles.cellNumber}>{number}</span>
                  )}
                  {!isBlack && letter && (
                    <span className={styles.cellLetter}>{letter}</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className={styles.cluesPanel}>
          <div className={styles.clueSection}>
            <h4 className={styles.clueSectionTitle}>Waagerecht</h4>
            {clues.across.map((clue) => {
              const isActive = activeClue === clue;
              const isSolved = checkClue(clue, "across", playerGrid, solutionGrid);
              return (
                <button
                  key={`a-${clue.number}`}
                  className={`${styles.clueItem} ${isActive ? styles.clueItemActive : ""} ${
                    isSolved ? styles.clueItemSolved : ""
                  }`}
                  onClick={() => handleClueClick(clue, "across")}
                >
                  <strong>{clue.number}.</strong> {clue.text}
                </button>
              );
            })}
          </div>

          <div className={styles.clueSection}>
            <h4 className={styles.clueSectionTitle}>Senkrecht</h4>
            {clues.down.map((clue) => {
              const isActive = activeClue === clue;
              const isSolved = checkClue(clue, "down", playerGrid, solutionGrid);
              return (
                <button
                  key={`d-${clue.number}`}
                  className={`${styles.clueItem} ${isActive ? styles.clueItemActive : ""} ${
                    isSolved ? styles.clueItemSolved : ""
                  }`}
                  onClick={() => handleClueClick(clue, "down")}
                >
                  <strong>{clue.number}.</strong> {clue.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className={`${styles.status} ${solved ? styles.statusSuccess : ""}`}>
        {solved
          ? "Alle Wörter richtig! Hervorragend!"
          : "Klicke auf ein Feld und tippe einen Buchstaben."}
      </p>
    </div>
  );
}

function checkClue(
  clue: ClueEntry,
  dir: Direction,
  playerGrid: string[][],
  solutionGrid: string[][]
): boolean {
  for (let i = 0; i < clue.length; i++) {
    const r = dir === "across" ? clue.row : clue.row + i;
    const c = dir === "across" ? clue.col + i : clue.col;
    if (playerGrid[r][c].toUpperCase() !== solutionGrid[r][c].toUpperCase()) {
      return false;
    }
  }
  return true;
}
