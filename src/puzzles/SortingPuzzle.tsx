import { useState, useCallback, useRef } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./SortingPuzzle.module.css";

interface SortingRound {
  title: string;
  items: string[];
  correctOrder: string[];
}

interface SortingData {
  rounds: SortingRound[];
}

export default function SortingPuzzle({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as SortingData;
  const { rounds } = data;

  const [currentRound, setCurrentRound] = useState(0);
  const [items, setItems] = useState<string[]>([...rounds[0].items]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const solvedRef = useRef(false);

  const round = rounds[currentRound];

  const handleItemClick = useCallback(
    (index: number) => {
      if (roundComplete || allDone) return;

      if (selectedIndex === null) {
        // First selection
        setSelectedIndex(index);
      } else if (selectedIndex === index) {
        // Deselect
        setSelectedIndex(null);
      } else {
        // Swap the two items
        setItems((prev) => {
          const next = [...prev];
          const temp = next[selectedIndex];
          next[selectedIndex] = next[index];
          next[index] = temp;
          return next;
        });
        setSelectedIndex(null);
        setWrongCount(null);
      }
    },
    [selectedIndex, roundComplete, allDone],
  );

  const handleCheck = useCallback(() => {
    if (roundComplete || allDone) return;

    const correct = round.correctOrder;
    const isCorrect = items.every((item, i) => item === correct[i]);

    if (isCorrect) {
      setRoundComplete(true);
      setWrongCount(null);
      setSelectedIndex(null);

      if (currentRound + 1 >= rounds.length) {
        // All rounds done
        setAllDone(true);
        if (!solvedRef.current) {
          solvedRef.current = true;
          setTimeout(() => onSolved(), 1500);
        }
      } else {
        // Advance to next round after delay
        setTimeout(() => {
          const nextRound = currentRound + 1;
          setCurrentRound(nextRound);
          setItems([...rounds[nextRound].items]);
          setRoundComplete(false);
          setWrongCount(null);
        }, 1500);
      }
    } else {
      // Count wrong positions
      const wrong = items.filter((item, i) => item !== correct[i]).length;
      setWrongCount(wrong);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }, [roundComplete, allDone, round, items, currentRound, rounds, onSolved]);

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLButtonElement>, index: number) => {
      if (roundComplete || allDone) return;
      e.dataTransfer.setData("text/plain", String(index));
      e.dataTransfer.effectAllowed = "move";
    },
    [roundComplete, allDone],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLButtonElement>, dropIndex: number) => {
      e.preventDefault();
      if (roundComplete || allDone) return;

      const dragIndex = Number(e.dataTransfer.getData("text/plain"));
      if (isNaN(dragIndex) || dragIndex === dropIndex) return;

      setItems((prev) => {
        const next = [...prev];
        const temp = next[dragIndex];
        next[dragIndex] = next[dropIndex];
        next[dropIndex] = temp;
        return next;
      });
      setSelectedIndex(null);
      setWrongCount(null);
    },
    [roundComplete, allDone],
  );

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.roundInfo}>
        <span className={styles.roundLabel}>
          Runde {currentRound + 1} von {rounds.length}
        </span>
        <div className={styles.roundDots}>
          {rounds.map((_, i) => (
            <span
              key={i}
              className={`${styles.roundDot} ${i < currentRound ? styles.roundDotDone : ""} ${i === currentRound ? styles.roundDotCurrent : ""}`}
            />
          ))}
        </div>
      </div>

      <h3 className={styles.roundTitle}>{round.title}</h3>

      <p className={styles.hint}>
        Klicke zwei Karten zum Tauschen oder ziehe sie an die richtige Position.
      </p>

      <div className={`${styles.itemList} ${shaking ? styles.shake : ""}`}>
        {items.map((item, index) => {
          const isSelected = selectedIndex === index;
          const isCorrectPosition = roundComplete && item === round.correctOrder[index];

          const classList = [
            styles.itemCard,
            isSelected ? styles.itemSelected : "",
            isCorrectPosition ? styles.itemCorrect : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={`${currentRound}-${index}`}
              className={classList}
              onClick={() => handleItemClick(index)}
              draggable={!roundComplete && !allDone}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              disabled={allDone}
            >
              <span className={styles.itemIndex}>{index + 1}</span>
              <span className={styles.itemName}>{item}</span>
            </button>
          );
        })}
      </div>

      {wrongCount !== null && !roundComplete && (
        <p className={styles.wrongMsg}>
          {wrongCount} {wrongCount === 1 ? "Objekt ist" : "Objekte sind"} falsch
          platziert
        </p>
      )}

      {roundComplete && !allDone && (
        <p className={styles.successMsg}>Richtig! Weiter zur nächsten Runde...</p>
      )}

      {allDone && (
        <p className={styles.successMsg}>
          Perfekt! Alle Runden gemeistert!
        </p>
      )}

      {!roundComplete && !allDone && (
        <button className={styles.checkButton} onClick={handleCheck}>
          Prüfen
        </button>
      )}
    </div>
  );
}
