import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { PuzzleComponentProps } from "../types.ts";
import styles from "./Connections.module.css";

interface GroupDef {
  label: string;
  words: string[];
  color: string;
}

interface ConnectionsData {
  groups: GroupDef[];
}

export default function Connections({ puzzle, onSolved }: PuzzleComponentProps) {
  const data = puzzle.data as unknown as ConnectionsData;
  const groups = data.groups;

  const shuffledWords = useMemo(() => {
    const all = groups.flatMap((g) => g.words);
    // Deterministic shuffle using puzzle id as seed-ish
    const copy = [...all];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = ((i * 2654435761) >>> 0) % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [groups]);

  const [selected, setSelected] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<GroupDef[]>([]);
  const [wrongWords, setWrongWords] = useState<Set<string>>(new Set());
  const [statusMsg, setStatusMsg] = useState("");
  const solvedRef = useRef(false);

  const foundWords = useMemo(
    () => new Set(foundGroups.flatMap((g) => g.words)),
    [foundGroups]
  );

  const remainingWords = useMemo(
    () => shuffledWords.filter((w) => !foundWords.has(w)),
    [shuffledWords, foundWords]
  );

  // Auto-resolve last remaining group after a short delay
  useEffect(() => {
    if (solvedRef.current) return;
    if (foundGroups.length !== groups.length - 1) return;

    const lastGroup = groups.find((g) => !foundGroups.includes(g));
    if (!lastGroup) return;

    const timer = setTimeout(() => {
      setFoundGroups((prev) => [...prev, lastGroup]);
      setStatusMsg("Alle Gruppen gefunden!");
      solvedRef.current = true;
      setTimeout(() => onSolved(), 1200);
    }, 800);

    return () => clearTimeout(timer);
  }, [foundGroups, groups, onSolved]);

  const handleTileClick = useCallback(
    (word: string) => {
      if (foundWords.has(word) || solvedRef.current) return;
      setWrongWords(new Set());
      setStatusMsg("");

      setSelected((prev) => {
        if (prev.includes(word)) {
          return prev.filter((w) => w !== word);
        }
        if (prev.length >= 4) return prev;
        return [...prev, word];
      });
    },
    [foundWords]
  );

  const handleCheck = useCallback(() => {
    if (selected.length !== 4 || solvedRef.current) return;

    const matchedGroup = groups.find(
      (g) =>
        !foundGroups.includes(g) &&
        g.words.every((w) => selected.includes(w))
    );

    if (matchedGroup) {
      const newFound = [...foundGroups, matchedGroup];
      setSelected([]);
      setFoundGroups(newFound);
      setStatusMsg(`"${matchedGroup.label}" gefunden!`);

      if (newFound.length === groups.length) {
        solvedRef.current = true;
        setStatusMsg("Alle Gruppen gefunden!");
        setTimeout(() => onSolved(), 1200);
      }
    } else {
      setWrongWords(new Set(selected));
      setStatusMsg("Das ist leider keine Gruppe. Versuche es erneut.");
      setTimeout(() => {
        setSelected([]);
        setWrongWords(new Set());
      }, 600);
    }
  }, [selected, groups, foundGroups, onSolved]);

  return (
    <div className={styles.container}>
      <p className={styles.description}>{puzzle.description}</p>

      {foundGroups.length > 0 && (
        <div className={styles.foundGroups}>
          {foundGroups.map((g) => (
            <div
              key={g.label}
              className={styles.foundGroup}
              style={{ background: g.color }}
            >
              <span className={styles.foundGroupLabel}>{g.label}</span>
              <span className={styles.foundGroupWords}>
                {g.words.join(" \u2022 ")}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.grid}>
        {remainingWords.map((word) => {
          const isSelected = selected.includes(word);
          const isWrong = wrongWords.has(word);
          const classNames = [
            styles.tile,
            isSelected ? styles.tileSelected : "",
            isWrong ? styles.tileWrong : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={word}
              className={classNames}
              onClick={() => handleTileClick(word)}
            >
              {word}
            </button>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button
          className={styles.clearButton}
          onClick={() => {
            setSelected([]);
            setStatusMsg("");
          }}
          disabled={selected.length === 0}
        >
          Auswahl leeren
        </button>
        <button
          className={styles.checkButton}
          onClick={handleCheck}
          disabled={selected.length !== 4}
        >
          {`Pr\u00fcfen`}
        </button>
      </div>

      <p
        className={`${styles.status} ${
          foundGroups.length === groups.length ? styles.successText : ""
        }`}
      >
        {statusMsg}
      </p>
    </div>
  );
}
