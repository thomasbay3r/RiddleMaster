import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./Tangram.module.css";

interface Zone {
  id: number;
  name: string;
  path: string;
  color: string;
}

interface Piece {
  id: number;
  label: string;
  matchesZone: number;
}

interface TangramData {
  zones: Zone[];
  pieces: Piece[];
}

/** Compute the centroid of an SVG path (very approximate: average of all coordinate pairs). */
function pathCentroid(path: string): { cx: number; cy: number } {
  const nums = path.match(/-?\d+(\.\d+)?/g);
  if (!nums || nums.length < 2) return { cx: 20, cy: 45 };
  let sx = 0,
    sy = 0,
    n = 0;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    sx += parseFloat(nums[i]);
    sy += parseFloat(nums[i + 1]);
    n++;
  }
  return { cx: sx / n, cy: sy / n };
}

export default function Tangram({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as TangramData;
  const { zones, pieces } = data;

  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [filledZones, setFilledZones] = useState<Record<number, number>>({}); // zoneId -> pieceId
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [shakeZone, setShakeZone] = useState<number | null>(null);
  const solvedRef = useRef(false);

  const usedPieceIds = new Set(Object.values(filledZones));
  const filledCount = Object.keys(filledZones).length;

  const handleZoneClick = useCallback(
    (zoneId: number) => {
      if (solvedRef.current) return;

      // If zone is already filled, click to remove piece
      if (filledZones[zoneId] !== undefined) {
        setFilledZones((prev) => {
          const next = { ...prev };
          delete next[zoneId];
          return next;
        });
        setSelectedZone(null);
        setFeedback("");
        return;
      }

      setSelectedZone(zoneId);
      setFeedback("");
      setFeedbackSuccess(false);
    },
    [filledZones]
  );

  const handlePieceClick = useCallback(
    (pieceId: number) => {
      if (solvedRef.current || usedPieceIds.has(pieceId)) return;

      if (selectedZone === null) {
        setFeedback("W\u00e4hle zuerst eine Zone im Bild aus.");
        setFeedbackSuccess(false);
        return;
      }

      // Check if this piece matches the selected zone
      const piece = pieces.find((p) => p.id === pieceId);
      if (!piece) return;

      if (piece.matchesZone === selectedZone) {
        // Correct match
        const newFilled = { ...filledZones, [selectedZone]: pieceId };
        setFilledZones(newFilled);
        setSelectedZone(null);
        setFeedback("");

        // Check completion
        if (Object.keys(newFilled).length === zones.length) {
          setFeedback("Der Drache ist komplett!");
          setFeedbackSuccess(true);
          solvedRef.current = true;
          setTimeout(() => onSolved(), 1000);
        }
      } else {
        // Wrong match - shake
        setShakeZone(selectedZone);
        setFeedback("Dieses Teil passt hier nicht.");
        setFeedbackSuccess(false);
        setTimeout(() => setShakeZone(null), 400);
      }
    },
    [selectedZone, filledZones, pieces, zones.length, usedPieceIds, onSolved]
  );

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>
      <p className={styles.progress}>
        {filledCount} von {zones.length} Teile platziert
      </p>

      {/* Dragon silhouette */}
      <div className={styles.silhouetteArea}>
        <svg className={styles.silhouetteSvg} viewBox="0 0 40 90">
          {zones.map((zone) => {
            const isFilled = filledZones[zone.id] !== undefined;
            const isSelected = selectedZone === zone.id;
            const isShaking = shakeZone === zone.id;
            const centroid = pathCentroid(zone.path);

            let zoneClass = styles.zone + " ";
            if (isFilled) {
              zoneClass += styles.zoneFilled;
            } else if (isSelected) {
              zoneClass += styles.zoneSelected;
            } else {
              zoneClass += styles.zoneEmpty;
            }
            if (isShaking) {
              zoneClass += ` ${styles.shakeAnim}`;
            }

            return (
              <g key={zone.id}>
                <path
                  d={zone.path}
                  className={zoneClass}
                  fill={isFilled ? zone.color : undefined}
                  stroke={isFilled ? zone.color : undefined}
                  onClick={() => handleZoneClick(zone.id)}
                />
                <text
                  x={centroid.cx}
                  y={centroid.cy + 1.5}
                  className={`${styles.zoneLabel} ${isFilled ? styles.zoneLabelFilled : ""}`}
                >
                  {zone.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Instruction */}
      <p className={styles.instruction}>
        {selectedZone !== null
          ? `Zone "${zones.find((z) => z.id === selectedZone)?.name}" ausgew\u00e4hlt \u2014 w\u00e4hle ein passendes Teil`
          : "Klicke auf eine Zone im Bild, dann auf das passende Teil"}
      </p>

      {/* Piece tray */}
      <div className={styles.tray}>
        {pieces.map((piece) => {
          const isUsed = usedPieceIds.has(piece.id);
          const matchingZone = zones.find((z) => z.id === piece.matchesZone);
          return (
            <button
              key={piece.id}
              className={`${styles.piece} ${isUsed ? styles.pieceUsed : ""}`}
              style={{
                borderColor: isUsed ? undefined : (matchingZone?.color ?? "#c0c0e0") + "60",
                color: matchingZone?.color ?? "#c0c0e0",
              }}
              onClick={() => handlePieceClick(piece.id)}
              aria-label={`Teil ${piece.id}`}
            >
              {piece.label}
            </button>
          );
        })}
      </div>

      <p className={`${styles.feedback} ${feedbackSuccess ? styles.feedbackSuccess : ""}`}>
        {feedback}
      </p>
    </div>
  );
}
