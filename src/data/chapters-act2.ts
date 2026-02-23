import type { ChapterDef } from "../types.ts";

/**
 * Act 2 — Die Pr\u00fcfung (Chapters 8-14)
 * Medium difficulty, clues: MUT, TR\u00c4GT, DURCH, DIE, DUNKLE, NACHT
 * Meta answer: "Mut tr\u00e4gt durch die dunkle Nacht"
 */
const act2Chapters: ChapterDef[] = [
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 8 \u2014 Pegasus (Freiheit & Tr\u00e4ume)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 8,
    name: "Pegasus",
    constellation: "Pegasus",
    theme: "Freiheit & Tr\u00e4ume",
    storyIntro:
      "Das gefl\u00fcgelte Ross Pegasus durchstreifte einst die h\u00f6chsten Himmelsebenen, " +
      "ein Symbol grenzenloser Freiheit und k\u00fchner Tr\u00e4ume. Doch seine Schwingen sind ermattet " +
      "und nur mutiges Handeln kann ihm die Kraft zur\u00fcckgeben.",
    storyOutro:
      "Pegasus breitet seine m\u00e4chtigen Schwingen aus und erhebt sich in die Lüfte! " +
      "Das Quadrat des Pegasus funkelt am Herbsthimmel und erinnert daran, dass Mut die Fl\u00fcgel des Geistes sind.",
    introImage: "/images/chapter8-pegasus.png",
    puzzles: [
      {
        id: "ch8-compass",
        chapter: 8,
        puzzleIndex: 1,
        type: "star-compass",
        title: "Sternbild-Kompass",
        description:
          "Folge den Himmelsanweisungen, um Pegasus' hellsten Stern zu finden.",
        isSignature: true,
        data: {
          gridSize: 8,
          start: [0, 3],
          instructions: [
            { direction: "S\u00fcden", steps: 2 },
            { direction: "Osten", steps: 3 },
            { direction: "Norden", steps: 1 },
            { direction: "Westen", steps: 1 },
            { direction: "S\u00fcden", steps: 3 },
          ],
          answer: [5, 4],
        },
        hints: [
          "Beginne ganz oben in der Mitte des Gitters.",
          "Nach S\u00fcden und Osten bist du fast am Ziel \u2014 korrigiere dann die Richtung.",
        ],
        clue: "MUT",
        backgroundImage: "/images/puzzle-bg-ch8.png",
      },
      {
        id: "ch8-connections",
        chapter: 8,
        puzzleIndex: 2,
        type: "connections",
        title: "Verbindungen finden",
        description:
          "Sortiere 16 Begriffe aus der Welt der Tr\u00e4ume und Freiheit in vier Gruppen.",
        isSignature: false,
        data: {
          groups: [
            {
              label: "Fl\u00fcgelwesen",
              words: ["Pegasus", "Greif", "Phönix", "Ikarus"],
              color: "#ffd700",
            },
            {
              label: "Traumsymbole",
              words: ["Wolke", "Feder", "Regenbogen", "Schmetterling"],
              color: "#00d4ff",
            },
            {
              label: "Freiheitsbegriffe",
              words: ["Horizont", "Weite", "Aufbruch", "Flug"],
              color: "#9b59b6",
            },
            {
              label: "Griechische Helden",
              words: ["Perseus", "Herakles", "Theseus", "Odysseus"],
              color: "#c0c0e0",
            },
          ],
        },
        hints: [
          "Einige Begriffe beschreiben Wesen mit Fl\u00fcgeln aus der Mythologie.",
          "Ikarus ist kein Held im engeren Sinne \u2014 er geh\u00f6rt zu den Fl\u00fcgelwesen.",
        ],
        backgroundImage: "/images/puzzle-bg-ch8.png",
      },
      {
        id: "ch8-maze",
        chapter: 8,
        puzzleIndex: 3,
        type: "maze",
        title: "Labyrinth",
        description:
          "Navigiere durch den Wolkennebel, um Pegasus' Fl\u00fcgel zu erreichen.",
        isSignature: false,
        data: {
          grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          ],
          start: [1, 1],
          end: [13, 13],
        },
        hints: [
          "Der Weg f\u00fchrt zuerst nach rechts, dann schl\u00e4ngelt er sich nach unten.",
          "Vermeide die langen Sackgassen auf der linken Seite.",
        ],
        backgroundImage: "/images/puzzle-bg-ch8.png",
      },
      {
        id: "ch8-wordchain",
        chapter: 8,
        puzzleIndex: 4,
        type: "word-chain",
        title: "Wortkette",
        description:
          "Bilde eine Wortkette von FLUG zu TRAUM.",
        isSignature: false,
        data: {
          startWord: "FLUG",
          targetWord: "TRAUM",
          steps: 3,
          validWords: [
            "FLUG", "TRAUM", "GLUT", "GNADE", "GEIST", "NACHT", "GLANZ",
            "TAUBE", "TURM", "MUT", "GIPFEL", "LICHT", "TIER", "ROSE",
            "ENGEL", "LUFT", "TROPFEN", "TEIL", "LILIE", "EBENE",
          ],
        },
        hints: [
          "FLUG endet auf G \u2014 suche ein Wort, das mit G beginnt.",
          "TRAUM beginnt mit T \u2014 dein vorletztes Wort muss auf T enden.",
        ],
        backgroundImage: "/images/puzzle-bg-ch8.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 9 \u2014 Scorpius (Gift & Heilung)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 9,
    name: "Scorpius",
    constellation: "Scorpius",
    theme: "Gift & Heilung",
    storyIntro:
      "Der Skorpion Scorpius tr\u00e4gt seit Urzeiten das Geheimnis von Gift und Gegengift in sich. " +
      "Sein Stachel kann verletzen, aber sein Wissen heilt. Doch die Sterne seines Schweifs " +
      "sind erloschen und das Gleichgewicht zwischen Gefahr und Rettung ist gest\u00f6rt.",
    storyOutro:
      "Scorpius' Schweif gl\u00fcht in tiefem Rot! Der Skorpion hat sein Gleichgewicht wiedergefunden " +
      "und sein sch\u00fctzendes Licht strahlt am s\u00fcdlichen Himmel.",
    introImage: "/images/chapter9-scorpius.png",
    puzzles: [
      {
        id: "ch9-cipher",
        chapter: 9,
        puzzleIndex: 1,
        type: "cipher",
        title: "Chiffre knacken",
        description:
          "Entschl\u00fcssle die Botschaft des Skorpions mit einer Caesar-Verschl\u00fcsselung.",
        isSignature: true,
        data: {
          encrypted: "KHU VFRUSLON WUDJW GDV JHJHQJLIW",
          shift: 3,
          decrypted: "DER SKORPION TR\u00c4GT DAS GEGENGIFT",
          keyword: "SKORPION",
        },
        hints: [
          "Die Verschiebung ist dieselbe wie beim klassischen Caesar-Code.",
          "Das h\u00e4ufigste Wort im Deutschen ist 'DER' \u2014 suche nach einem Dreier-Muster.",
        ],
        clue: "TR\u00c4GT",
        backgroundImage: "/images/puzzle-bg-ch9.png",
      },
      {
        id: "ch9-crossword",
        chapter: 9,
        puzzleIndex: 2,
        type: "crossword",
        title: "Kreuzwortr\u00e4tsel",
        description:
          "L\u00f6se ein Kreuzwortr\u00e4tsel mit Begriffen rund um Heilung und Natur.",
        isSignature: false,
        data: {
          grid: [
            ["H", "E", "I", "L", ".", ".", "."],
            [".", ".", ".", "I", ".", ".", "."],
            [".", ".", ".", "N", ".", ".", "."],
            ["G", "I", "F", "T", ".", "A", "."],
            [".", ".", ".", ".", ".", "R", "."],
            [".", "K", "R", "A", "U", "T", "."],
            [".", ".", ".", ".", ".", ".", "."],
          ],
          emptyGrid: [
            [" ", " ", " ", " ", ".", ".", "."],
            [".", ".", ".", " ", ".", ".", "."],
            [".", ".", ".", " ", ".", ".", "."],
            [" ", " ", " ", " ", ".", " ", "."],
            [".", ".", ".", ".", ".", " ", "."],
            [".", " ", " ", " ", " ", " ", "."],
            [".", ".", ".", ".", ".", ".", "."],
          ],
          clues: {
            across: [
              { number: 1, row: 0, col: 0, length: 4, text: "Gesundmachen (4)", answer: "HEIL" },
              { number: 3, row: 3, col: 0, length: 4, text: "Gef\u00e4hrliche Substanz des Skorpions (4)", answer: "GIFT" },
              { number: 4, row: 5, col: 1, length: 5, text: "Heilpflanze (5)", answer: "KRAUT" },
            ],
            down: [
              { number: 2, row: 0, col: 3, length: 5, text: "Beruhigende Heilpflanze (5)", answer: "LINDE" },
              { number: 5, row: 3, col: 5, length: 3, text: "Gattung oder Sorte (3)", answer: "ART" },
            ],
          },
        },
        hints: [
          "1 waagerecht beginnt mit dem Buchstaben H.",
          "3 waagerecht: Was tr\u00e4gt der Skorpion in seinem Stachel?",
        ],
        backgroundImage: "/images/puzzle-bg-ch9.png",
      },
      {
        id: "ch9-memory",
        chapter: 9,
        puzzleIndex: 3,
        type: "memory",
        title: "Memory",
        description:
          "Finde die Paare aus Gifttieren und ihren Gegenmitteln.",
        isSignature: false,
        data: {
          pairs: [
            { id: 1, name: "Skorpion", symbol: "\uD83E\uDD82" },
            { id: 2, name: "Schlange", symbol: "\uD83D\uDC0D" },
            { id: 3, name: "Spinne", symbol: "\uD83D\uDD77\uFE0F" },
            { id: 4, name: "Qualle", symbol: "\uD83E\uDEBC" },
            { id: 5, name: "Biene", symbol: "\uD83D\uDC1D" },
            { id: 6, name: "Ameise", symbol: "\uD83D\uDC1C" },
            { id: 7, name: "Kugelfisch", symbol: "\uD83D\uDC21" },
            { id: 8, name: "Frosch", symbol: "\uD83D\uDC38" },
          ],
        },
        hints: [
          "Merke dir die Eckkarten zuerst \u2014 dort sind oft die seltensten Tiere.",
          "Skorpion und Schlange stehen oft nebeneinander.",
        ],
        backgroundImage: "/images/puzzle-bg-ch9.png",
      },
      {
        id: "ch9-numbers",
        chapter: 9,
        puzzleIndex: 4,
        type: "number-sequence",
        title: "Zahlenfolge",
        description:
          "Erkenne die verborgenen Muster in diesen Zahlenreihen.",
        isSignature: false,
        data: {
          sequences: [
            { shown: [3, 7, 15, 31, 63], answers: [127, 255], hint: "Jede Zahl ist das Doppelte plus 1" },
            { shown: [1, 4, 9, 16, 25], answers: [36, 49], hint: "Quadratzahlen: 1\u00b2, 2\u00b2, 3\u00b2 ..." },
            { shown: [2, 6, 12, 20, 30], answers: [42, 56], hint: "Differenzen: +4, +6, +8, +10 ..." },
          ],
        },
        hints: [
          "Die erste Folge hat mit Verdopplung zu tun.",
          "Bei der zweiten Folge sind die Zahlen perfekte Quadrate.",
        ],
        backgroundImage: "/images/puzzle-bg-ch9.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 10 \u2014 Gemini (Dualit\u00e4t & Spiegelung)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 10,
    name: "Gemini",
    constellation: "Gemini",
    theme: "Dualit\u00e4t & Spiegelung",
    storyIntro:
      "Die Zwillinge Castor und Pollux stehen f\u00fcr die Dualit\u00e4t des Seins \u2014 Licht und Schatten, " +
      "Sterblichkeit und Unsterblichkeit. Doch ihre Spiegelbilder sind zerbrochen " +
      "und die Harmonie der Zwillinge muss wiederhergestellt werden.",
    storyOutro:
      "Die Zwillingssterne leuchten in perfekter Symmetrie! Castor und Pollux stehen wieder vereint " +
      "am Winterhimmel und verk\u00f6rpern die unzertrennliche Verbindung.",
    introImage: "/images/chapter10-gemini.png",
    puzzles: [
      {
        id: "ch10-symmetry",
        chapter: 10,
        puzzleIndex: 1,
        type: "symmetry",
        title: "Symmetrie-Puzzle",
        description:
          "Vervollst\u00e4ndige das Zwillingsmuster, indem du die fehlende Spiegelh\u00e4lfte erg\u00e4nzt.",
        isSignature: true,
        data: {
          gridSize: 10,
          pattern: [
            [1, 2], [1, 3], [1, 4],
            [2, 1], [2, 4],
            [3, 1], [3, 4],
            [4, 1], [4, 2], [4, 3], [4, 4],
            [5, 2],
            [6, 2],
            [7, 1], [7, 2], [7, 3],
          ],
        },
        hints: [
          "Die Spiegelachse liegt vertikal in der Mitte des Gitters.",
          "Das Muster zeigt den Buchstaben 'P' \u2014 spiegle ihn zu einem 'q'.",
        ],
        clue: "DURCH",
        backgroundImage: "/images/puzzle-bg-ch10.png",
      },
      {
        id: "ch10-anagram",
        chapter: 10,
        puzzleIndex: 2,
        type: "anagram",
        title: "Anagramm",
        description:
          "Entschl\u00fcssle die durcheinander geratenen Begriffe rund um Dualit\u00e4t und Zwillinge.",
        isSignature: false,
        data: {
          words: [
            { scrambled: "LEGIEPS", answer: "SPIEGEL" },
            { scrambled: "TCNASEH", answer: "SCHATTEN" },
            { scrambled: "GIWLNILZ", answer: "ZWILLING" },
            { scrambled: "HAROMINE", answer: "HARMONIE" },
          ],
        },
        hints: [
          "Das erste Wort beginnt mit 'SP' und endet auf 'EL'.",
          "Das dritte Wort beschreibt zwei identische Geschwister.",
        ],
        backgroundImage: "/images/puzzle-bg-ch10.png",
      },
      {
        id: "ch10-slide",
        chapter: 10,
        puzzleIndex: 3,
        type: "slide-puzzle",
        title: "Schiebepuzzle",
        description:
          "Verschiebe die Kacheln, um das Zwillingssternbild wiederherzustellen.",
        isSignature: false,
        data: {
          size: 4,
          initial: [1, 2, 3, 4, 5, 0, 7, 8, 9, 6, 11, 12, 13, 10, 14, 15],
        },
        hints: [
          "Beginne mit der oberen Reihe \u2014 sie ist bereits korrekt.",
          "Schiebe die 6 und 10 in ihre richtige Position in der zweiten und dritten Reihe.",
        ],
        backgroundImage: "/images/puzzle-bg-ch10.png",
      },
      {
        id: "ch10-spotdiff",
        chapter: 10,
        puzzleIndex: 4,
        type: "spot-difference",
        title: "Unterschiede finden",
        description:
          "Die Zwillingsbilder sehen fast gleich aus \u2014 finde die versteckten Unterschiede.",
        isSignature: false,
        data: {
          canvasWidth: 400,
          canvasHeight: 300,
          differences: [
            { x: 60, y: 50, radius: 22, description: "Stern fehlt" },
            { x: 180, y: 80, radius: 20, description: "Andere Farbe" },
            { x: 300, y: 60, radius: 22, description: "Zus\u00e4tzlicher Stern" },
            { x: 120, y: 200, radius: 25, description: "Gr\u00f6\u00dfe ge\u00e4ndert" },
            { x: 340, y: 220, radius: 20, description: "Linie fehlt" },
          ],
          stars: [
            { x: 60, y: 50, size: 3, color: "#ffffff" },
            { x: 140, y: 30, size: 2, color: "#ffffff" },
            { x: 180, y: 80, size: 4, color: "#ffffff" },
            { x: 260, y: 45, size: 2, color: "#ffffff" },
            { x: 340, y: 100, size: 3, color: "#ffffff" },
            { x: 90, y: 170, size: 2, color: "#ffffff" },
            { x: 230, y: 150, size: 3, color: "#ffffff" },
          ],
        },
        hints: [
          "Vergleiche die Sternhelligkeit in der oberen Reihe beider Bilder.",
          "Einer der Unterschiede befindet sich in der unteren rechten Ecke.",
        ],
        backgroundImage: "/images/puzzle-bg-ch10.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 11 \u2014 Aquila (Mut & H\u00f6henflug)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 11,
    name: "Aquila",
    constellation: "Aquila",
    theme: "Mut & H\u00f6henflug",
    storyIntro:
      "Der Adler Aquila, Zeus' treuster Bote, trug einst den Blitz durch den Himmel. " +
      "Sein scharfer Blick durchdrang jede Dunkelheit, doch nun sind seine Augen verbunden " +
      "und nur wer sich mutig den R\u00e4tseln stellt, kann ihm das Augenlicht zur\u00fcckgeben.",
    storyOutro:
      "Aquilas Schwingen schneiden durch die Nacht! Der Adler gleitet mit scharfem Blick \u00fcber den Himmel " +
      "und sein Stern Altair funkelt als einer der hellsten am Firmament.",
    introImage: "/images/chapter11-aquila.png",
    puzzles: [
      {
        id: "ch11-melody",
        chapter: 11,
        puzzleIndex: 1,
        type: "melody-sequence",
        title: "Melodie-Sequenz",
        description:
          "Der Adler singt eine Melodie des Mutes. Merke dir die Reihenfolge und spiele sie nach.",
        isSignature: true,
        data: {
          sequence: [3, 5, 2, 6, 1, 4, 0],
          starPositions: [
            { x: 15, y: 55 },
            { x: 30, y: 30 },
            { x: 45, y: 15 },
            { x: 50, y: 50 },
            { x: 65, y: 25 },
            { x: 75, y: 45 },
            { x: 85, y: 65 },
          ],
        },
        hints: [
          "Die Sequenz beginnt mit dem mittleren Stern.",
          "Achte auf das Muster: die Melodie springt zwischen hoch und tief.",
        ],
        clue: "DIE",
        backgroundImage: "/images/puzzle-bg-ch11.png",
      },
      {
        id: "ch11-connections",
        chapter: 11,
        puzzleIndex: 2,
        type: "connections",
        title: "Verbindungen finden",
        description:
          "Sortiere 16 Begriffe aus der Welt der V\u00f6gel und des Himmels in vier Gruppen.",
        isSignature: false,
        data: {
          groups: [
            {
              label: "Raubv\u00f6gel",
              words: ["Adler", "Falke", "Habicht", "Bussard"],
              color: "#ffd700",
            },
            {
              label: "Himmelsph\u00e4nomene",
              words: ["Nordlicht", "Sternschnuppe", "Halo", "Morgenrot"],
              color: "#00d4ff",
            },
            {
              label: "Mythologische Tiere",
              words: ["Greif", "Dr\u00e4che", "Hydra", "Zentaur"],
              color: "#9b59b6",
            },
            {
              label: "Flugbegriffe",
              words: ["Thermik", "Gleiten", "Sturzflug", "Aufwind"],
              color: "#c0c0e0",
            },
          ],
        },
        hints: [
          "Thermik, Gleiten und Aufwind sind alles Begriffe aus der Flugwelt.",
          "Greif und Dr\u00e4che sind keine echten Tiere.",
        ],
        backgroundImage: "/images/puzzle-bg-ch11.png",
      },
      {
        id: "ch11-maze",
        chapter: 11,
        puzzleIndex: 3,
        type: "maze",
        title: "Labyrinth",
        description:
          "Fliege durch die Wolkent\u00fcrme, um Altair zu erreichen.",
        isSignature: false,
        data: {
          grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          ],
          start: [1, 1],
          end: [13, 13],
        },
        hints: [
          "Folge dem Weg nach unten durch die Mitte des Labyrinths.",
          "Es gibt einen langen Korridor in Zeile 7.",
        ],
        backgroundImage: "/images/puzzle-bg-ch11.png",
      },
      {
        id: "ch11-wordchain",
        chapter: 11,
        puzzleIndex: 4,
        type: "word-chain",
        title: "Wortkette",
        description:
          "Bilde eine Wortkette von ADLER zu STERN.",
        isSignature: false,
        data: {
          startWord: "ADLER",
          targetWord: "STERN",
          steps: 3,
          validWords: [
            "ADLER", "STERN", "ROSE", "ERDE", "ENGEL", "RABE", "LICHT",
            "TURM", "RUBIN", "NEST", "TIGER", "REGEN", "NATUR", "RING",
            "EULE", "LEIER", "REIS", "STROM", "MOND", "DONNER",
          ],
        },
        hints: [
          "ADLER endet auf R \u2014 suche ein Wort, das mit R beginnt.",
          "STERN beginnt mit S \u2014 dein vorletztes Wort muss auf S enden.",
        ],
        backgroundImage: "/images/puzzle-bg-ch11.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 12 \u2014 Perseus (Helden & Rettung)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 12,
    name: "Perseus",
    constellation: "Perseus",
    theme: "Helden & Rettung",
    storyIntro:
      "Perseus, der legend\u00e4re Held, bezwang einst die Medusa und rettete Andromeda. " +
      "Sein Sternbild erinnert an den Mut, sich dem Unm\u00f6glichen zu stellen. " +
      "Doch die Dunkelheit hat seine Taten verschleiert und wartet darauf, entschlüsselt zu werden.",
    storyOutro:
      "Perseus erstrahlt in heldenhaftem Glanz! Sein Schwert funkelt am Himmel " +
      "und erinnert daran, dass wahre Helden das Dunkle nicht f\u00fcrchten.",
    introImage: "/images/chapter12-perseus.png",
    puzzles: [
      {
        id: "ch12-logic",
        chapter: 12,
        puzzleIndex: 1,
        type: "logic-deduction",
        title: "Logik-Deduktion",
        description:
          "Ordne den vier griechischen Helden ihre Waffen und Quests zu.",
        isSignature: true,
        data: {
          stars: ["Perseus", "Herakles", "Theseus", "Jason"],
          categories: {
            color: ["Schwert", "Keule", "Faden", "Vlies"],
            planet: ["Medusa", "Hydra", "Minotaurus", "Drache"],
          },
          solution: {
            Perseus: { color: "Schwert", planet: "Medusa" },
            Herakles: { color: "Keule", planet: "Hydra" },
            Theseus: { color: "Faden", planet: "Minotaurus" },
            Jason: { color: "Vlies", planet: "Drache" },
          },
          clues: [
            "Perseus k\u00e4mpfte mit einem Schwert.",
            "Herakles bek\u00e4mpfte die Hydra.",
            "Der Held mit dem Faden stand dem Minotaurus gegen\u00fcber.",
            "Jason suchte das Goldene Vlies.",
            "Theseus benutzte keine Keule.",
            "Perseus stellte sich nicht dem Drachen.",
          ],
        },
        hints: [
          "Jason ist f\u00fcr seine Suche nach dem Goldenen Vlies bekannt.",
          "Theseus nutzte Ariadnes Faden, um aus dem Labyrinth zu finden.",
        ],
        clue: "DUNKLE",
        backgroundImage: "/images/puzzle-bg-ch12.png",
      },
      {
        id: "ch12-rebus",
        chapter: 12,
        puzzleIndex: 2,
        type: "rebus",
        title: "Rebus / Bilderr\u00e4tsel",
        description:
          "Entschl\u00fcssle die Bildfolgen, die mythologische Begriffe ergeben.",
        isSignature: false,
        data: {
          rebuses: [
            { display: "\uD83D\uDDE1\uFE0F + \uD83D\uDC0D = ?", answer: "MEDUSA", hint: "Ein Monster mit Schlangen als Haare..." },
            { display: "\uD83E\uDD81 + \uD83E\uDD85 = ?", answer: "GREIF", hint: "Halb L\u00f6we, halb Adler..." },
            { display: "\uD83C\uDFC7 + \ud83e\udea8 = ?", answer: "ZENTAUR", hint: "Halb Mensch, halb Pferd..." },
            { display: "\uD83D\uDC51 + \u2B50 = ?", answer: "STERNBILD", hint: "Ein Muster am Nachthimmel..." },
          ],
        },
        hints: [
          "Das erste Bildr\u00e4tsel zeigt ein Schwert und eine Schlange.",
          "Der Greif ist ein Fabelwesen, halb L\u00f6we und halb Adler.",
        ],
        backgroundImage: "/images/puzzle-bg-ch12.png",
      },
      {
        id: "ch12-nonogram",
        chapter: 12,
        puzzleIndex: 3,
        type: "nonogram",
        title: "Nonogramm",
        description:
          "Enth\u00fclle das verborgene Heldensymbol im Raster.",
        isSignature: false,
        data: {
          size: 8,
          solution: [
            [0, 0, 1, 1, 1, 1, 0, 0],
            [0, 1, 0, 0, 0, 0, 1, 0],
            [1, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 1, 1, 1, 0, 0],
          ],
          rowHints: [[4], [1, 1], [1, 1, 1, 1], [1, 1], [1, 1, 1, 1], [1, 2, 1], [1, 1], [4]],
          colHints: [[2], [1, 1], [1, 1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1, 1], [1, 1], [2]],
        },
        hints: [
          "Die Ecken des Musters sind symmetrisch \u2014 beginne dort.",
          "Die mittleren Reihen ergeben ein Gesicht.",
        ],
        backgroundImage: "/images/puzzle-bg-ch12.png",
      },
      {
        id: "ch12-wordsearch",
        chapter: 12,
        puzzleIndex: 4,
        type: "word-search",
        title: "Wortsuche",
        description:
          "Finde die versteckten Heldenbegriffe im Buchstabenfeld.",
        isSignature: false,
        data: {
          gridSize: 10,
          words: ["HELD", "SCHILD", "SCHWERT", "MEDUSA", "DRACHE", "KRONE"],
          grid: [
            ["H", "E", "L", "D", "M", "E", "K", "R", "O", "S"],
            ["S", "C", "H", "I", "L", "D", "R", "N", "O", "C"],
            ["A", "D", "R", "A", "C", "H", "E", "P", "Q", "H"],
            ["T", "M", "E", "D", "U", "S", "A", "L", "B", "W"],
            ["U", "F", "G", "X", "Z", "W", "K", "N", "M", "E"],
            ["R", "N", "K", "R", "O", "N", "E", "D", "F", "R"],
            ["P", "Q", "S", "T", "A", "B", "C", "E", "G", "T"],
            ["W", "X", "Y", "Z", "A", "B", "C", "D", "E", "H"],
            ["I", "J", "K", "L", "M", "N", "O", "P", "Q", "I"],
            ["R", "S", "T", "U", "V", "W", "X", "Y", "Z", "J"],
          ],
          wordPositions: {
            HELD: [0, 0, 0, 3],
            SCHILD: [1, 0, 1, 5],
            SCHWERT: [0, 9, 6, 9],
            MEDUSA: [3, 1, 3, 6],
            DRACHE: [2, 1, 2, 6],
            KRONE: [5, 2, 5, 6],
          },
        },
        hints: [
          "HELD befindet sich ganz oben links.",
          "MEDUSA und DRACHE liegen direkt untereinander.",
        ],
        backgroundImage: "/images/puzzle-bg-ch12.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 13 \u2014 Centaurus (Weisheit & Lehre)
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 13,
    name: "Centaurus",
    constellation: "Centaurus",
    theme: "Weisheit & Lehre",
    storyIntro:
      "Der weise Zentaur Chiron lehrte einst die gr\u00f6\u00dften Helden Griechenlands. " +
      "Sein Wissen umfasste Medizin, Musik und die Sterne. Doch seine Lehren " +
      "sind in vergessenen R\u00e4tseln verschl\u00fcsselt und warten darauf, wiederentdeckt zu werden.",
    storyOutro:
      "Centaurus erstrahlt in tiefem Wissen! Der Zentaur teilt erneut seine Weisheit " +
      "und sein hellster Stern, Alpha Centauri, weist den Weg zu neuen Erkenntnissen.",
    introImage: "/images/chapter13-centaurus.png",
    puzzles: [
      {
        id: "ch13-quiz",
        chapter: 13,
        puzzleIndex: 1,
        type: "quiz",
        title: "Wissens-Quiz",
        description:
          "Beantworte Fragen aus Chirons Lehrbuch der Astronomie und Mythologie.",
        isSignature: true,
        data: {
          requiredCorrect: 6,
          questions: [
            { question: "Welcher Stern ist der n\u00e4chste zum Sonnensystem?", options: ["Sirius", "Proxima Centauri", "Alpha Centauri A", "Barnards Stern"], correct: 1 },
            { question: "Wer lehrte Achilles das K\u00e4mpfen?", options: ["Zeus", "Chiron", "Ares", "Odysseus"], correct: 1 },
            { question: "Was bedeutet 'Galaxie' w\u00f6rtlich?", options: ["Sternenmeer", "Milchstra\u00dfe", "Lichtkreis", "Himmelsrad"], correct: 1 },
            { question: "Welches Element entsteht haupts\u00e4chlich bei der Kernfusion in Sternen?", options: ["Sauerstoff", "Eisen", "Helium", "Kohlenstoff"], correct: 2 },
            { question: "Wie hei\u00dft der r\u00f6tliche Stern im Scorpius?", options: ["Rigel", "Beteigeuze", "Antares", "Aldebaran"], correct: 2 },
            { question: "Welcher Planet hat die meisten bekannten Monde?", options: ["Jupiter", "Saturn", "Uranus", "Neptun"], correct: 1 },
            { question: "Was ist ein Pulsar?", options: ["Ein sterbender Stern", "Ein rotierender Neutronenstern", "Ein Schwarzes Loch", "Ein roter Riese"], correct: 1 },
            { question: "Welche griechische G\u00f6ttin steht f\u00fcr Weisheit?", options: ["Hera", "Aphrodite", "Athene", "Demeter"], correct: 2 },
          ],
        },
        hints: [
          "Der n\u00e4chste Stern zum Sonnensystem tr\u00e4gt den Namen einer Sternbildfigur.",
          "Chiron war ein Zentaur \u2014 und der Lehrer vieler griechischer Helden.",
        ],
        clue: "NACHT",
        backgroundImage: "/images/puzzle-bg-ch13.png",
      },
      {
        id: "ch13-morse",
        chapter: 13,
        puzzleIndex: 2,
        type: "morse-code",
        title: "Morse-Code",
        description:
          "Die Sterne des Zentauren blinken in rhythmischen Mustern. Entschl\u00fcssle die Botschaft.",
        isSignature: false,
        data: {
          message: "CHIRON",
          morseMap: {
            "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".",
            "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---",
            "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---",
            "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-",
            "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", "Z": "--..",
          },
        },
        hints: [
          "Die Nachricht hat sechs Buchstaben und beginnt mit einem schwierigen Zeichen.",
          "Es ist der Name des weisesten Zentauren.",
        ],
        backgroundImage: "/images/puzzle-bg-ch13.png",
      },
      {
        id: "ch13-tangram",
        chapter: 13,
        puzzleIndex: 3,
        type: "tangram",
        title: "Tangram",
        description:
          "Lege die Formen so zusammen, dass sie die Silhouette des Zentauren ergeben.",
        isSignature: false,
        data: {
          zones: [
            { id: 1, name: "Kopf", path: "M15,5 L25,5 L25,15 L15,15 Z", color: "#ffd700" },
            { id: 2, name: "Oberk\u00f6rper", path: "M10,15 L30,15 L30,30 L10,30 Z", color: "#00d4ff" },
            { id: 3, name: "Pferdek\u00f6rper", path: "M5,30 L35,30 L35,50 L5,50 Z", color: "#9b59b6" },
            { id: 4, name: "Vorderbeine", path: "M5,50 L15,50 L12,70 L8,70 Z", color: "#c0c0e0" },
            { id: 5, name: "Hinterbeine", path: "M25,50 L35,50 L32,70 L28,70 Z", color: "#e74c3c" },
            { id: 6, name: "Schweif", path: "M35,35 L45,30 L42,45 Z", color: "#2ecc71" },
            { id: 7, name: "Bogen", path: "M0,10 L10,15 L5,20 Z", color: "#f39c12" },
          ],
          pieces: [
            { id: 1, label: "\u25AC", matchesZone: 1 },
            { id: 2, label: "\u25AE", matchesZone: 2 },
            { id: 3, label: "\u25A0", matchesZone: 3 },
            { id: 4, label: "\u25C4", matchesZone: 4 },
            { id: 5, label: "\u25BA", matchesZone: 5 },
            { id: 6, label: "\u25BC", matchesZone: 6 },
            { id: 7, label: "\u256B", matchesZone: 7 },
          ],
        },
        hints: [
          "Das gr\u00f6\u00dfte Rechteck bildet den Pferdek\u00f6rper.",
          "Der Bogen befindet sich in der Hand des Zentauren.",
        ],
        backgroundImage: "/images/puzzle-bg-ch13.png",
      },
      {
        id: "ch13-syllables",
        chapter: 13,
        puzzleIndex: 4,
        type: "syllable-puzzle",
        title: "Silbenr\u00e4tsel",
        description:
          "Kombiniere die Silben zu wissenschaftlichen Begriffen aus Chirons Lehren.",
        isSignature: false,
        data: {
          words: [
            { answer: "ASTRONOMIE", syllables: ["AS", "TRO", "NO", "MIE"] },
            { answer: "PHILOSOPHIE", syllables: ["PHI", "LO", "SO", "PHIE"] },
            { answer: "MEDIZIN", syllables: ["ME", "DI", "ZIN"] },
            { answer: "MYTHOLOGIE", syllables: ["MY", "THO", "LO", "GIE"] },
          ],
          allSyllables: ["AS", "PHI", "ME", "MY", "TRO", "LO", "DI", "THO", "NO", "SO", "ZIN", "LO", "MIE", "PHIE", "GIE"],
        },
        hints: [
          "Das erste Wort beschreibt die Wissenschaft der Sterne.",
          "Chiron lehrte Heilkunst \u2014 das dritte Wort beginnt mit ME.",
        ],
        backgroundImage: "/images/puzzle-bg-ch13.png",
      },
    ],
  },

  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Kapitel 14 \u2014 Phoenix (Wiedergeburt & Erneuerung) \u2014 META-PUZZLE
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  {
    id: 14,
    name: "Phoenix",
    constellation: "Phoenix",
    theme: "Wiedergeburt & Erneuerung",
    storyIntro:
      "Der Ph\u00f6nix erhebt sich immer wieder aus der Asche, ein Symbol ewiger Erneuerung. " +
      "In seinem Feuer liegt die Kraft der Verwandlung. Kombiniere die gesammelten Hinweise " +
      "aus dem zweiten Akt, um seine flammendes Geheimnis zu l\u00fcften.",
    storyOutro:
      "Der Ph\u00f6nix entflammt in gleissendem Licht! Aus der Asche erhebt sich eine neue Gestalt " +
      "und die Botschaft des zweiten Aktes hallt durch den Himmel: \u201eMut tr\u00e4gt durch die dunkle Nacht.\u201c",
    introImage: "/images/chapter14-phoenix.png",
    puzzles: [
      {
        id: "ch14-meta",
        chapter: 14,
        puzzleIndex: 1,
        type: "meta-puzzle",
        title: "Meta-R\u00e4tsel",
        description:
          "Kombiniere die Hinweise aus Kapitel 8\u201313, um die Botschaft des Ph\u00f6nix zu enth\u00fcllen.",
        isSignature: true,
        data: {
          answer: "Mut tr\u00e4gt durch die dunkle Nacht",
          cluesByChapter: {
            8: "MUT",
            9: "TR\u00c4GT",
            10: "DURCH",
            11: "DIE",
            12: "DUNKLE",
            13: "NACHT",
          },
        },
        hints: [
          "Jedes abgeschlossene Kapitel von Akt II hat dir ein Wort offenbart.",
          "Setze die sechs W\u00f6rter in der Reihenfolge der Kapitel 8 bis 13 zusammen.",
        ],
        backgroundImage: "/images/puzzle-bg-ch14.png",
      },
      {
        id: "ch14-simon",
        chapter: 14,
        puzzleIndex: 2,
        type: "simon-says",
        title: "Simon Says",
        description:
          "Die Flammen des Ph\u00f6nix tanzen in einer Sequenz \u2014 wiederhole sie.",
        isSignature: false,
        data: {
          sequence: [2, 0, 4, 1, 3, 2, 4],
          starColors: ["#ff4500", "#ffd700", "#ff6347", "#ff8c00", "#ffb347"],
          startLength: 4,
          winLength: 7,
        },
        hints: [
          "Die Flammen folgen einem Muster \u2014 achte auf die W\u00e4rme der Farben.",
          "Die Sequenz beginnt mit der mittleren Flamme.",
        ],
        backgroundImage: "/images/puzzle-bg-ch14.png",
      },
      {
        id: "ch14-sorting",
        chapter: 14,
        puzzleIndex: 3,
        type: "sorting",
        title: "Sortier-R\u00e4tsel",
        description:
          "Bringe mythologische Wesen und Ereignisse in die richtige Reihenfolge.",
        isSignature: false,
        data: {
          rounds: [
            {
              title: "Sortiere die Verwandlungen des Ph\u00f6nix (Lebenszyklus)",
              items: ["Asche", "Flamme", "Jungtier", "Erwachsener", "Alter Ph\u00f6nix"],
              correctOrder: ["Asche", "Flamme", "Jungtier", "Erwachsener", "Alter Ph\u00f6nix"],
            },
            {
              title: "Sortiere die griechischen G\u00f6tter nach Hierarchie",
              items: ["Nymphe", "Halbgott", "Olympier", "Titan", "Urgott"],
              correctOrder: ["Urgott", "Titan", "Olympier", "Halbgott", "Nymphe"],
            },
          ],
        },
        hints: [
          "Der Ph\u00f6nix beginnt seinen Zyklus immer in der Asche.",
          "Die Urg\u00f6tter kamen vor den Titanen, die Titanen vor den Olympiern.",
        ],
        backgroundImage: "/images/puzzle-bg-ch14.png",
      },
      {
        id: "ch14-image",
        chapter: 14,
        puzzleIndex: 4,
        type: "image-puzzle",
        title: "Bilderr\u00e4tsel",
        description:
          "Beantworte die Fragen und entdecke das verborgene Wort in den Anfangsbuchstaben.",
        isSignature: false,
        data: {
          finalWord: "FLAMME",
          questions: [
            { question: "Wie hei\u00dft der Vogel, der aus der Asche aufersteht?", answer: "F\u00d6NIX" },
            { question: "Welches Element verbrennt am hei\u00dfesten?", answer: "LITHIUM" },
            { question: "Wie nennt man den Beginn eines neuen Tages?", answer: "ANBRUCH" },
            { question: "Welcher Himmelsk\u00f6rper leuchtet in der Nacht?", answer: "MOND" },
            { question: "Wie hei\u00dft die griechische G\u00f6ttin der Morgenr\u00f6te?", answer: "MORGENR\u00d6TE" },
            { question: "Was entsteht bei der Verbrennung von Holz?", answer: "ENERGIE" },
          ],
        },
        hints: [
          "Die Anfangsbuchstaben der Antworten ergeben zusammen ein feuriges Wort.",
          "Das gesuchte Wort hat mit dem Ph\u00f6nix und seinem Element zu tun.",
        ],
        backgroundImage: "/images/puzzle-bg-ch14.png",
      },
    ],
  },
];

export default act2Chapters;
