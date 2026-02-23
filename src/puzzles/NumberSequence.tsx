import type { PuzzleComponentProps } from "../types.ts";

export default function NumberSequence({ puzzle, onSolved }: PuzzleComponentProps) {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h3>{puzzle.title}</h3>
      <p style={{ color: "#8888aa" }}>{puzzle.description}</p>
      <p style={{ color: "#8888aa", marginTop: "1rem" }}>Wird bald implementiert...</p>
      <button
        onClick={onSolved}
        style={{ marginTop: "2rem", padding: "0.5rem 1.5rem", background: "#ffd700", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
      >
        [Debug] Als gelöst markieren
      </button>
    </div>
  );
}
