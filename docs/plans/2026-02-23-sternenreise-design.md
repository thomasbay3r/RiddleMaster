# Sternenreise — Game Design Document

## Konzept

Ein kapitelbasiertes Rätselspiel als Geschenk. Die Spielerin erwacht in einem Observatorium unter einem dunklen Nachthimmel. Die Sterne sind erloschen — nur durch das Lösen von Rätseln können die Sternbilder wieder zum Leuchten gebracht werden.

## Story & Struktur

7 Kapitel = 7 Sternbilder. Kapitel werden nacheinander freigeschaltet. Innerhalb eines Kapitels sind 3-4 Rätsel frei wählbar. Alle lösen → Sternbild leuchtet auf → nächstes Kapitel wird freigeschaltet. Finale: Alle 7 Sternbilder leuchten, persönliche Botschaft erscheint.

## Kapitel & Rätselverteilung

### Kapitel 1 — Lyra (Musik & Harmonie)
- **Signature: Melodie-Sequenz** — Sterne spielen Töne, Reihenfolge merken und nachspielen
- Verbindungen finden — 16 Begriffe in 4 thematische Gruppen sortieren
- Labyrinth — Weg durch einen leuchtenden Sternennebel finden
- Wortkette — Jedes Wort beginnt mit dem letzten Buchstaben des vorherigen

### Kapitel 2 — Ursa Minor (Orientierung & Heimat)
- **Signature: Sternbild-Kompass** — Richtungsanweisungen folgen um einen versteckten Stern zu finden
- Kreuzworträtsel — Himmelskörper und Mythologie
- Memory — Sternbild-Paare aufdecken
- Zahlenfolge — Kosmische Muster erkennen und fortsetzen

### Kapitel 3 — Cassiopeia (Spiegelungen & Symmetrie)
- **Signature: Symmetrie-Puzzle** — Halbiertes Sternenmuster symmetrisch vervollständigen
- Anagramm — Buchstaben zu Sternbild-Namen sortieren
- Schiebepuzzle — Kacheln verschieben um ein Himmelsbild zu ordnen
- Unterschiede finden — Zwei fast identische Himmelsbilder vergleichen

### Kapitel 4 — Orion (Jagd & Strategie)
- **Signature: Logik-Deduktion** — Einstein-Rätsel: Welcher Stern gehört zu welchem Planeten?
- Rebus / Bilderrätsel — Bildfolge ergibt einen kosmischen Begriff
- Nonogramm — Pixel-Art eines Sternbilds durch Zahlenhinweise freilegen
- Wortsuche — Versteckte Wörter in einem Buchstabengitter finden

### Kapitel 5 — Cygnus (Verwandlung & Metamorphose)
- **Signature: Chiffre knacken** — Caesar-Verschlüsselung einer kosmischen Botschaft lösen
- Jigsaw-Puzzle — Fragmentiertes Sternenbild zusammensetzen
- Sternen-Sudoku — 6x6 mit Sternsymbolen statt Zahlen
- Pipe-Puzzle — Leitungen drehen um Sternenlicht-Bahnen zu verbinden

### Kapitel 6 — Draco (Altes Wissen & Rätsel)
- **Signature: Wissens-Quiz** — Multiple-Choice über Sterne, Mythologie, Universum
- Morse-Code — Blinkende Sterne entschlüsseln zu einer Botschaft
- Tangram — Geometrische Formen zu einem Drachen-Sternbild legen
- Silbenrätsel — Silben zu astronomischen Begriffen kombinieren

### Kapitel 7 — Corona Borealis (Krone & Vollendung)
- **Signature: Meta-Rätsel** — Hinweise aus allen Kapiteln zu einem finalen Code kombinieren
- Simon Says — Leuchtende Sternensequenz merken und wiedergeben
- Sortier-Rätsel — Himmelskörper in die richtige Reihenfolge bringen
- Bilderrätsel — Aus Details aller Kapitelbilder einen letzten Begriff entdecken

## Techstack

- **Frontend:** React + Vite + TypeScript
- **Styling:** CSS Modules, Farbpalette Nachtblau/Violett/Gold/Silber/Cyan
- **Animationen:** Framer Motion + Canvas-Sternenhimmel
- **Audio:** Howler.js, royalty-free Ambient-Musik + Soundeffekte
- **Bilder:** ~40-50 Bilder via NanoBanana generiert
- **Hosting:** Cloudflare Pages
- **Backend:** Cloudflare Worker (API)
- **Datenbank:** Cloudflare D1
- **Fonts:** Cinzel (Headlines), Inter (Body)

## Datenmodell (D1)

```sql
players
  id         TEXT PRIMARY KEY (UUID)
  name       TEXT UNIQUE
  created_at TIMESTAMP

progress
  id         TEXT PRIMARY KEY
  player_id  TEXT → players.id
  chapter    INTEGER (1-7)
  puzzle     INTEGER (1-4)
  solved     BOOLEAN
  hints_used INTEGER (0-2)
  solved_at  TIMESTAMP

collected_clues
  id         TEXT PRIMARY KEY
  player_id  TEXT → players.id
  chapter    INTEGER
  clue_text  TEXT
  collected_at TIMESTAMP
```

## API (Cloudflare Worker)

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| POST | `/api/player` | Spieler anlegen oder laden |
| GET | `/api/progress/:playerId` | Fortschritt laden |
| POST | `/api/progress` | Rätsel als gelöst markieren |
| POST | `/api/clue` | Meta-Rätsel-Hinweis speichern |

## UI Screens

1. **Startscreen** — Titel, Namenseingabe, animierter Himmel
2. **Himmelskarte** — 7 Sternbilder, Fortschritt sichtbar
3. **Kapitel-Intro** — Generiertes Bild + Story-Text
4. **Rätselauswahl** — Rätsel als leuchtende Sterne
5. **Rätsel-Screen** — Rätsel + Hinweis-Button + Hintergrundbild
6. **Rätsel gelöst** — Sternenstaub-Animation + Nachricht
7. **Sternbild-Enthüllung** — Verbindungslinien zeichnen sich golden
8. **Finale** — Alle Sternbilder leuchten, persönliche Botschaft

## Hinweis-System

2 Hinweise pro Rätsel, kostenlos, kein Bestrafungssystem. Entspanntes Spielerlebnis.

## Sound

- Ambient-Soundtrack pro Kapitel (leicht variiert)
- Klick: sanftes Chime
- Gelöst: harmonischer Akkord + Sternenstaub
- Lautstärkeregler + Mute jederzeit sichtbar
