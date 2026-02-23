import { useState, useEffect, useRef, useCallback } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./Maze.module.css";

interface MazeData {
  grid: number[][];
  start: [number, number];
  end: [number, number];
}

const CELL_SIZE = 28;
const FOG_RADIUS = 3.5;

export default function Maze({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as MazeData;
  const grid = data.grid;
  const rows = grid.length;
  const cols = grid[0].length;
  const canvasWidth = cols * CELL_SIZE;
  const canvasHeight = rows * CELL_SIZE;

  const [playerPos, setPlayerPos] = useState<[number, number]>([
    data.start[0],
    data.start[1],
  ]);
  const [solved, setSolved] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const solvedRef = useRef(false);
  const playerRef = useRef(playerPos);
  playerRef.current = playerPos;

  const tryMove = useCallback(
    (dr: number, dc: number) => {
      if (solvedRef.current) return;
      const [r, c] = playerRef.current;
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;
      if (grid[nr][nc] === 1) return;
      setPlayerPos([nr, nc]);

      if (nr === data.end[0] && nc === data.end[1]) {
        solvedRef.current = true;
        setSolved(true);
        setTimeout(() => onSolved(), 1000);
      }
    },
    [grid, rows, cols, data.end, onSolved]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          e.preventDefault();
          tryMove(-1, 0);
          break;
        case "ArrowDown":
        case "s":
          e.preventDefault();
          tryMove(1, 0);
          break;
        case "ArrowLeft":
        case "a":
          e.preventDefault();
          tryMove(0, -1);
          break;
        case "ArrowRight":
        case "d":
          e.preventDefault();
          tryMove(0, 1);
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tryMove]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const [pr, pc] = playerPos;
    const px = (pc + 0.5) * CELL_SIZE;
    const py = (pr + 0.5) * CELL_SIZE;

    // Clear
    ctx.fillStyle = "#0a0e27";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw walls
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;
        if (grid[r][c] === 1) {
          ctx.fillStyle = "#1a0533";
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
          ctx.strokeStyle = "rgba(100, 60, 150, 0.3)";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x + 0.5, y + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
        } else {
          ctx.fillStyle = "#0d1230";
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // Draw goal star
    const gx = (data.end[1] + 0.5) * CELL_SIZE;
    const gy = (data.end[0] + 0.5) * CELL_SIZE;
    const starGlow = ctx.createRadialGradient(gx, gy, 2, gx, gy, CELL_SIZE * 0.7);
    starGlow.addColorStop(0, "rgba(255, 215, 0, 0.8)");
    starGlow.addColorStop(1, "rgba(255, 215, 0, 0)");
    ctx.fillStyle = starGlow;
    ctx.fillRect(gx - CELL_SIZE, gy - CELL_SIZE, CELL_SIZE * 2, CELL_SIZE * 2);

    // Star shape
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const sx = gx + Math.cos(angle) * 7;
      const sy = gy + Math.sin(angle) * 7;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fill();

    // Draw player orb
    const orbGlow = ctx.createRadialGradient(px, py, 2, px, py, CELL_SIZE * 0.6);
    orbGlow.addColorStop(0, "rgba(0, 212, 255, 0.9)");
    orbGlow.addColorStop(0.5, "rgba(0, 212, 255, 0.3)");
    orbGlow.addColorStop(1, "rgba(0, 212, 255, 0)");
    ctx.fillStyle = orbGlow;
    ctx.fillRect(px - CELL_SIZE, py - CELL_SIZE, CELL_SIZE * 2, CELL_SIZE * 2);

    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#00d4ff";
    ctx.fill();

    // Fog of war overlay
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    const fogGrad = ctx.createRadialGradient(
      px,
      py,
      CELL_SIZE * 1,
      px,
      py,
      CELL_SIZE * FOG_RADIUS
    );
    fogGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
    fogGrad.addColorStop(0.7, "rgba(0, 0, 0, 0.8)");
    fogGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
  }, [playerPos, grid, rows, cols, canvasWidth, canvasHeight, data.end]);

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.canvasWrapper}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={canvasWidth}
          height={canvasHeight}
          style={{ width: canvasWidth, height: canvasHeight }}
        />
      </div>

      <div className={styles.dpad}>
        <button
          className={`${styles.dpadButton} ${styles.dpadUp}`}
          onClick={() => tryMove(-1, 0)}
          aria-label="Hoch"
        >
          &#x25B2;
        </button>
        <button
          className={`${styles.dpadButton} ${styles.dpadLeft}`}
          onClick={() => tryMove(0, -1)}
          aria-label="Links"
        >
          &#x25C0;
        </button>
        <button
          className={`${styles.dpadButton} ${styles.dpadRight}`}
          onClick={() => tryMove(0, 1)}
          aria-label="Rechts"
        >
          &#x25B6;
        </button>
        <button
          className={`${styles.dpadButton} ${styles.dpadDown}`}
          onClick={() => tryMove(1, 0)}
          aria-label="Runter"
        >
          &#x25BC;
        </button>
      </div>

      <p className={`${styles.status} ${solved ? styles.successText : ""}`}>
        {solved
          ? "Ziel erreicht! Der Weg ist frei!"
          : "Navigiere zum goldenen Stern"}
      </p>
    </div>
  );
}
