# Sternenreise: Dreifacher Spielumfang — Design-Dokument

## Ziel

Den Spielumfang von 7 Kapiteln (28 Rätsel) auf 21 Kapitel (84 Rätsel) verdreifachen, organisiert in 3 Akten mit eigenständigen Story-Bögen, Meta-Rätseln und steigender Schwierigkeit.

## Architektur

### 3-Akte-Struktur

| Akt | Kapitel | Thema | Schwierigkeit | Meta-Antwort |
|-----|---------|-------|---------------|--------------|
| **Akt 1: Die Erweckung** | 1–7 | Entdeckung der Sternbilder | Leicht | "Sternlicht weist den Weg heim" (existiert) |
| **Akt 2: Die Prüfung** | 8–14 | Die Sterne prüfen die Reisende | Mittel | "Mut trägt durch die dunkle Nacht" |
| **Akt 3: Die Vollendung** | 15–21 | Rückkehr und ewige Verbindung | Schwer | "Für immer vereint im Sternenglanz" |

### Neue Sternbilder

**Akt 2:**
| Kapitel | Sternbild | Thema |
|---------|-----------|-------|
| 8 | Pegasus | Freiheit & Träume |
| 9 | Scorpius | Mut & Stärke |
| 10 | Gemini | Zweisamkeit & Spiegel |
| 11 | Aquila | Weitsicht & Perspektive |
| 12 | Perseus | Heldenmut & Schutz |
| 13 | Centaurus | Weisheit & Natur |
| 14 | Phoenix | Erneuerung & Wandel |

**Akt 3:**
| Kapitel | Sternbild | Thema |
|---------|-----------|-------|
| 15 | Hydra | Ausdauer & Stärke |
| 16 | Sagittarius | Ziel & Richtung |
| 17 | Leo | Stolz & Leidenschaft |
| 18 | Virgo | Reinheit & Perfektion |
| 19 | Aquarius | Innovation & Zukunft |
| 20 | Aries | Anfang & Energie |
| 21 | Ophiuchus | Heilung & Ganzheit |

### Hinweis-System (Clues)

**Akt 2 Clues** (Kapitel 8–13, je Signatur-Rätsel):
- Ch8: MUT, Ch9: TRÄGT, Ch10: DURCH, Ch11: DIE, Ch12: DUNKLE, Ch13: NACHT
- Ch14 Meta-Rätsel: "Mut trägt durch die dunkle Nacht"

**Akt 3 Clues** (Kapitel 15–20, je Signatur-Rätsel):
- Ch15: FÜR, Ch16: IMMER, Ch17: VEREINT, Ch18: IM, Ch19: STERNEN, Ch20: GLANZ
- Ch21 Grand-Meta-Rätsel: Kombiniert alle 3 Akt-Antworten

### SkyMap-Erweiterung

Statt 7 Knoten auf einer Karte: **3 Akt-Tabs** mit je 7 Sternbildern.
- Akt 2 wird freigeschaltet wenn Akt 1 komplett
- Akt 3 wird freigeschaltet wenn Akt 2 komplett
- Jeder Akt zeigt dieselbe 7-Knoten-Karte mit eigenen Positionen

### Rätsel-Verteilung (alle 28 Puzzle-Typen werden wiederverwendet)

Jedes Kapitel hat 4 Rätsel (1 Signatur + 3 reguläre). Alle existierenden Puzzle-Komponenten werden mit neuen Daten befüllt. Schwierigkeit steigt pro Akt:

- **Akt 1**: Einfache Varianten (existiert)
- **Akt 2**: Mittlere Varianten (größere Grids, mehr Schritte, schwierigere Fragen)
- **Akt 3**: Schwere Varianten (maximale Komplexität)

### Story-Texte

Jedes Kapitel hat:
- `storyIntro`: 2-3 Sätze Einleitung
- `storyOutro`: 2-3 Sätze Abschluss
- Thematisch passend zum Sternbild

### Finale

Das Finale zeigt nach Abschluss aller 3 Akte:
- Alle 21 Sternbilder als vollständige Himmelskarte
- Alle 3 Meta-Sätze als zusammenhängendes Gedicht
- Persönliche Widmung

## Zu ändernde Dateien

1. **`src/data/chapters.ts`** — 14 neue Kapitel mit 56 Rätseln
2. **`src/screens/SkyMap.tsx`** — Akt-Tabs, 3×7 Konstellationen
3. **`src/screens/SkyMap.module.css`** — Styling für Akt-Tabs
4. **`src/screens/ConstellationReveal.tsx`** — 14 neue Star-Patterns
5. **`src/screens/Finale.tsx`** — 21 Sternbilder, 3 Meta-Sätze
6. **`src/screens/Finale.module.css`** — Erweitertes Finale-Layout
7. **`src/puzzles/MetaPuzzle.tsx`** — Support für Akt-2/3 Meta-Rätsel (verschiedene cluesByChapter Ranges)
8. **`src/context/GameContext.tsx`** — `isActComplete()`, `isActUnlocked()` Helper
9. **Tests** — Alle Tests aktualisieren
