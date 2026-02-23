import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext.tsx";
import Layout from "./components/Layout.tsx";

import StartScreen from "./screens/StartScreen.tsx";
import SkyMap from "./screens/SkyMap.tsx";
import ChapterIntro from "./screens/ChapterIntro.tsx";
import PuzzleSelect from "./screens/PuzzleSelect.tsx";
import PuzzleScreen from "./screens/PuzzleScreen.tsx";
import PuzzleSolved from "./screens/PuzzleSolved.tsx";
import ConstellationReveal from "./screens/ConstellationReveal.tsx";
import Finale from "./screens/Finale.tsx";

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<StartScreen />} />
            <Route path="/map" element={<SkyMap />} />
            <Route path="/chapter/:chapterId" element={<ChapterIntro />} />
            <Route path="/chapter/:chapterId/puzzles" element={<PuzzleSelect />} />
            <Route path="/chapter/:chapterId/puzzle/:puzzleId" element={<PuzzleScreen />} />
            <Route path="/chapter/:chapterId/puzzle/:puzzleId/solved" element={<PuzzleSolved />} />
            <Route path="/chapter/:chapterId/reveal" element={<ConstellationReveal />} />
            <Route path="/finale" element={<Finale />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}
