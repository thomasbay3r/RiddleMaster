import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./Memory.module.css";

interface PairDef {
  id: number;
  name: string;
  symbol: string;
}

interface MemoryData {
  pairs: PairDef[];
}

interface Card {
  uid: number;
  pairId: number;
  name: string;
  symbol: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Memory({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as MemoryData;

  // Create shuffled cards (each pair appears twice)
  const cards = useMemo<Card[]>(() => {
    const deck: Card[] = [];
    let uid = 0;
    for (const pair of data.pairs) {
      deck.push({ uid: uid++, pairId: pair.id, name: pair.name, symbol: pair.symbol });
      deck.push({ uid: uid++, pairId: pair.id, name: pair.name, symbol: pair.symbol });
    }
    return shuffle(deck);
  }, [data.pairs]);

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const solvedRef = useRef(false);

  // Check for matches when 2 cards are flipped
  useEffect(() => {
    if (flipped.length !== 2) return;

    setLocked(true);
    const [first, second] = flipped;
    const card1 = cards.find((c) => c.uid === first)!;
    const card2 = cards.find((c) => c.uid === second)!;

    if (card1.pairId === card2.pairId) {
      // Match found
      const timer = setTimeout(() => {
        setMatched((prev) => {
          const next = new Set(prev);
          next.add(first);
          next.add(second);

          // Check if all matched
          if (next.size === cards.length && !solvedRef.current) {
            solvedRef.current = true;
            setTimeout(() => onSolved(), 800);
          }

          return next;
        });
        setFlipped([]);
        setLocked(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // No match — flip back after delay
      const timer = setTimeout(() => {
        setFlipped([]);
        setLocked(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [flipped, cards, onSolved]);

  const handleCardClick = useCallback(
    (uid: number) => {
      if (locked || solvedRef.current) return;
      if (flipped.includes(uid) || matched.has(uid)) return;
      if (flipped.length >= 2) return;

      setMoves((m) => m + 1);
      setFlipped((prev) => [...prev, uid]);
    },
    [locked, flipped, matched]
  );

  const matchedPairs = matched.size / 2;
  const totalPairs = data.pairs.length;
  const allMatched = matched.size === cards.length;

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      <div className={styles.grid}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.uid);
          const isMatched = matched.has(card.uid);
          const showFace = isFlipped || isMatched;

          let cardClass = styles.card;
          if (showFace) cardClass += ` ${styles.cardFlipped}`;
          if (isMatched) cardClass += ` ${styles.cardMatched}`;

          return (
            <div key={card.uid} className={styles.cardSlot}>
              <button
                className={cardClass}
                onClick={() => handleCardClick(card.uid)}
                aria-label={showFace ? `${card.name} ${card.symbol}` : "Verdeckte Karte"}
              >
                <div className={`${styles.cardFace} ${styles.cardBack}`} />
                <div
                  className={`${styles.cardFace} ${styles.cardFront} ${
                    isMatched ? styles.cardFrontMatched : ""
                  }`}
                >
                  <span className={styles.cardSymbol}>{card.symbol}</span>
                  <span
                    className={`${styles.cardName} ${
                      isMatched ? styles.cardNameMatched : ""
                    }`}
                  >
                    {card.name}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.controls}>
        <p className={styles.moveCounter}>
          Z&uuml;ge: {moves}
        </p>
        <p className={styles.pairsCounter}>
          Paare: {matchedPairs} / {totalPairs}
        </p>
        {allMatched && (
          <p className={styles.status}>Alle Paare gefunden! Fantastisch!</p>
        )}
      </div>
    </div>
  );
}
