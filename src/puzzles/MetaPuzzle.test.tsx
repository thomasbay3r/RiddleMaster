import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MetaPuzzle from "./MetaPuzzle.tsx";
import type { PuzzleDef } from "../types.ts";

// Mock GameContext
const mockClues: { chapter: number; clueText: string }[] = [];
vi.mock("../context/GameContext.tsx", () => ({
  useGame: () => ({
    clues: mockClues,
  }),
}));

const makePuzzle = (): PuzzleDef =>
  ({
    id: "test-meta",
    chapter: 7,
    puzzleIndex: 1,
    type: "meta-puzzle" as const,
    title: "Meta-Rätsel",
    description: "Kombiniere die Hinweise.",
    isSignature: true,
    data: {
      answer: "Sternlicht weist den Weg heim",
      cluesByChapter: {
        1: "STERN",
        2: "LICHT",
        3: "WEIST",
        4: "DEN",
        5: "WEG",
        6: "HEIM",
      },
    },
    hints: ["Hint 1", "Hint 2"] as [string, string],
  }) as PuzzleDef;

describe("MetaPuzzle", () => {
  let onSolved: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSolved = vi.fn();
    mockClues.length = 0;
  });

  it("shows missing chapters when no clues collected", () => {
    render(
      <MetaPuzzle puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );
    expect(screen.getByText(/Dir fehlen noch Hinweise/)).toBeInTheDocument();
  });

  it("shows ??? for uncollected clues", () => {
    render(
      <MetaPuzzle puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );
    const questionMarks = screen.getAllByText("???");
    expect(questionMarks).toHaveLength(6);
  });

  it("disables submit button when clues are missing", () => {
    render(
      <MetaPuzzle puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    const input = screen.getByPlaceholderText(/Gib den vollständigen Satz ein/);
    fireEvent.change(input, { target: { value: "Sternlicht weist den Weg heim" } });

    const btn = screen.getByText("Prüfen");
    expect(btn).toBeDisabled();
  });

  it("blocks Enter key submission when clues are missing", () => {
    render(
      <MetaPuzzle puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    const input = screen.getByPlaceholderText(/Gib den vollständigen Satz ein/);
    fireEvent.change(input, { target: { value: "Sternlicht weist den Weg heim" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSolved).not.toHaveBeenCalled();
  });

  it("accepts correct answer with all clues collected", () => {
    vi.useFakeTimers();
    // Populate all clues
    mockClues.push(
      { chapter: 1, clueText: "STERN" },
      { chapter: 2, clueText: "LICHT" },
      { chapter: 3, clueText: "WEIST" },
      { chapter: 4, clueText: "DEN" },
      { chapter: 5, clueText: "WEG" },
      { chapter: 6, clueText: "HEIM" },
    );

    render(
      <MetaPuzzle puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    const input = screen.getByPlaceholderText(/Gib den vollständigen Satz ein/);
    fireEvent.change(input, { target: { value: "Sternlicht weist den Weg heim" } });
    fireEvent.click(screen.getByText("Prüfen"));

    vi.advanceTimersByTime(1500);
    expect(onSolved).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("accepts space-separated answer (STERN LICHT = Sternlicht)", () => {
    vi.useFakeTimers();
    mockClues.push(
      { chapter: 1, clueText: "STERN" },
      { chapter: 2, clueText: "LICHT" },
      { chapter: 3, clueText: "WEIST" },
      { chapter: 4, clueText: "DEN" },
      { chapter: 5, clueText: "WEG" },
      { chapter: 6, clueText: "HEIM" },
    );

    render(
      <MetaPuzzle puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    const input = screen.getByPlaceholderText(/Gib den vollständigen Satz ein/);
    fireEvent.change(input, { target: { value: "STERN LICHT WEIST DEN WEG HEIM" } });
    fireEvent.click(screen.getByText("Prüfen"));

    vi.advanceTimersByTime(1500);
    expect(onSolved).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("rejects wrong answer", () => {
    mockClues.push(
      { chapter: 1, clueText: "STERN" },
      { chapter: 2, clueText: "LICHT" },
      { chapter: 3, clueText: "WEIST" },
      { chapter: 4, clueText: "DEN" },
      { chapter: 5, clueText: "WEG" },
      { chapter: 6, clueText: "HEIM" },
    );

    render(
      <MetaPuzzle puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    const input = screen.getByPlaceholderText(/Gib den vollständigen Satz ein/);
    fireEvent.change(input, { target: { value: "Falsche Antwort" } });
    fireEvent.click(screen.getByText("Prüfen"));

    expect(screen.getByText("Das ist noch nicht ganz richtig...")).toBeInTheDocument();
    expect(onSolved).not.toHaveBeenCalled();
  });

  it("shows collected clue words", () => {
    mockClues.push({ chapter: 1, clueText: "STERN" });

    render(
      <MetaPuzzle puzzle={makePuzzle()} onSolved={onSolved} onHint={vi.fn()} hintsUsed={0} />,
    );

    expect(screen.getByText("STERN")).toBeInTheDocument();
    // Other 5 should still be ???
    const questionMarks = screen.getAllByText("???");
    expect(questionMarks).toHaveLength(5);
  });
});
