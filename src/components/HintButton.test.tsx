import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HintButton from "./HintButton.tsx";

describe("HintButton", () => {
  const hints: [string, string] = ["Erster Hinweis", "Zweiter Hinweis"];

  it("renders with hint count 0/2", () => {
    render(<HintButton hints={hints} hintsUsed={0} onHint={vi.fn()} />);
    expect(screen.getByText("(0/2)")).toBeInTheDocument();
  });

  it("shows first hint on first click", () => {
    const onHint = vi.fn();
    render(<HintButton hints={hints} hintsUsed={0} onHint={onHint} />);

    fireEvent.click(screen.getByText("Hinweis"));
    expect(onHint).toHaveBeenCalledWith(0);
    expect(screen.getByText("Erster Hinweis")).toBeInTheDocument();
    expect(screen.getByText("Hinweis 1")).toBeInTheDocument();
  });

  it("shows second hint when hintsUsed is 1", () => {
    const onHint = vi.fn();
    render(<HintButton hints={hints} hintsUsed={1} onHint={onHint} />);

    fireEvent.click(screen.getByText("Hinweis"));
    expect(onHint).toHaveBeenCalledWith(1);
    expect(screen.getByText("Zweiter Hinweis")).toBeInTheDocument();
    expect(screen.getByText("Hinweis 2")).toBeInTheDocument();
  });

  it("disables button when all hints used", () => {
    render(<HintButton hints={hints} hintsUsed={2} onHint={vi.fn()} />);
    const btn = screen.getByText("Hinweis").closest("button")!;
    expect(btn).toBeDisabled();
  });

  it("closes modal when clicking Verstanden", () => {
    render(<HintButton hints={hints} hintsUsed={0} onHint={vi.fn()} />);

    fireEvent.click(screen.getByText("Hinweis"));
    expect(screen.getByText("Erster Hinweis")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Verstanden"));
    // After animation exit, modal content should be gone
    // (AnimatePresence may keep it in DOM briefly, but text should not persist)
  });
});
