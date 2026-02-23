import { useState, useCallback, useRef, useEffect } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./SpotDifference.module.css";

interface DifferenceDef {
  x: number;
  y: number;
  radius: number;
  description: string;
}

interface StarDef {
  x: number;
  y: number;
  size: number;
  color: string;
}

interface SpotDifferenceData {
  canvasWidth: number;
  canvasHeight: number;
  differences: DifferenceDef[];
  stars: StarDef[];
}

/** Draw a 4-point star shape */
function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 3;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const outerX = x + Math.cos(angle) * size * 2;
    const outerY = y + Math.sin(angle) * size * 2;
    const innerAngle = angle + Math.PI / 4;
    const innerX = x + Math.cos(innerAngle) * size * 0.8;
    const innerY = y + Math.sin(innerAngle) * size * 0.8;
    if (i === 0) ctx.moveTo(outerX, outerY);
    else ctx.lineTo(outerX, outerY);
    ctx.lineTo(innerX, innerY);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Draw a crescent moon */
function drawMoon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  // Cut out inner circle to form crescent
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x + radius * 0.4, y - radius * 0.15, radius * 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Draw a line between two points */
function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.shadowColor = color;
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/** Draw the base scene (left canvas - "original") */
function drawLeftScene(ctx: CanvasRenderingContext2D, w: number, h: number, stars: StarDef[]) {
  // Background
  ctx.fillStyle = "#060818";
  ctx.fillRect(0, 0, w, h);

  // Subtle nebula gradient
  const grad = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.5);
  grad.addColorStop(0, "rgba(26, 5, 51, 0.3)");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Draw all stars
  for (const star of stars) {
    drawStar(ctx, star.x, star.y, star.size, star.color);
  }

  // Draw moon at (150, 220) with radius 18
  drawMoon(ctx, 150, 220, 18, "#ffffcc");

  // Draw constellation lines
  // Line from star(150,40) to star(200,100)
  drawLine(ctx, 150, 40, 200, 100, "rgba(192, 192, 224, 0.25)", 1);
  // Line from star(200,100) to star(250,160)
  drawLine(ctx, 200, 100, 250, 160, "rgba(192, 192, 224, 0.25)", 1);
  // Line from star(280,50) to star(350,120)
  drawLine(ctx, 280, 50, 350, 120, "rgba(192, 192, 224, 0.25)", 1);
  // Line from star(100,180) to star(150,220)
  drawLine(ctx, 100, 180, 150, 220, "rgba(192, 192, 224, 0.25)", 1);
  // Line from star(250,160) to star(350,220) — difference 5 target
  drawLine(ctx, 250, 160, 350, 220, "rgba(192, 192, 224, 0.25)", 1);

  // Tiny background dots for atmosphere
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  const seed = [23, 67, 112, 189, 245, 310, 56, 134, 278, 355, 42, 198, 88, 267, 330];
  const seedY = [15, 95, 145, 35, 255, 175, 195, 270, 125, 65, 240, 210, 160, 85, 230];
  for (let i = 0; i < seed.length; i++) {
    ctx.beginPath();
    ctx.arc(seed[i], seedY[i], 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Draw the modified scene (right canvas - with 5 differences) */
function drawRightScene(ctx: CanvasRenderingContext2D, w: number, h: number, stars: StarDef[]) {
  // Background (same)
  ctx.fillStyle = "#060818";
  ctx.fillRect(0, 0, w, h);

  const grad = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.5);
  grad.addColorStop(0, "rgba(26, 5, 51, 0.3)");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Draw stars with modifications
  for (const star of stars) {
    // Difference 1: Skip star at (80, 60) — "Stern fehlt"
    if (star.x === 80 && star.y === 60) continue;

    // Difference 2: Change color of star at (200, 100) — "Stern andere Farbe"
    if (star.x === 200 && star.y === 100) {
      drawStar(ctx, star.x, star.y, star.size, "#00d4ff");
      continue;
    }

    drawStar(ctx, star.x, star.y, star.size, star.color);
  }

  // Difference 3: Add extra star at (320, 80) — "Zusätzlicher Stern"
  drawStar(ctx, 320, 80, 3, "#ffffff");

  // Difference 4: Moon with different (smaller) size — "Mond andere Größe"
  drawMoon(ctx, 150, 220, 12, "#ffffcc");

  // Draw constellation lines (same as left, minus one)
  drawLine(ctx, 150, 40, 200, 100, "rgba(192, 192, 224, 0.25)", 1);
  drawLine(ctx, 200, 100, 250, 160, "rgba(192, 192, 224, 0.25)", 1);
  drawLine(ctx, 280, 50, 350, 120, "rgba(192, 192, 224, 0.25)", 1);
  drawLine(ctx, 100, 180, 150, 220, "rgba(192, 192, 224, 0.25)", 1);
  // Difference 5: Skip line from (250,160) to (350,220) — "Linie fehlt"

  // Same tiny background dots
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  const seed = [23, 67, 112, 189, 245, 310, 56, 134, 278, 355, 42, 198, 88, 267, 330];
  const seedY = [15, 95, 145, 35, 255, 175, 195, 270, 125, 65, 240, 210, 160, 85, 230];
  for (let i = 0; i < seed.length; i++) {
    ctx.beginPath();
    ctx.arc(seed[i], seedY[i], 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function SpotDifference({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as SpotDifferenceData;
  const { canvasWidth, canvasHeight, differences, stars } = data;

  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const [found, setFound] = useState<Set<number>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<{ canvas: "left" | "right" } | null>(null);
  const [feedback, setFeedback] = useState("");
  const solvedRef = useRef(false);

  // Draw scenes on mount
  useEffect(() => {
    const leftCtx = leftCanvasRef.current?.getContext("2d");
    const rightCtx = rightCanvasRef.current?.getContext("2d");
    if (leftCtx) drawLeftScene(leftCtx, canvasWidth, canvasHeight, stars);
    if (rightCtx) drawRightScene(rightCtx, canvasWidth, canvasHeight, stars);
  }, [canvasWidth, canvasHeight, stars]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>, canvas: "left" | "right") => {
      if (solvedRef.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const scaleY = canvasHeight / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      // Check if click is near any unfound difference
      let hitIndex = -1;
      for (let i = 0; i < differences.length; i++) {
        if (found.has(i)) continue;
        const diff = differences[i];
        const dx = clickX - diff.x;
        const dy = clickY - diff.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= diff.radius) {
          hitIndex = i;
          break;
        }
      }

      if (hitIndex >= 0) {
        const newFound = new Set(found);
        newFound.add(hitIndex);
        setFound(newFound);
        setFeedback(differences[hitIndex].description);
        setWrongFlash(null);

        if (newFound.size === differences.length) {
          solvedRef.current = true;
          setFeedback("Alle Unterschiede gefunden!");
          setTimeout(() => onSolved(), 800);
        }
      } else {
        // Wrong click
        setWrongFlash({ canvas });
        setFeedback("");
        setTimeout(() => setWrongFlash(null), 400);
      }
    },
    [found, differences, canvasWidth, canvasHeight, onSolved]
  );

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>
      <p className={styles.progress}>
        Unterschied {found.size} von {differences.length} gefunden
      </p>

      <div className={styles.canvasRow}>
        {/* Left canvas */}
        <div className={styles.canvasWrapper}>
          <span className={styles.canvasLabel}>Original</span>
          <canvas
            ref={leftCanvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ width: Math.min(canvasWidth, 380), height: "auto", display: "block" }}
            onClick={(e) => handleCanvasClick(e, "left")}
          />
          {/* Found markers on left canvas */}
          {Array.from(found).map((idx) => {
            const diff = differences[idx];
            const scale = Math.min(canvasWidth, 380) / canvasWidth;
            return (
              <div
                key={`left-${idx}`}
                className={styles.marker}
                style={{
                  left: diff.x * scale - diff.radius * scale,
                  top: diff.y * scale - diff.radius * scale,
                  width: diff.radius * 2 * scale,
                  height: diff.radius * 2 * scale,
                }}
              />
            );
          })}
          {wrongFlash?.canvas === "left" && <div className={styles.flashOverlay} />}
        </div>

        {/* Right canvas */}
        <div className={styles.canvasWrapper}>
          <span className={styles.canvasLabel}>Ver&auml;ndert</span>
          <canvas
            ref={rightCanvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ width: Math.min(canvasWidth, 380), height: "auto", display: "block" }}
            onClick={(e) => handleCanvasClick(e, "right")}
          />
          {/* Found markers on right canvas */}
          {Array.from(found).map((idx) => {
            const diff = differences[idx];
            const scale = Math.min(canvasWidth, 380) / canvasWidth;
            return (
              <div
                key={`right-${idx}`}
                className={styles.marker}
                style={{
                  left: diff.x * scale - diff.radius * scale,
                  top: diff.y * scale - diff.radius * scale,
                  width: diff.radius * 2 * scale,
                  height: diff.radius * 2 * scale,
                }}
              />
            );
          })}
          {wrongFlash?.canvas === "right" && <div className={styles.flashOverlay} />}
        </div>
      </div>

      <p className={`${styles.feedback} ${found.size === differences.length ? styles.feedbackSuccess : ""}`}>
        {feedback}
      </p>
    </div>
  );
}
