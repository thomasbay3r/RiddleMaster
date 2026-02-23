import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PuzzleSolved from "./PuzzleSolved.tsx";

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock GameContext
const mockGameState = {
  player: null as { id: string; name: string } | null,
  clues: [] as { chapter: number; clueText: string }[],
  isPuzzleSolved: vi.fn().mockReturnValue(false),
};
vi.mock("../context/GameContext.tsx", () => ({
  useGame: () => mockGameState,
}));

function renderAtRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/chapter/:chapterId/puzzle/:puzzleId/solved"
          element={<PuzzleSolved />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("PuzzleSolved", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockGameState.player = null;
    mockGameState.clues = [];
    mockGameState.isPuzzleSolved.mockReturnValue(false);
  });

  it("redirects to /map for NaN params", () => {
    renderAtRoute("/chapter/abc/puzzle/xyz/solved");
    expect(mockNavigate).toHaveBeenCalledWith("/map", { replace: true });
  });

  it("shows not-solved message when puzzle is not solved", () => {
    mockGameState.player = { id: "test", name: "Test" };
    mockGameState.isPuzzleSolved.mockReturnValue(false);

    renderAtRoute("/chapter/1/puzzle/1/solved");
    expect(screen.getByText("Dieses Rätsel wurde noch nicht gelöst.")).toBeInTheDocument();
  });

  it("shows not-solved message when player is null", () => {
    mockGameState.player = null;

    renderAtRoute("/chapter/1/puzzle/1/solved");
    expect(screen.getByText("Dieses Rätsel wurde noch nicht gelöst.")).toBeInTheDocument();
  });

  it("shows celebration when puzzle is solved", () => {
    mockGameState.player = { id: "test", name: "Test" };
    mockGameState.isPuzzleSolved.mockReturnValue(true);

    renderAtRoute("/chapter/1/puzzle/1/solved");
    expect(screen.getByText("Wunderbar!")).toBeInTheDocument();
    expect(screen.getByText("Du hast das Rätsel gelöst!")).toBeInTheDocument();
  });

  it("shows clue when puzzle has one", () => {
    mockGameState.player = { id: "test", name: "Test" };
    mockGameState.isPuzzleSolved.mockReturnValue(true);
    mockGameState.clues = [{ chapter: 1, clueText: "STERN" }];

    renderAtRoute("/chapter/1/puzzle/1/solved");
    expect(screen.getByText("STERN")).toBeInTheDocument();
    expect(screen.getByText("Du hast einen Hinweis gefunden:")).toBeInTheDocument();
  });
});
