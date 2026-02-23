import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Connections from "./Connections.tsx";
import type { PuzzleDef } from "../types.ts";

const makePuzzle = (): PuzzleDef =>
  ({
    id: "test-conn",
    chapter: 1,
    puzzleIndex: 2,
    type: "connections" as const,
    title: "Verbindungen",
    description: "Sortiere die Begriffe.",
    isSignature: false,
    data: {
      groups: [
        { label: "Gruppe A", words: ["Wort1", "Wort2", "Wort3", "Wort4"], color: "#ffd700" },
        { label: "Gruppe B", words: ["Wort5", "Wort6", "Wort7", "Wort8"], color: "#00d4ff" },
        { label: "Gruppe C", words: ["Wort9", "Wort10", "Wort11", "Wort12"], color: "#9b59b6" },
        { label: "Gruppe D", words: ["Wort13", "Wort14", "Wort15", "Wort16"], color: "#c0c0e0" },
      ],
    },
    hints: ["Hint 1", "Hint 2"] as [string, string],
  }) as PuzzleDef;

describe("Connections", () => {
  let onSolved: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSolved = vi.fn();
    vi.useFakeTimers();
  });

  it("renders all 16 words as buttons", () => {
    render(
      <Connections puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    for (let i = 1; i <= 16; i++) {
      expect(screen.getByText(`Wort${i}`)).toBeInTheDocument();
    }
  });

  it("allows selecting up to 4 words", () => {
    render(
      <Connections puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    fireEvent.click(screen.getByText("Wort1"));
    fireEvent.click(screen.getByText("Wort2"));
    fireEvent.click(screen.getByText("Wort3"));
    fireEvent.click(screen.getByText("Wort4"));

    // Prüfen button should be enabled now
    expect(screen.getByText("Prüfen")).not.toBeDisabled();
  });

  it("deselects word on second click", () => {
    render(
      <Connections puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    fireEvent.click(screen.getByText("Wort1"));
    fireEvent.click(screen.getByText("Wort1")); // deselect

    // Prüfen should be disabled (0 selected)
    expect(screen.getByText("Prüfen")).toBeDisabled();
  });

  it("finds correct group and shows it", () => {
    render(
      <Connections puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    // Select Gruppe A
    fireEvent.click(screen.getByText("Wort1"));
    fireEvent.click(screen.getByText("Wort2"));
    fireEvent.click(screen.getByText("Wort3"));
    fireEvent.click(screen.getByText("Wort4"));
    fireEvent.click(screen.getByText("Prüfen"));

    expect(screen.getByText(/"Gruppe A" gefunden!/)).toBeInTheDocument();
  });

  it("shows error for wrong group", () => {
    render(
      <Connections puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    // Select mixed words
    fireEvent.click(screen.getByText("Wort1"));
    fireEvent.click(screen.getByText("Wort5"));
    fireEvent.click(screen.getByText("Wort9"));
    fireEvent.click(screen.getByText("Wort13"));
    fireEvent.click(screen.getByText("Prüfen"));

    expect(screen.getByText(/keine Gruppe/)).toBeInTheDocument();
  });

  it("auto-resolves last group after finding 3", () => {
    render(
      <Connections puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    // Find groups A, B, C
    for (const [start] of [[1], [5], [9]]) {
      for (let i = start; i < start + 4; i++) {
        fireEvent.click(screen.getByText(`Wort${i}`));
      }
      fireEvent.click(screen.getByText("Prüfen"));
    }

    // After 800ms delay, last group should auto-resolve
    act(() => { vi.advanceTimersByTime(800); });

    expect(screen.getByText("Alle Gruppen gefunden!")).toBeInTheDocument();

    // After another 1200ms, onSolved should be called
    act(() => { vi.advanceTimersByTime(1200); });
    expect(onSolved).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
