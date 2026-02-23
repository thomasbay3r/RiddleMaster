import { useState, useCallback, useMemo, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./StarCompass.module.css";

interface Instruction {
  direction: string;
  steps: number;
}

interface StarCompassData {
  gridSize: number;
  start: [number, number];
  instructions: Instruction[];
  answer: [number, number];
}

export default function StarCompass({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as StarCompassData;
  const { gridSize, start, instructions, answer } = data;

  const [showInstructions, setShowInstructions] = useState(true);
  const [clickedCell, setClickedCell] = useState<[number, number] | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const solvedRef = useRef(false);

  const handleCellClick = useCallback(
    (col: number, row: number) => {
      if (solvedRef.current || result === "correct") return;

      setClickedCell([col, row]);

      if (col === answer[0] && row === answer[1]) {
        setResult("correct");
        solvedRef.current = true;
        setTimeout(() => onSolved(), 1200);
      } else {
        setResult("wrong");
        setTimeout(() => {
          setResult(null);
          setClickedCell(null);
        }, 1200);
      }
    },
    [answer, result, onSolved]
  );

  const cells = useMemo(() => {
    const items: { col: number; row: number }[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        items.push({ col: c, row: r });
      }
    }
    return items;
  }, [gridSize]);

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.gridWrapper}>
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 38px)`,
            gridTemplateRows: `repeat(${gridSize}, 38px)`,
          }}
        >
          {cells.map(({ col, row }) => {
            const isStart = col === start[0] && row === start[1];
            const isClicked = clickedCell && col === clickedCell[0] && row === clickedCell[1];
            const isCorrect = isClicked && result === "correct";
            const isWrong = isClicked && result === "wrong";

            let className = styles.cell;
            if (isStart) className += ` ${styles.cellStart}`;
            if (isCorrect) className += ` ${styles.cellCorrect} ${styles.cellAnswer}`;
            if (isWrong) className += ` ${styles.cellWrong}`;

            return (
              <button
                key={`${col}-${row}`}
                className={className}
                onClick={() => handleCellClick(col, row)}
                aria-label={`Zelle ${col}, ${row}`}
              />
            );
          })}
        </div>

        <div className={styles.compass}>
          <div className={styles.compassRose}>
            <span className={styles.compassN}>N</span>
            <span className={styles.compassS}>S</span>
            <span className={styles.compassO}>O</span>
            <span className={styles.compassW}>W</span>
            <div className={styles.compassNeedle} />
            <div className={styles.compassCenter} />
          </div>
        </div>
      </div>

      <div className={styles.instructions}>
        {showInstructions ? (
          <>
            {instructions.map((instr, i) => (
              <div
                key={i}
                className={`${styles.instruction} ${!result ? styles.instructionActive : ""}`}
              >
                <span className={styles.instructionNumber}>{i + 1}</span>
                {instr.steps} {instr.steps === 1 ? "Schritt" : "Schritte"} nach {instr.direction}
              </div>
            ))}
            <button
              className={styles.button}
              onClick={() => setShowInstructions(false)}
            >
              Anweisungen ausblenden
            </button>
          </>
        ) : (
          <button
            className={styles.button}
            onClick={() => setShowInstructions(true)}
          >
            Anweisungen nochmal lesen
          </button>
        )}
      </div>

      <div className={styles.controls}>
        <p
          className={`${styles.status} ${
            result === "wrong" ? styles.statusError : ""
          } ${result === "correct" ? styles.statusSuccess : ""}`}
        >
          {!result && "Klicke auf die Zelle, die der Polarstern ist."}
          {result === "wrong" && "Versuche es noch einmal!"}
          {result === "correct" && "Richtig! Der Polarstern erstrahlt!"}
        </p>
      </div>
    </div>
  );
}
