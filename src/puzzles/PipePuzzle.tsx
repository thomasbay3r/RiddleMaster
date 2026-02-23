import { useState, useCallback, useMemo, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./PipePuzzle.module.css";

interface PipeDef {
  type: "straight" | "corner" | "tee" | "cross" | "empty";
  correct: number;
  initial: number;
}

interface PipeData {
  gridSize: number;
  source: [number, number];
  target: [number, number];
  pipes: PipeDef[][];
}

// Each pipe type has openings at base rotation (0 degrees)
// Directions: 0=up, 1=right, 2=down, 3=left
function getBaseOpenings(type: PipeDef["type"]): number[] {
  switch (type) {
    case "straight":
      return [0, 2]; // up-down
    case "corner":
      return [0, 1]; // up-right
    case "tee":
      return [0, 1, 2]; // up-right-down (T pointing left is closed)
    case "cross":
      return [0, 1, 2, 3]; // all directions
    case "empty":
      return [];
  }
}

function getOpenings(type: PipeDef["type"], rotation: number): Set<number> {
  const base = getBaseOpenings(type);
  const steps = ((rotation % 360) + 360) % 360 / 90;
  return new Set(base.map((d) => (d + steps) % 4));
}

const OPPOSITE: Record<number, number> = { 0: 2, 1: 3, 2: 0, 3: 1 };
const DELTA: Record<number, [number, number]> = {
  0: [-1, 0], // up
  1: [0, 1],  // right
  2: [1, 0],  // down
  3: [0, -1], // left
};

function findConnected(
  pipes: PipeDef[][],
  rotations: number[][],
  gridSize: number,
  source: [number, number]
): Set<string> {
  const connected = new Set<string>();
  const queue: [number, number][] = [source];
  connected.add(`${source[0]},${source[1]}`);

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const pipe = pipes[r][c];
    const openings = getOpenings(pipe.type, rotations[r][c]);

    for (const dir of openings) {
      const [dr, dc] = DELTA[dir];
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) continue;

      const key = `${nr},${nc}`;
      if (connected.has(key)) continue;

      const neighborPipe = pipes[nr][nc];
      if (neighborPipe.type === "empty") continue;

      const neighborOpenings = getOpenings(neighborPipe.type, rotations[nr][nc]);
      if (neighborOpenings.has(OPPOSITE[dir])) {
        connected.add(key);
        queue.push([nr, nc]);
      }
    }
  }

  return connected;
}

// Pipe visual rendering: segments are CSS positioned elements
function renderPipeSegments(
  type: PipeDef["type"],
  rotation: number,
  isGlowing: boolean,
  isSolved: boolean
) {
  if (type === "empty") return null;

  const openings = getOpenings(type, rotation);
  const segmentClass = isSolved
    ? `${styles.pipeSegment} ${styles.pipeSegmentGold}`
    : isGlowing
    ? `${styles.pipeSegment} ${styles.pipeSegmentGlow}`
    : styles.pipeSegment;
  const centerClass = isSolved
    ? `${styles.pipeCenter} ${styles.pipeCenterGold}`
    : isGlowing
    ? `${styles.pipeCenter} ${styles.pipeCenterGlow}`
    : styles.pipeCenter;

  const PIPE_W = 6; // pipe width in px
  const CELL = 64;
  const HALF = CELL / 2;

  const segs: React.ReactNode[] = [];

  // Center dot
  segs.push(
    <div key="center" className={centerClass} />
  );

  // Up segment
  if (openings.has(0)) {
    segs.push(
      <div
        key="up"
        className={segmentClass}
        style={{
          width: `${PIPE_W}px`,
          height: `${HALF}px`,
          top: 0,
          left: `${HALF - PIPE_W / 2}px`,
        }}
      />
    );
  }

  // Right segment
  if (openings.has(1)) {
    segs.push(
      <div
        key="right"
        className={segmentClass}
        style={{
          width: `${HALF}px`,
          height: `${PIPE_W}px`,
          top: `${HALF - PIPE_W / 2}px`,
          right: 0,
        }}
      />
    );
  }

  // Down segment
  if (openings.has(2)) {
    segs.push(
      <div
        key="down"
        className={segmentClass}
        style={{
          width: `${PIPE_W}px`,
          height: `${HALF}px`,
          bottom: 0,
          left: `${HALF - PIPE_W / 2}px`,
        }}
      />
    );
  }

  // Left segment
  if (openings.has(3)) {
    segs.push(
      <div
        key="left"
        className={segmentClass}
        style={{
          width: `${HALF}px`,
          height: `${PIPE_W}px`,
          top: `${HALF - PIPE_W / 2}px`,
          left: 0,
        }}
      />
    );
  }

  return <>{segs}</>;
}

