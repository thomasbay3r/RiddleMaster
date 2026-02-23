import type { ChapterDef } from "../types.ts";

/**
 * Act 3 — Die Vollendung (Chapters 15-21)
 * Hard difficulty, clues: F\u00dcR, IMMER, VEREINT, IM, STERNEN, GLANZ
 * Meta answer: "F\u00fcr immer vereint im Sternenglanz"
 */
const act3Chapters: ChapterDef[] = [
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 15 \u2014 Hydra (Ausdauer & Unendlichkeit)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 15,
    name: "Hydra",
    constellation: "Hydra",
    theme: "Ausdauer & Unendlichkeit",
    storyIntro:
      "Die Hydra, das l\u00e4ngste Sternbild am Himmel, windet sich unendlich durch die Nacht. " +
      "F\u00fcr jeden Kopf, den man ihr abschl\u00e4gt, wachsen zwei neue nach. " +
      "Nur mit Ausdauer und Beharrlichkeit kann man ihre R\u00e4tsel l\u00f6sen.",
    storyOutro:
      "Die Hydra erstreckt sich in voller L\u00e4nge \u00fcber den S\u00fcdhimmel! " +
      "Ihre unz\u00e4hligen Sterne leuchten in sanftem Schimmer und erinnern an die Kraft der Ausdauer.",
    introImage: "/images/chapter15-hydra.png",
    puzzles: [
      {
        id: "ch15-cipher",
        chapter: 15,
        puzzleIndex: 1,
        type: "cipher",
        title: "Chiffre knacken",
        description:
          "Die Hydra fl\u00fcstert verschl\u00fcsselt \u2014 knacke ihre Caesar-Chiffre.",
        isSignature: true,
        data: {
          encrypted: "IXU LPPHU YHUHLQW LP VWHUQHQJODQC",
          shift: 3,
          decrypted: "F\u00dcR IMMER VEREINT IM STERNENGLANZ",
          keyword: "VEREINT",
        },
        hints: [
          "Die Verschiebung betr\u00e4gt drei Buchstaben.",
          "Das zweite Wort hat f\u00fcnf Buchstaben und bedeutet 'f\u00fcr alle Zeit'.",
        ],
        clue: "F\u00dcR",
        backgroundImage: "/images/puzzle-bg-ch15.png",
      },
      {
        id: "ch15-connections",
        chapter: 15,
        puzzleIndex: 2,
        type: "connections",
        title: "Verbindungen finden",
        description:
          "Sortiere 16 Begriffe \u00fcber Ausdauer und Unendlichkeit in vier Gruppen.",
        isSignature: false,
        data: {
          groups: [
            {
              label: "Zeitbegriffe",
              words: ["Ewigkeit", "\u00c4on", "Epoche", "Millennium"],
              color: "#ffd700",
            },
            {
              label: "Ausdauersport",
              words: ["Marathon", "Triathlon", "Ultramarathon", "Ironman"],
              color: "#00d4ff",
            },
            {
              label: "Mathematische Symbole",
              words: ["Unendlich", "Pi", "Fibonacci", "Fraktal"],
              color: "#9b59b6",
            },
            {
              label: "Mythische Kreaturen",
              words: ["Hydra", "Ph\u00f6nix", "Ouroboros", "Cerberus"],
              color: "#c0c0e0",
            },
          ],
        },
        hints: [
          "Marathon, Triathlon und Ironman sind alles Ausdauersportarten.",
          "Der Ouroboros ist die Schlange, die sich selbst in den Schwanz bei\u00dft.",
        ],
        backgroundImage: "/images/puzzle-bg-ch15.png",
      },
      {
        id: "ch15-maze",
        chapter: 15,
        puzzleIndex: 3,
        type: "maze",
        title: "Labyrinth",
        description:
          "Winde dich wie die Hydra durch dieses verschlungene Labyrinth.",
        isSignature: false,
        data: {
          grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          ],
          start: [1, 1],
          end: [13, 13],
        },
        hints: [
          "Folge dem Weg schl\u00e4ngelnd wie die Hydra selbst.",
          "Der l\u00e4ngste Korridor verläuft durch die Mitte.",
        ],
        backgroundImage: "/images/puzzle-bg-ch15.png",
      },
      {
        id: "ch15-wordchain",
        chapter: 15,
        puzzleIndex: 4,
        type: "word-chain",
        title: "Wortkette",
        description:
          "Bilde eine Kette von KRAFT zu GEIST.",
        isSignature: false,
        data: {
          startWord: "KRAFT",
          targetWord: "GEIST",
          steps: 3,
          validWords: [
            "KRAFT", "GEIST", "TURM", "TIGER", "ROSE", "ENGEL", "LEIER",
            "TRAUM", "MAGNET", "NACHT", "TROPFEN", "NEBEL", "LICHT",
            "STROM", "MOND", "DIAMANT", "GIPFEL", "REGEN",
          ],
        },
        hints: [
          "KRAFT endet auf T \u2014 suche ein Wort, das mit T beginnt.",
          "GEIST beginnt mit G \u2014 dein vorletztes Wort muss auf G enden.",
        ],
        backgroundImage: "/images/puzzle-bg-ch15.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 16 \u2014 Sagittarius (Ziel & Wahrheit)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 16,
    name: "Sagittarius",
    constellation: "Sagittarius",
    theme: "Ziel & Wahrheit",
    storyIntro:
      "Der Sch\u00fctze Sagittarius zielt mit seinem Bogen stets auf die Wahrheit. " +
      "Sein Pfeil durchbohrt T\u00e4uschung und Illusion, doch die Zielscheibe ist in Nebel geh\u00fcllt. " +
      "Finde das wahre Ziel und lass den Pfeil sein Ziel treffen.",
    storyOutro:
      "Der Pfeil des Sch\u00fctzen trifft sein Ziel! Sagittarius steht stolz am Himmel " +
      "und zeigt in Richtung des galaktischen Zentrums, dem Herzen der Milchstra\u00dfe.",
    introImage: "/images/chapter16-sagittarius.png",
    puzzles: [
      {
        id: "ch16-compass",
        chapter: 16,
        puzzleIndex: 1,
        type: "star-compass",
        title: "Sternbild-Kompass",
        description:
          "Folge dem Pfeil des Sch\u00fctzen durch die Sternenkarte.",
        isSignature: true,
        data: {
          gridSize: 8,
          start: [3, 0],
          instructions: [
            { direction: "Osten", steps: 3 },
            { direction: "S\u00fcden", steps: 2 },
            { direction: "Osten", steps: 2 },
            { direction: "Norden", steps: 3 },
            { direction: "Osten", steps: 1 },
          ],
          answer: [2, 6],
        },
        hints: [
          "Der Pfeil fliegt erst nach rechts, dann nach unten.",
          "Die letzten zwei Schritte f\u00fchren nach oben und dann kurz nach rechts.",
        ],
        clue: "IMMER",
        backgroundImage: "/images/puzzle-bg-ch16.png",
      },
      {
        id: "ch16-crossword",
        chapter: 16,
        puzzleIndex: 2,
        type: "crossword",
        title: "Kreuzwortr\u00e4tsel",
        description:
          "L\u00f6se Begriffe rund um Ziele, Pfeile und Wahrheit.",
        isSignature: false,
        data: {
          grid: [
            ["P", "F", "E", "I", "L", ".", "."],
            [".", ".", ".", ".", ".", ".", "."],
            ["B", "O", "G", "E", "N", ".", "."],
            [".", ".", ".", ".", ".", ".", "."],
            ["Z", "I", "E", "L", ".", "W", "."],
            [".", ".", ".", ".", ".", "A", "."],
            [".", ".", ".", ".", ".", "H", "R"],
          ],
          emptyGrid: [
            [" ", " ", " ", " ", " ", ".", "."],
            [".", ".", ".", ".", ".", ".", "."],
            [" ", " ", " ", " ", " ", ".", "."],
            [".", ".", ".", ".", ".", ".", "."],
            [" ", " ", " ", " ", ".", " ", "."],
            [".", ".", ".", ".", ".", " ", "."],
            [".", ".", ".", ".", ".", " ", " "],
          ],
          clues: {
            across: [
              { number: 1, row: 0, col: 0, length: 5, text: "Geschoss des Sch\u00fctzen (5)", answer: "PFEIL" },
              { number: 2, row: 2, col: 0, length: 5, text: "Waffe des Sagittarius (5)", answer: "BOGEN" },
              { number: 3, row: 4, col: 0, length: 4, text: "Wohin man schie\u00dft (4)", answer: "ZIEL" },
            ],
            down: [
              { number: 4, row: 4, col: 5, length: 4, text: "Gegenteil von Falschheit (4)", answer: "WAHR" },
            ],
          },
        },
        hints: [
          "1 waagerecht: Was fliegt aus dem Bogen?",
          "4 senkrecht beginnt in Zeile 5 \u2014 Gegenteil von 'falsch'.",
        ],
        backgroundImage: "/images/puzzle-bg-ch16.png",
      },
      {
        id: "ch16-memory",
        chapter: 16,
        puzzleIndex: 3,
        type: "memory",
        title: "Memory",
        description:
          "Finde die Paare aus Tierkreiszeichen und ihren Symbolen.",
        isSignature: false,
        data: {
          pairs: [
            { id: 1, name: "Widder", symbol: "\u2648" },
            { id: 2, name: "Stier", symbol: "\u2649" },
            { id: 3, name: "Zwillinge", symbol: "\u264A" },
            { id: 4, name: "Krebs", symbol: "\u264B" },
            { id: 5, name: "L\u00f6we", symbol: "\u264C" },
            { id: 6, name: "Jungfrau", symbol: "\u264D" },
            { id: 7, name: "Sch\u00fctze", symbol: "\u2650" },
            { id: 8, name: "Steinbock", symbol: "\u2651" },
          ],
        },
        hints: [
          "Die Tierkreiszeichen folgen einer bestimmten Reihenfolge.",
          "Sagittarius ist der Sch\u00fctze \u2014 sein Symbol ist ein Pfeil.",
        ],
        backgroundImage: "/images/puzzle-bg-ch16.png",
      },
      {
        id: "ch16-numbers",
        chapter: 16,
        puzzleIndex: 4,
        type: "number-sequence",
        title: "Zahlenfolge",
        description:
          "Finde die Muster in diesen kosmischen Zahlenreihen.",
        isSignature: false,
        data: {
          sequences: [
            { shown: [1, 3, 6, 10, 15], answers: [21, 28], hint: "Dreieckszahlen: +2, +3, +4, +5 ..." },
            { shown: [2, 3, 5, 7, 11], answers: [13, 17], hint: "Primzahlen" },
            { shown: [1, 8, 27, 64, 125], answers: [216, 343], hint: "Kubikzahlen: 1\u00b3, 2\u00b3, 3\u00b3 ..." },
          ],
        },
        hints: [
          "Die erste Folge addiert aufsteigende Zahlen: +2, +3, +4 ...",
          "Die dritte Folge besteht aus Kubikzahlen: 1\u00b3 = 1, 2\u00b3 = 8, 3\u00b3 = 27 ...",
        ],
        backgroundImage: "/images/puzzle-bg-ch16.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 17 \u2014 Leo (St\u00e4rke & K\u00f6nigtum)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 17,
    name: "Leo",
    constellation: "Leo",
    theme: "St\u00e4rke & K\u00f6nigtum",
    storyIntro:
      "Der m\u00e4chtige L\u00f6we Leo herrscht \u00fcber den Himmel wie ein K\u00f6nig \u00fcber sein Reich. " +
      "Sein Stern Regulus, das \u201eHerz des L\u00f6wen\u201c, war einst ein Leuchtfeuer der St\u00e4rke. " +
      "Doch seine M\u00e4hne ist erloschen und nur Logik kann seine Kraft wiederherstellen.",
    storyOutro:
      "Leo br\u00fcllt in k\u00f6niglicher Pracht! Regulus leuchtet wie ein funkelndes Juwel " +
      "und der L\u00f6we beherrscht wieder majest\u00e4tisch den Fr\u00fchlingshimmel.",
    introImage: "/images/chapter17-leo.png",
    puzzles: [
      {
        id: "ch17-logic",
        chapter: 17,
        puzzleIndex: 1,
        type: "logic-deduction",
        title: "Logik-Deduktion",
        description:
          "Ordne den vier K\u00f6nigen ihre Reiche und Symbole zu.",
        isSignature: true,
        data: {
          stars: ["L\u00f6we", "Adler", "Stier", "Schlange"],
          categories: {
            color: ["Norden", "S\u00fcden", "Osten", "Westen"],
            planet: ["Krone", "Schwert", "Schild", "Zepter"],
          },
          solution: {
            "L\u00f6we": { color: "Norden", planet: "Krone" },
            "Adler": { color: "Osten", planet: "Zepter" },
            "Stier": { color: "S\u00fcden", planet: "Schild" },
            "Schlange": { color: "Westen", planet: "Schwert" },
          },
          clues: [
            "Der L\u00f6we herrscht im Norden und tr\u00e4gt die Krone.",
            "Der Adler ist nicht im S\u00fcden.",
            "Das Schwert geh\u00f6rt dem Herrscher des Westens.",
            "Der Stier tr\u00e4gt den Schild.",
            "Das Zepter geh\u00f6rt nicht dem L\u00f6wen.",
            "Die Schlange herrscht im Westen.",
          ],
        },
        hints: [
          "Der L\u00f6we hat die Krone \u2014 beginne damit.",
          "Wenn die Schlange im Westen ist und das Schwert dem Westen geh\u00f6rt...",
        ],
        clue: "VEREINT",
        backgroundImage: "/images/puzzle-bg-ch17.png",
      },
      {
        id: "ch17-anagram",
        chapter: 17,
        puzzleIndex: 2,
        type: "anagram",
        title: "Anagramm",
        description:
          "Ordne die durcheinander geratenen Buchstaben zu Begriffen der K\u00f6nigsmacht.",
        isSignature: false,
        data: {
          words: [
            { scrambled: "NOEKR", answer: "KRONE" },
            { scrambled: "NHTRO", answer: "THRON" },
            { scrambled: "RETZPE", answer: "ZEPTER" },
            { scrambled: "AHCMTSE\u00c4TJT", answer: "MAJEST\u00c4T" },
          ],
        },
        hints: [
          "Das erste Wort hat f\u00fcnf Buchstaben und passt auf einen K\u00f6nigskopf.",
          "Das letzte Wort ist eine Anrede f\u00fcr Herrscher.",
        ],
        backgroundImage: "/images/puzzle-bg-ch17.png",
      },
      {
        id: "ch17-slide",
        chapter: 17,
        puzzleIndex: 3,
        type: "slide-puzzle",
        title: "Schiebepuzzle",
        description:
          "Stelle das L\u00f6wensternbild durch Verschieben der Kacheln wieder her.",
        isSignature: false,
        data: {
          size: 4,
          initial: [1, 2, 3, 4, 5, 10, 7, 8, 9, 0, 6, 12, 13, 14, 11, 15],
        },
        hints: [
          "Die obere Reihe ist korrekt \u2014 konzentriere dich auf die Mitte.",
          "Schiebe zuerst die 6 und 10 an ihre richtige Position.",
        ],
        backgroundImage: "/images/puzzle-bg-ch17.png",
      },
      {
        id: "ch17-spotdiff",
        chapter: 17,
        puzzleIndex: 4,
        type: "spot-difference",
        title: "Unterschiede finden",
        description:
          "Vergleiche zwei Darstellungen des L\u00f6wensternbilds und finde die Unterschiede.",
        isSignature: false,
        data: {
          canvasWidth: 400,
          canvasHeight: 300,
          differences: [
            { x: 100, y: 70, radius: 22, description: "Stern fehlt" },
            { x: 250, y: 50, radius: 20, description: "Andere Gr\u00f6\u00dfe" },
            { x: 350, y: 120, radius: 22, description: "Farbe ge\u00e4ndert" },
            { x: 80, y: 230, radius: 25, description: "Zus\u00e4tzlicher Stern" },
            { x: 300, y: 240, radius: 20, description: "Linie fehlt" },
          ],
          stars: [
            { x: 100, y: 70, size: 4, color: "#ffd700" },
            { x: 170, y: 40, size: 3, color: "#ffffff" },
            { x: 250, y: 50, size: 3, color: "#ffffff" },
            { x: 300, y: 100, size: 2, color: "#ffffff" },
            { x: 200, y: 150, size: 4, color: "#ffd700" },
            { x: 120, y: 200, size: 2, color: "#ffffff" },
            { x: 280, y: 200, size: 3, color: "#ffffff" },
          ],
        },
        hints: [
          "Regulus (der hellste Stern) hat in einem Bild eine andere Farbe.",
          "In der unteren H\u00e4lfte fehlt in einem Bild eine Verbindungslinie.",
        ],
        backgroundImage: "/images/puzzle-bg-ch17.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 18 \u2014 Virgo (Reinheit & Ernte)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 18,
    name: "Virgo",
    constellation: "Virgo",
    theme: "Reinheit & Ernte",
    storyIntro:
      "Die Jungfrau Virgo, G\u00f6ttin der Ernte und Reinheit, h\u00e4lt eine \u00c4hre in der Hand. " +
      "Ihr Stern Spica leuchtet wie reifes Gold in der Abendd\u00e4mmerung. " +
      "Doch die Felder sind vertrocknet und nur kluges Handeln kann die Ernte retten.",
    storyOutro:
      "Virgo strahlt in reinem Glanz! Spica funkelt golden wie eine reife Weizenähre " +
      "und die Jungfrau segnet den Himmel mit F\u00fclle und Reinheit.",
    introImage: "/images/chapter18-virgo.png",
    puzzles: [
      {
        id: "ch18-symmetry",
        chapter: 18,
        puzzleIndex: 1,
        type: "symmetry",
        title: "Symmetrie-Puzzle",
        description:
          "Vervollst\u00e4ndige das Erntemuster zu einer perfekten Symmetrie.",
        isSignature: true,
        data: {
          gridSize: 10,
          pattern: [
            [0, 4],
            [1, 3], [1, 4],
            [2, 2], [2, 3], [2, 4],
            [3, 1], [3, 2], [3, 3], [3, 4],
            [4, 1], [4, 4],
            [5, 1], [5, 4],
            [6, 2], [6, 3],
            [7, 3],
          ],
        },
        hints: [
          "Die Spiegelachse liegt in der Mitte des Gitters.",
          "Die Form erinnert an eine \u00c4hre \u2014 unten schmal, oben breit.",
        ],
        clue: "IM",
        backgroundImage: "/images/puzzle-bg-ch18.png",
      },
      {
        id: "ch18-rebus",
        chapter: 18,
        puzzleIndex: 2,
        type: "rebus",
        title: "Rebus / Bilderr\u00e4tsel",
        description:
          "Entschl\u00fcssle die Bildfolgen zu Begriffen der Natur und Ernte.",
        isSignature: false,
        data: {
          rebuses: [
            { display: "\uD83C\uDF3E + \uD83C\uDF1E = ?", answer: "ERNTE", hint: "Was die \u00c4hre unter der Sonne bringt..." },
            { display: "\uD83C\uDF3C + \uD83D\uDCA7 = ?", answer: "BL\u00dcTE", hint: "Was die Blume nach dem Regen tut..." },
            { display: "\uD83C\uDF0D + \u2B50 = ?", answer: "ERDE", hint: "Unser Planet..." },
            { display: "\uD83C\uDF43 + \u2744\uFE0F = ?", answer: "HERBST", hint: "Wenn die Bl\u00e4tter fallen..." },
          ],
        },
        hints: [
          "Das erste Bild zeigt eine \u00c4hre und die Sonne.",
          "Die Jahreszeit nach dem Sommer...",
        ],
        backgroundImage: "/images/puzzle-bg-ch18.png",
      },
      {
        id: "ch18-nonogram",
        chapter: 18,
        puzzleIndex: 3,
        type: "nonogram",
        title: "Nonogramm",
        description:
          "Enth\u00fclle das verborgene Sternsymbol der Jungfrau.",
        isSignature: false,
        data: {
          size: 8,
          solution: [
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 0, 0],
            [1, 0, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0],
          ],
          rowHints: [[1], [3], [1], [5], [1, 1, 1], [1], [1, 1], [1, 1]],
          colHints: [[1], [1, 1], [1, 1, 1], [5], [1, 1, 1], [1, 1], [1], []],
        },
        hints: [
          "Die mittlere Spalte hat die meisten gef\u00fcllten Zellen.",
          "Das Muster ergibt ein Symbol \u2014 \u00e4hnlich einem Kreuz mit Verzweigungen.",
        ],
        backgroundImage: "/images/puzzle-bg-ch18.png",
      },
      {
        id: "ch18-wordsearch",
        chapter: 18,
        puzzleIndex: 4,
        type: "word-search",
        title: "Wortsuche",
        description:
          "Finde die versteckten Ernte- und Naturbegriffe.",
        isSignature: false,
        data: {
          gridSize: 10,
          words: ["WEIZEN", "SPICA", "ERNTE", "SONNE", "ERDE", "KORN"],
          grid: [
            ["W", "E", "I", "Z", "E", "N", "A", "B", "C", "D"],
            ["S", "P", "I", "C", "A", "E", "F", "G", "H", "I"],
            ["E", "R", "N", "T", "E", "J", "K", "L", "M", "N"],
            ["O", "P", "Q", "R", "S", "O", "N", "N", "E", "T"],
            ["U", "V", "W", "X", "Y", "Z", "A", "B", "C", "D"],
            ["E", "R", "D", "E", "F", "G", "H", "I", "J", "K"],
            ["L", "M", "N", "O", "K", "O", "R", "N", "P", "Q"],
            ["R", "S", "T", "U", "V", "W", "X", "Y", "Z", "A"],
            ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K"],
            ["L", "M", "N", "O", "P", "Q", "R", "S", "T", "U"],
          ],
          wordPositions: {
            WEIZEN: [0, 0, 0, 5],
            SPICA: [1, 0, 1, 4],
            ERNTE: [2, 0, 2, 4],
            SONNE: [3, 4, 3, 8],
            ERDE: [5, 0, 5, 3],
            KORN: [6, 4, 6, 7],
          },
        },
        hints: [
          "WEIZEN befindet sich ganz oben \u2014 eine horizontale Reihe.",
          "SPICA ist Virgos hellster Stern \u2014 suche in der zweiten Zeile.",
        ],
        backgroundImage: "/images/puzzle-bg-ch18.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 19 \u2014 Aquarius (Wasser & Erneuerung)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 19,
    name: "Aquarius",
    constellation: "Aquarius",
    theme: "Wasser & Erneuerung",
    storyIntro:
      "Der Wassertr\u00e4ger Aquarius gie\u00dft seit Anbeginn der Zeit den kosmischen Strom \u00fcber den Himmel. " +
      "Sein Wasser reinigt und erneuert, doch die Quelle ist versiegt " +
      "und nur wer die R\u00e4tsel l\u00f6st, kann den Strom wieder flie\u00dfen lassen.",
    storyOutro:
      "Aquarius gie\u00dft seinen kosmischen Strom \u00fcber den Himmel! " +
      "Die Wasser des Wassertr\u00e4gers flie\u00dfen erneut und erneuern die Sterne mit frischer Kraft.",
    introImage: "/images/chapter19-aquarius.png",
    puzzles: [
      {
        id: "ch19-melody",
        chapter: 19,
        puzzleIndex: 1,
        type: "melody-sequence",
        title: "Melodie-Sequenz",
        description:
          "Das Wasser des Aquarius plätschert in einer Melodie. Merke dir die Reihenfolge.",
        isSignature: true,
        data: {
          sequence: [1, 4, 2, 5, 0, 3, 6],
          starPositions: [
            { x: 20, y: 50 },
            { x: 35, y: 25 },
            { x: 50, y: 40 },
            { x: 50, y: 70 },
            { x: 65, y: 20 },
            { x: 75, y: 55 },
            { x: 90, y: 35 },
          ],
        },
        hints: [
          "Die Melodie beginnt mit dem zweiten Stern von links.",
          "Das Muster springt abwechselnd zwischen oberer und unterer Reihe.",
        ],
        clue: "STERNEN",
        backgroundImage: "/images/puzzle-bg-ch19.png",
      },
      {
        id: "ch19-morse",
        chapter: 19,
        puzzleIndex: 2,
        type: "morse-code",
        title: "Morse-Code",
        description:
          "Das Pl\u00e4tschern des Wassers enth\u00e4lt eine verschl\u00fcsselte Botschaft.",
        isSignature: false,
        data: {
          message: "WASSER",
          morseMap: {
            "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".",
            "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---",
            "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---",
            "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-",
            "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", "Z": "--..",
          },
        },
        hints: [
          "Die Nachricht hat sechs Buchstaben und beginnt mit W.",
          "Es ist das Element des Aquarius.",
        ],
        backgroundImage: "/images/puzzle-bg-ch19.png",
      },
      {
        id: "ch19-jigsaw",
        chapter: 19,
        puzzleIndex: 3,
        type: "jigsaw",
        title: "Jigsaw-Puzzle",
        description:
          "Setze die Teile zusammen, um den kosmischen Wasserfall zu enth\u00fcllen.",
        isSignature: false,
        data: {
          gridSize: 3,
          pieces: [
            { id: 0, symbol: "\u2248", gradient: "linear-gradient(135deg, #0a2463, #1a3a5c)" },
            { id: 1, symbol: "\u223C", gradient: "linear-gradient(135deg, #1a3a5c, #0a4463)" },
            { id: 2, symbol: "\u2245", gradient: "linear-gradient(135deg, #0a4463, #1a5a7c)" },
            { id: 3, symbol: "\u2261", gradient: "linear-gradient(135deg, #1a5a7c, #0a2463)" },
            { id: 4, symbol: "\u00B1", gradient: "linear-gradient(135deg, #0a3453, #1a4a6c)" },
            { id: 5, symbol: "\u221E", gradient: "linear-gradient(135deg, #1a4a6c, #0a5473)" },
            { id: 6, symbol: "\u2200", gradient: "linear-gradient(135deg, #0a5473, #1a3a5c)" },
            { id: 7, symbol: "\u2203", gradient: "linear-gradient(135deg, #1a2453, #0a3463)" },
            { id: 8, symbol: "\u2207", gradient: "linear-gradient(135deg, #0a2453, #1a5a7c)" },
          ],
          initialShuffle: [3, 7, 1, 8, 4, 5, 0, 2, 6],
        },
        hints: [
          "Die Randst\u00fccke haben dunklere Farbt\u00f6ne.",
          "Das Unendlichkeitszeichen (\u221E) geh\u00f6rt in die Mitte rechts.",
        ],
        backgroundImage: "/images/puzzle-bg-ch19.png",
      },
      {
        id: "ch19-pipes",
        chapter: 19,
        puzzleIndex: 4,
        type: "pipe-puzzle",
        title: "Pipe-Puzzle",
        description:
          "Verbinde die Wasserrohre, um den Strom vom Quell zum Ozean flie\u00dfen zu lassen.",
        isSignature: false,
        data: {
          gridSize: 5,
          source: [0, 0],
          target: [4, 4],
          pipes: [
            [{ type: "corner", correct: 90, initial: 0 }, { type: "straight", correct: 0, initial: 90 }, { type: "straight", correct: 0, initial: 0 }, { type: "corner", correct: 180, initial: 90 }, { type: "empty", correct: 0, initial: 0 }],
            [{ type: "straight", correct: 90, initial: 0 }, { type: "empty", correct: 0, initial: 0 }, { type: "empty", correct: 0, initial: 0 }, { type: "straight", correct: 90, initial: 90 }, { type: "empty", correct: 0, initial: 0 }],
            [{ type: "corner", correct: 0, initial: 180 }, { type: "straight", correct: 0, initial: 90 }, { type: "tee", correct: 90, initial: 270 }, { type: "corner", correct: 270, initial: 0 }, { type: "empty", correct: 0, initial: 0 }],
            [{ type: "empty", correct: 0, initial: 0 }, { type: "empty", correct: 0, initial: 0 }, { type: "straight", correct: 90, initial: 0 }, { type: "empty", correct: 0, initial: 0 }, { type: "empty", correct: 0, initial: 0 }],
            [{ type: "empty", correct: 0, initial: 0 }, { type: "empty", correct: 0, initial: 0 }, { type: "corner", correct: 0, initial: 90 }, { type: "straight", correct: 0, initial: 0 }, { type: "corner", correct: 270, initial: 180 }],
          ],
        },
        hints: [
          "Das Wasser flie\u00dft zuerst nach rechts, dann nach unten.",
          "In der Mitte gibt es ein T-St\u00fcck, das in mehrere Richtungen verbindet.",
        ],
        backgroundImage: "/images/puzzle-bg-ch19.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 20 \u2014 Aries (Anfang & Energie)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 20,
    name: "Aries",
    constellation: "Aries",
    theme: "Anfang & Energie",
    storyIntro:
      "Der Widder Aries steht am Anfang des Tierkreises, ein Symbol roher Energie und Neuanfang. " +
      "Sein goldenes Vlies war einst der gr\u00f6\u00dfte Schatz der Welt. " +
      "Doch die Flamme seines Geistes ist erloschen und wartet auf Entfachung.",
    storyOutro:
      "Aries st\u00fcrmt mit ungeb\u00e4ndigter Energie voran! Der Widder erstrahlt am Fr\u00fchlingshimmel " +
      "und verk\u00fcndet den Beginn eines neuen kosmischen Zyklus.",
    introImage: "/images/chapter20-aries.png",
    puzzles: [
      {
        id: "ch20-quiz",
        chapter: 20,
        puzzleIndex: 1,
        type: "quiz",
        title: "Wissens-Quiz",
        description:
          "Beantworte Fragen \u00fcber Anf\u00e4nge, Energie und kosmische Zyklen.",
        isSignature: true,
        data: {
          requiredCorrect: 6,
          questions: [
            { question: "Welches Sternzeichen beginnt den Tierkreis?", options: ["Fische", "Widder", "Stier", "Wassermann"], correct: 1 },
            { question: "Wie hei\u00dft der Urknall auf Englisch?", options: ["Big Crunch", "Big Bang", "Big Rip", "Big Freeze"], correct: 1 },
            { question: "Welches Tier steht f\u00fcr das Goldene Vlies?", options: ["Stier", "L\u00f6we", "Widder", "Adler"], correct: 2 },
            { question: "Was ist die Hauptenergiequelle der Sonne?", options: ["Kernspaltung", "Kernfusion", "Verbrennung", "Gravitation"], correct: 1 },
            { question: "Wie hei\u00dft die fr\u00fcheste Phase des Universums?", options: ["Planck-\u00c4ra", "Hadron-\u00c4ra", "Lepton-\u00c4ra", "Stellare \u00c4ra"], correct: 0 },
            { question: "Welcher Monat beginnt im Zeichen des Widders?", options: ["Januar", "M\u00e4rz", "Juni", "September"], correct: 1 },
            { question: "Was bedeutet 'Aries' auf Lateinisch?", options: ["Adler", "Widder", "Stier", "L\u00f6we"], correct: 1 },
            { question: "Welches Element hat die h\u00f6chste Energie pro Masse?", options: ["Uran", "Wasserstoff", "Helium", "Lithium"], correct: 1 },
          ],
        },
        hints: [
          "Der Tierkreis beginnt mit dem Fr\u00fchlingspunkt.",
          "Beim Urknall spricht man vom 'Big Bang'.",
        ],
        clue: "GLANZ",
        backgroundImage: "/images/puzzle-bg-ch20.png",
      },
      {
        id: "ch20-tangram",
        chapter: 20,
        puzzleIndex: 2,
        type: "tangram",
        title: "Tangram",
        description:
          "Lege die Formen zu einem Widderkopf zusammen.",
        isSignature: false,
        data: {
          zones: [
            { id: 1, name: "Kopf", path: "M15,15 L30,15 L30,30 L15,30 Z", color: "#ffd700" },
            { id: 2, name: "Linkes Horn", path: "M10,15 L15,15 L12,5 Z", color: "#00d4ff" },
            { id: 3, name: "Rechtes Horn", path: "M30,15 L35,15 L33,5 Z", color: "#9b59b6" },
            { id: 4, name: "Nase", path: "M20,30 L25,30 L22,38 Z", color: "#c0c0e0" },
            { id: 5, name: "Linkes Ohr", path: "M12,20 L15,18 L15,24 Z", color: "#e74c3c" },
            { id: 6, name: "Rechtes Ohr", path: "M30,18 L33,20 L30,24 Z", color: "#2ecc71" },
            { id: 7, name: "Bart", path: "M18,35 L27,35 L22,45 Z", color: "#f39c12" },
          ],
          pieces: [
            { id: 1, label: "\u25A0", matchesZone: 1 },
            { id: 2, label: "\u25C4", matchesZone: 2 },
            { id: 3, label: "\u25BA", matchesZone: 3 },
            { id: 4, label: "\u25BC", matchesZone: 4 },
            { id: 5, label: "\u25C2", matchesZone: 5 },
            { id: 6, label: "\u25B8", matchesZone: 6 },
            { id: 7, label: "\u25BE", matchesZone: 7 },
          ],
        },
        hints: [
          "Das Quadrat bildet den Kopf \u2014 die H\u00f6rner sind die beiden oberen Dreiecke.",
          "Der Bart h\u00e4ngt unter der Nase.",
        ],
        backgroundImage: "/images/puzzle-bg-ch20.png",
      },
      {
        id: "ch20-syllables",
        chapter: 20,
        puzzleIndex: 3,
        type: "syllable-puzzle",
        title: "Silbenr\u00e4tsel",
        description:
          "Kombiniere die Silben zu kosmischen Begriffen \u00fcber Anfang und Energie.",
        isSignature: false,
        data: {
          words: [
            { answer: "URKNALL", syllables: ["UR", "KNALL"] },
            { answer: "ENERGIE", syllables: ["EN", "ER", "GIE"] },
            { answer: "TIERKREIS", syllables: ["TIER", "KREIS"] },
            { answer: "EQUINOX", syllables: ["E", "QUI", "NOX"] },
          ],
          allSyllables: ["UR", "EN", "TIER", "E", "KNALL", "ER", "KREIS", "QUI", "GIE", "NOX"],
        },
        hints: [
          "Der Urknall besteht aus nur zwei Silben.",
          "Equinox ist das lateinische Wort f\u00fcr Tag-und-Nacht-Gleiche.",
        ],
        backgroundImage: "/images/puzzle-bg-ch20.png",
      },
      {
        id: "ch20-sudoku",
        chapter: 20,
        puzzleIndex: 4,
        type: "star-sudoku",
        title: "Sternen-Sudoku",
        description:
          "F\u00fclle das 6x6-Raster mit Sternsymbolen \u2014 jedes Symbol in jeder Zeile und Spalte genau einmal.",
        isSignature: false,
        data: {
          symbols: ["\u2648", "\u2649", "\u264A", "\u264B", "\u264C", "\u264D"],
          given: [
            [0, 2, 0, 0, 5, 0],
            [5, 0, 0, 2, 0, 0],
            [0, 0, 3, 0, 0, 4],
            [2, 0, 0, 5, 0, 0],
            [0, 0, 4, 0, 0, 1],
            [0, 3, 0, 0, 2, 0],
          ],
          solution: [
            [4, 2, 1, 3, 5, 6],
            [5, 6, 2, 4, 1, 3],
            [1, 5, 3, 6, 4, 2],
            [2, 4, 6, 5, 3, 1],
            [3, 1, 4, 2, 6, 5],
            [6, 3, 5, 1, 2, 4],
          ],
        },
        hints: [
          "Beginne mit der Spalte, die schon drei Symbole enth\u00e4lt.",
          "In Zeile 1 fehlen nur noch drei Symbole.",
        ],
        backgroundImage: "/images/puzzle-bg-ch20.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 21 \u2014 Ophiuchus (Heilung & Vollendung) \u2014 META-PUZZLE
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 21,
    name: "Ophiuchus",
    constellation: "Ophiuchus",
    theme: "Heilung & Vollendung",
    storyIntro:
      "Ophiuchus, der Schlangentr\u00e4ger, steht f\u00fcr Heilung und kosmische Vollendung. " +
      "Er ist das 13. Sternbild, das zwischen den Tierkreiszeichen verborgen liegt. " +
      "In ihm vereinen sich alle Lektionen der Sternenreise zu einer letzten, gro\u00dfen Erkenntnis.",
    storyOutro:
      "Ophiuchus erstrahlt in strahlendem Licht! Die Schlange der Weisheit windet sich um den Heiler " +
      "und die finale Botschaft hallt durch den Kosmos: \u201eF\u00fcr immer vereint im Sternenglanz.\u201c",
    introImage: "/images/chapter21-ophiuchus.png",
    puzzles: [
      {
        id: "ch21-meta",
        chapter: 21,
        puzzleIndex: 1,
        type: "meta-puzzle",
        title: "Meta-R\u00e4tsel",
        description:
          "Kombiniere die Hinweise aus Kapitel 15\u201320, um die finale Botschaft zu enth\u00fcllen.",
        isSignature: true,
        data: {
          answer: "F\u00fcr immer vereint im Sternenglanz",
          cluesByChapter: {
            15: "F\u00dcR",
            16: "IMMER",
            17: "VEREINT",
            18: "IM",
            19: "STERNEN",
            20: "GLANZ",
          },
        },
        hints: [
          "Jedes abgeschlossene Kapitel von Akt III hat dir ein Wort offenbart.",
          "Setze die sechs W\u00f6rter in der Reihenfolge der Kapitel 15 bis 20 zusammen.",
        ],
        backgroundImage: "/images/puzzle-bg-ch21.png",
      },
      {
        id: "ch21-simon",
        chapter: 21,
        puzzleIndex: 2,
        type: "simon-says",
        title: "Simon Says",
        description:
          "Die Schlange des Ophiuchus leuchtet in einer kosmischen Sequenz \u2014 wiederhole sie.",
        isSignature: false,
        data: {
          sequence: [0, 3, 1, 4, 2, 3, 0],
          starColors: ["#9b59b6", "#00d4ff", "#ffd700", "#c0c0e0", "#2ecc71"],
          startLength: 4,
          winLength: 7,
        },
        hints: [
          "Die Sequenz beginnt mit der violetten Farbe.",
          "Achte auf wiederholende Muster in der Mitte der Sequenz.",
        ],
        backgroundImage: "/images/puzzle-bg-ch21.png",
      },
      {
        id: "ch21-sorting",
        chapter: 21,
        puzzleIndex: 3,
        type: "sorting",
        title: "Sortier-R\u00e4tsel",
        description:
          "Bringe die kosmischen Elemente in die richtige Reihenfolge.",
        isSignature: false,
        data: {
          rounds: [
            {
              title: "Sortiere die Sternentypen nach Temperatur (hei\u00dfest zuerst)",
              items: ["Roter Zwerg", "Gelber Stern", "Wei\u00dfer Zwerg", "Blauer Riese", "Roter Riese"],
              correctOrder: ["Blauer Riese", "Wei\u00dfer Zwerg", "Gelber Stern", "Roter Riese", "Roter Zwerg"],
            },
            {
              title: "Sortiere die drei Akte der Sternenreise",
              items: ["Die Vollendung", "Die Pr\u00fcfung", "Die Erweckung"],
              correctOrder: ["Die Erweckung", "Die Pr\u00fcfung", "Die Vollendung"],
            },
          ],
        },
        hints: [
          "Blaue Sterne sind die hei\u00dfesten, rote die k\u00e4ltesten.",
          "Die Sternenreise begann mit der Erweckung.",
        ],
        backgroundImage: "/images/puzzle-bg-ch21.png",
      },
      {
        id: "ch21-image",
        chapter: 21,
        puzzleIndex: 4,
        type: "image-puzzle",
        title: "Bilderr\u00e4tsel",
        description:
          "Beantworte die finalen Fragen und entdecke das verborgene Wort.",
        isSignature: false,
        data: {
          finalWord: "STERNE",
          questions: [
            { question: "Wie hei\u00dft der Schlangentr\u00e4ger am Himmel?", answer: "SERPENS" },
            { question: "Welches Licht erhellt die dunkelste Nacht?", answer: "TERNE" },
            { question: "Wie hei\u00dft die Kraft, die alles zusammenh\u00e4lt?", answer: "EINHEIT" },
            { question: "Was sucht der Reisende am Ende seiner Reise?", answer: "RUHE" },
            { question: "Welches Wort beschreibt die Vollendung eines Kreises?", answer: "NUNG" },
            { question: "Was ist das gr\u00f6\u00dfte Geschenk des Himmels?", answer: "EWIGKEIT" },
          ],
        },
        hints: [
          "Die Anfangsbuchstaben der Antworten ergeben zusammen ein Wort.",
          "Das gesuchte Wort leuchtet am Nachthimmel.",
        ],
        backgroundImage: "/images/puzzle-bg-ch21.png",
      },
    ],
  },
];

export default act3Chapters;
