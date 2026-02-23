import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./SlidePuzzle.module.css";

interface SlidePuzzleData {
  size: number;
  initial: number[];
}

/** Count inversions (ignoring the empty tile 0) */
function countInversions(tiles: number[]): number {
  let inversions = 0;
  const nums = tiles.filter((t) => t !== 0);
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) inversions++;
    }
  }
  return inversions;
}

/** For a 4x4 puzzle, solvability depends on inversions + blank row from bottom */
function isSolvable(tiles: number[], size: number): boolean {
  const inversions = countInversions(tiles);
  const blankIndex = tiles.indexOf(0);
  const blankRowFromBottom = size - Math.floor(blankIndex / size);

  if (size % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    // Even size: solvable if (inversions even AND blank on odd row from bottom)
    // or (inversions odd AND blank on even row from bottom)
    return (inversions + blankRowFromBottom) % 2 === 0;
  }
}

/** Generate a solvable shuffle */
function generateSolvableShuffle(size: number): number[] {
  const total = size * size;
  const tiles = Array.from({ length: total }, (_, i) => i); // 0..15
  // Fisher-Yates shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  if (!isSolvable(tiles, size)) {
    // Swap two non-zero tiles to fix parity
    const nonZero = tiles.filter((t) => t !== 0);
    const idx1 = tiles.indexOf(nonZero[0]);
    const idx2 = tiles.indexOf(nonZero[1]);
    [tiles[idx1], tiles[idx2]] = [tiles[idx2], tiles[idx1]];
  }

  return tiles;
}

function isGoalState(tiles: number[]): boolean {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[tiles.length - 1] === 0;
}

export default function SlidePuzzle({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as SlidePuzzleData;
  const size = data.size;

  const [tiles, setTiles] = useState<number[]>(() => {
    // Use provided initial state if solvable, otherwise generate a new one
    if (data.initial && data.initial.length === size * size && isSolvable(data.initial, size)) {
      return [...data.initial];
    }
    return generateSolvableShuffle(size);
  });

  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const solvedRef = useRef(false);

  const handleTileClick = useCallback(
    (index: number) => {
      if (solvedRef.current) return;

      const emptyIndex = tiles.indexOf(0);
      const row = Math.floor(index / size);
      const col = index % size;
      const emptyRow = Math.floor(emptyIndex / size);
      const emptyCol = emptyIndex % size;

      // Check adjacency
      const isAdjacent =
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow);

      if (!isAdjacent) return;

      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];

      setTiles(newTiles);
      setMoves((m) => m + 1);

      if (isGoalState(newTiles)) {
        solvedRef.current = true;
        setSolved(true);
        setTimeout(() => onSolved(), 800);
      }
    },
    [tiles, size, onSolved]
  );

  const handleReshuffle = useCallback(() => {
    if (solvedRef.current) return;
    setTiles(generateSolvableShuffle(size));
    setMoves(0);
  }, [size]);

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.grid}>
        {tiles.map((tile, index) => {
          const isEmpty = tile === 0;
          const isCorrect = !isEmpty && tile === index + 1;

          let tileClass = styles.tile;
          if (isEmpty) tileClass += ` ${styles.tileEmpty}`;
          else if (isCorrect) tileClass += ` ${styles.tileCorrect}`;

          return (
            <button
              key={index}
              className={tileClass}
              onClick={() => handleTileClick(index)}
              aria-label={isEmpty ? "Leeres Feld" : `Kachel ${tile}`}
            >
              {isEmpty ? "" : tile}
            </button>
          );
        })}
      </div>

      <div className={styles.controls}>
        <p className={styles.moveCounter}>Z&uuml;ge: {moves}</p>
        {!solved && (
          <button className={styles.shuffleButton} onClick={handleReshuffle}>
            Neu mischen
          </button>
        )}
        {solved && <p className={styles.status}>Gel&ouml;st! Fantastisch!</p>}
      </div>
    </div>
  );
}