export default function PipePuzzle({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as PipeData;
  const { gridSize, source, target, pipes } = data;

  const [rotations, setRotations] = useState<number[][]>(() =>
    pipes.map((row) => row.map((p) => p.initial))
  );
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const solvedRef = useRef(false);

  const connectedSet = useMemo(
    () => findConnected(pipes, rotations, gridSize, source),
    [pipes, rotations, gridSize, source]
  );

  const isFullyConnected = connectedSet.has(`${target[0]},${target[1]}`);

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (solvedRef.current) return;
      if (pipes[r][c].type === "empty") return;
      // Cross pieces look the same at any rotation, but we still let player rotate
      setFeedback("");
      setFeedbackSuccess(false);

      setRotations((prev) => {
        const next = prev.map((row) => [...row]);
        next[r][c] = (next[r][c] + 90) % 360;

        // Check if all pipes are at correct rotation after this click
        const allCorrect = pipes.every((row, ri) =>
          row.every((p, ci) => {
            if (p.type === "empty") return true;
            return next[ri][ci] === p.correct;
          })
        );

        if (allCorrect && !solvedRef.current) {
          solvedRef.current = true;
          // Use setTimeout so state updates first
          setTimeout(() => {
            setSolved(true);
            setFeedback("Das Sternenlicht fließt! Die Verbindung steht!");
            setFeedbackSuccess(true);
            setTimeout(() => onSolved(), 1200);
          }, 350);
        }

        return next;
      });
    },
    [pipes, onSolved]
  );

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>
      <p className={styles.legend}>
        Klicke auf ein Rohr, um es um 90° zu drehen.
      </p>

      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 64px)`,
          gridTemplateRows: `repeat(${gridSize}, 64px)`,
        }}
      >
        {pipes.map((row, r) =>
          row.map((pipe, c) => {
            const isSource = r === source[0] && c === source[1];
            const isTarget = r === target[0] && c === target[1];
            const key = `${r},${c}`;
            const isConnected = connectedSet.has(key);

            let cellClass = styles.cell;
            if (pipe.type === "empty") {
              cellClass += ` ${styles.cellEmpty}`;
            } else if (isSource) {
              cellClass += ` ${styles.cellSource}`;
            } else if (isTarget) {
              cellClass += ` ${styles.cellTarget}`;
            } else if (isConnected && (isFullyConnected || solved)) {
              cellClass += ` ${styles.cellConnected}`;
            }

            return (
              <div
                key={key}
                className={cellClass}
                onClick={() => handleCellClick(r, c)}
              >
                {renderPipeSegments(
                  pipe.type,
                  rotations[r][c],
                  isConnected,
                  solved
                )}
                {isSource && <span className={styles.sourceIcon}>☀</span>}
                {isTarget && <span className={styles.targetIcon}>⭐</span>}
              </div>
            );
          })
        )}
      </div>

      <p className={`${styles.feedback} ${feedbackSuccess ? styles.feedbackSuccess : ""}`}>
        {feedback}
      </p>
    </div>
  );
}
