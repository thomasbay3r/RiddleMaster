import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./JigsawPuzzle.module.css";

interface PieceDef {
  id: number;
  symbol: string;
  gradient: string;
}

interface JigsawData {
  gridSize: number;
  pieces: PieceDef[];
  initialShuffle: number[];
}

export default function JigsawPuzzle({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as JigsawData;
  const { gridSize, pieces, initialShuffle } = data;

  // Grid: each cell holds a piece id or null
  const [grid, setGrid] = useState<(number | null)[]>(() =>
    Array(gridSize * gridSize).fill(null) as (number | null)[]
  );
  // Tray: pieces not yet placed, using initial shuffle order
  const [tray, setTray] = useState<number[]>(() => [...initialShuffle]);
  const [selectedSource, setSelectedSource] = useState<
    { from: "tray"; index: number } | { from: "grid"; index: number } | null
  >(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const solvedRef = useRef(false);

  const pieceMap = new Map(pieces.map((p) => [p.id, p]));

  const checkSolved = useCallback(
    (nextGrid: (number | null)[]) => {
      // All cells must be filled and each cell i must contain piece id i
      for (let i = 0; i < gridSize * gridSize; i++) {
        if (nextGrid[i] !== i) return false;
      }
      return true;
    },
    [gridSize]
  );

  const handleTrayClick = useCallback(
    (trayIdx: number) => {
      if (solvedRef.current) return;
      setFeedback("");
      setFeedbackSuccess(false);

      if (selectedSource && selectedSource.from === "tray" && selectedSource.index === trayIdx) {
        // Deselect
        setSelectedSource(null);
        return;
      }

      if (selectedSource && selectedSource.from === "grid") {
        // Move piece from grid back to tray — swap with tray piece
        const gridIdx = selectedSource.index;
        const gridPieceId = grid[gridIdx];
        const trayPieceId = tray[trayIdx];

        const nextGrid = [...grid];
        nextGrid[gridIdx] = trayPieceId;

        const nextTray = [...tray];
        nextTray[trayIdx] = gridPieceId!;

        setGrid(nextGrid);
        setTray(nextTray);
        setSelectedSource(null);

        if (nextTray.length === 0 && checkSolved(nextGrid)) {
          solvedRef.current = true;
          setFeedback("Wunderbar! Das Bild ist komplett!");
          setFeedbackSuccess(true);
          setTimeout(() => onSolved(), 1200);
        }
        return;
      }

      // Select this tray piece
      setSelectedSource({ from: "tray", index: trayIdx });
    },
    [selectedSource, grid, tray, checkSolved, onSolved]
  );

  const handleGridClick = useCallback(
    (gridIdx: number) => {
      if (solvedRef.current) return;
      setFeedback("");
      setFeedbackSuccess(false);

      if (!selectedSource) {
        // Select from grid if it has a piece
        if (grid[gridIdx] !== null) {
          setSelectedSource({ from: "grid", index: gridIdx });
        }
        return;
      }

      if (selectedSource.from === "grid" && selectedSource.index === gridIdx) {
        // Deselect
        setSelectedSource(null);
        return;
      }

      if (selectedSource.from === "tray") {
        const trayIdx = selectedSource.index;
        const pieceId = tray[trayIdx];

        if (grid[gridIdx] === null) {
          // Place piece from tray into empty grid cell
          const nextGrid = [...grid];
          nextGrid[gridIdx] = pieceId;

          const nextTray = tray.filter((_, i) => i !== trayIdx);

          setGrid(nextGrid);
          setTray(nextTray);
          setSelectedSource(null);

          if (nextTray.length === 0 && checkSolved(nextGrid)) {
            solvedRef.current = true;
            setFeedback("Wunderbar! Das Bild ist komplett!");
            setFeedbackSuccess(true);
            setTimeout(() => onSolved(), 1200);
          }
        } else {
          // Swap tray piece with grid piece
          const existingPieceId = grid[gridIdx]!;
          const nextGrid = [...grid];
          nextGrid[gridIdx] = pieceId;

          const nextTray = [...tray];
          nextTray[trayIdx] = existingPieceId;

          setGrid(nextGrid);
          setTray(nextTray);
          setSelectedSource(null);

          if (nextTray.length === 0 && checkSolved(nextGrid)) {
            solvedRef.current = true;
            setFeedback("Wunderbar! Das Bild ist komplett!");
            setFeedbackSuccess(true);
            setTimeout(() => onSolved(), 1200);
          }
        }
        return;
      }

      if (selectedSource.from === "grid") {
        const fromIdx = selectedSource.index;

        if (grid[gridIdx] === null) {
          // Move piece from one grid cell to an empty one
          const nextGrid = [...grid];
          nextGrid[gridIdx] = grid[fromIdx];
          nextGrid[fromIdx] = null;

          setGrid(nextGrid);
          setSelectedSource(null);

          if (tray.length === 0 && checkSolved(nextGrid)) {
            solvedRef.current = true;
            setFeedback("Wunderbar! Das Bild ist komplett!");
            setFeedbackSuccess(true);
            setTimeout(() => onSolved(), 1200);
          }
        } else {
          // Swap two grid pieces
          const nextGrid = [...grid];
          const temp = nextGrid[gridIdx];
          nextGrid[gridIdx] = nextGrid[fromIdx];
          nextGrid[fromIdx] = temp;

          setGrid(nextGrid);
          setSelectedSource(null);

          if (tray.length === 0 && checkSolved(nextGrid)) {
            solvedRef.current = true;
            setFeedback("Wunderbar! Das Bild ist komplett!");
            setFeedbackSuccess(true);
            setTimeout(() => onSolved(), 1200);
          }
        }
      }
    },
    [selectedSource, grid, tray, checkSolved, onSolved]
  );

  const renderPiece = (
    pieceId: number,
    isSelected: boolean,
    extraClass?: string
  ) => {
    const piece = pieceMap.get(pieceId);
    if (!piece) return null;
    return (
      <div
        className={`${extraClass ?? styles.piece} ${isSelected ? styles.pieceSelected : ""}`}
        style={{ background: piece.gradient }}
      >
        {piece.symbol}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>
      <p className={styles.legend}>
        Klicke ein Teil an und dann auf die Zielposition, um es zu platzieren.
      </p>

      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 80px)`,
          gridTemplateRows: `repeat(${gridSize}, 80px)`,
        }}
      >
        {grid.map((pieceId, idx) => {
          const isCorrect = pieceId !== null && pieceId === idx;
          const isWrong = pieceId !== null && pieceId !== idx;
          const isSelected =
            selectedSource?.from === "grid" && selectedSource.index === idx;

          let cellClass = styles.gridCell;
          if (solvedRef.current && isCorrect) {
            cellClass += ` ${styles.gridCellCorrect}`;
          } else if (!solvedRef.current && isCorrect) {
            cellClass += ` ${styles.gridCellCorrect}`;
          } else if (isWrong && !solvedRef.current) {
            cellClass += ` ${styles.gridCellWrong}`;
          }

          return (
            <div
              key={idx}
              className={cellClass}
              onClick={() => handleGridClick(idx)}
            >
              {pieceId !== null && renderPiece(pieceId, isSelected)}
            </div>
          );
        })}
      </div>

      {tray.length > 0 && (
        <>
          <span className={styles.trayLabel}>Puzzleteile</span>
          <div className={styles.tray}>
            {tray.map((pieceId, idx) => {
              const isSelected =
                selectedSource?.from === "tray" && selectedSource.index === idx;
              return (
                <div
                  key={pieceId}
                  onClick={() => handleTrayClick(idx)}
                >
                  {renderPiece(pieceId, isSelected, styles.trayPiece)}
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className={`${styles.feedback} ${feedbackSuccess ? styles.feedbackSuccess : ""}`}>
        {feedback}
      </p>
    </div>
  );
}
