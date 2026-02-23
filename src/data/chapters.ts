import type { ChapterDef } from "../types.ts";

const chapters: ChapterDef[] = [
  // ─────────────────────────────────────────────────────────
  // Kapitel 1 — Lyra (Musik & Harmonie)
  // ─────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Lyra",
    constellation: "Lyra",
    theme: "Musik & Harmonie",
    storyIntro:
      "Einst erklang die Leier des Orpheus am Nachthimmel und webte Melodien zwischen den Sternen. " +
      "Doch nun liegen ihre Saiten stumm, die Harmonien verblasst, und nur ein leises Summen erinnert an die einstige Musik. " +
      "Finde die verlorenen Klänge und bringe die Lyra wieder zum Singen.",
    storyOutro:
      "Die Saiten der Lyra vibrieren erneut! Kristallklare Töne strömen durch das Firmament " +
      "und die Sterne dieses Sternbilds erstrahlen in warmem, goldenem Licht.",
    introImage: "/images/chapter1-lyra.png",
    puzzles: [
      {
        id: "ch1-melody",
        chapter: 1,
        puzzleIndex: 1,
        type: "melody-sequence",
        title: "Melodie-Sequenz",
        description:
          "Die Sterne der Lyra spielen eine himmlische Melodie. Merke dir die Reihenfolge der Töne und spiele sie nach.",
        isSignature: true,
        data: {
          sequence: [0, 2, 4, 6, 4, 2, 0],
          starPositions: [
            { x: 15, y: 60 },
            { x: 25, y: 35 },
            { x: 38, y: 20 },
            { x: 50, y: 15 },
            { x: 62, y: 20 },
            { x: 75, y: 35 },
            { x: 85, y: 60 },
          ],
        },
        hints: [
          "Achte auf die Farben der Sterne, wenn sie aufleuchten.",
          "Die Melodie beginnt immer mit dem hellsten Stern oben links.",
        ],
        clue: "STERN",
        backgroundImage: "/images/puzzle-bg-ch1.png",
      },
      {
        id: "ch1-connections",
        chapter: 1,
        puzzleIndex: 2,
        type: "connections",
        title: "Verbindungen finden",
        description:
          "Sortiere 16 musikalische und himmlische Begriffe in vier zusammengehörige Gruppen.",
        isSignature: false,
        data: {
          groups: [
            {
              label: "Planeten",
              words: ["Mars", "Venus", "Jupiter", "Saturn"],
              color: "#ffd700",
            },
            {
              label: "Sternbilder",
              words: ["Orion", "Lyra", "Draco", "Cygnus"],
              color: "#00d4ff",
            },
            {
              label: "Mondphasen",
              words: ["Vollmond", "Neumond", "Halbmond", "Sichelmond"],
              color: "#9b59b6",
            },
            {
              label: "Galaxien",
              words: ["Andromeda", "Milchstraße", "Sombrero", "Whirlpool"],
              color: "#c0c0e0",
            },
          ],
        },
        hints: [
          "Eine Gruppe besteht aus Musikinstrumenten.",
          "Suche nach Begriffen, die mit Klang und Schall zu tun haben.",
        ],
        clue: "STERN",
        backgroundImage: "/images/puzzle-bg-ch1.png",
      },
      {
        id: "ch1-maze",
        chapter: 1,
        puzzleIndex: 3,
        type: "maze",
        title: "Labyrinth",
        description:
          "Finde den Weg durch den schimmernden Sternennebel, um die nächste Saite der Lyra zu erreichen.",
        isSignature: false,
        data: {
          grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          ],
          start: [1, 1],
          end: [13, 13],
        },
        hints: [
          "Der richtige Weg folgt den leuchtenden Nebelschwaden.",
          "Sackgassen erkennst du an den dunkleren Bereichen.",
        ],
        clue: "STERN",
        backgroundImage: "/images/puzzle-bg-ch1.png",
      },
      {
        id: "ch1-wordchain",
        chapter: 1,
        puzzleIndex: 4,
        type: "word-chain",
        title: "Wortkette",
        description:
          "Bilde eine Kette aus Wörtern, bei der jedes neue Wort mit dem letzten Buchstaben des vorherigen beginnt.",
        isSignature: false,
        data: {
          startWord: "STERN",
          targetWord: "NACHT",
          steps: 4,
          validWords: [
            "STERN",
            "NEBEL",
            "LUNA",
            "ASTRO",
            "ORBIT",
            "TITAN",
            "NACHT",
            "NOVA",
            "ANTARES",
            "SONNE",
            "ERDE",
            "ECLIPSE",
            "EUROPA",
            "AURORA",
            "ANDROMEDA",
          ],
        },
        hints: [
          "Beginne mit dem Wort, das am meisten Möglichkeiten eröffnet.",
          "Wörter mit seltenen Endbuchstaben solltest du dir für später aufheben.",
        ],
        clue: "STERN",
        backgroundImage: "/images/puzzle-bg-ch1.png",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Kapitel 2 — Ursa Minor (Orientierung & Heimat)
  // ─────────────────────────────────────────────────────────
  {
    id: 2,
    name: "Ursa Minor",
    constellation: "Ursa Minor",
    theme: "Orientierung & Heimat",
    storyIntro:
      "Der Kleine Bär hütet seit Jahrtausenden den Polarstern, den ewigen Wegweiser der Reisenden. " +
      "Doch dichte Wolken haben seinen Glanz verschleiert und die Wanderer irren ohne Richtung durch die Nacht. " +
      "Stelle den Kompass des Himmels wieder her und lass den Polarstern erneut den Weg weisen.",
    storyOutro:
      "Der Polarstern flammt in strahlender Klarheit auf! Der Kleine Bär steht wieder fest am Himmel " +
      "und weist allen Suchenden den Weg nach Hause.",
    introImage: "/images/chapter2-ursa-minor.png",
    puzzles: [
      {
        id: "ch2-compass",
        chapter: 2,
        puzzleIndex: 1,
        type: "star-compass",
        title: "Sternbild-Kompass",
        description:
          "Folge den Richtungsanweisungen der Sterne, um den Polarstern zu finden.",
        isSignature: true,
        data: {
          gridSize: 8,
          start: [1, 6],
          instructions: [
            { direction: "Norden", steps: 3 },
            { direction: "Osten", steps: 4 },
            { direction: "Süden", steps: 1 },
            { direction: "Osten", steps: 2 },
            { direction: "Norden", steps: 2 },
          ],
          answer: [7, 2],
        },
        hints: [
          "Norden ist immer am oberen Rand der Himmelskarte.",
          "Die ersten zwei Anweisungen führen dich zum Großen Wagen.",
        ],
        clue: "LICHT",
        backgroundImage: "/images/puzzle-bg-ch2.png",
      },
      {
        id: "ch2-crossword",
        chapter: 2,
        puzzleIndex: 2,
        type: "crossword",
        title: "Kreuzworträtsel",
        description:
          "Löse ein Kreuzworträtsel voller Begriffe aus Astronomie und Mythologie.",
        isSignature: false,
        data: {
          grid: [
            ["M", "O", "N", "D", ".", "S", "."],
            ["A", ".", ".", ".", ".", "T", "."],
            ["R", ".", ".", ".", ".", "E", "."],
            ["S", "O", "N", "N", "E", "R", "."],
            [".", ".", ".", ".", ".", "N", "."],
            [".", "K", "O", "M", "E", "T", "."],
            [".", "P", "L", "U", "T", "O", "."],
          ],
          emptyGrid: [
            [" ", " ", " ", " ", ".", " ", "."],
            [" ", ".", ".", ".", ".", " ", "."],
            [" ", ".", ".", ".", ".", " ", "."],
            [" ", " ", " ", " ", " ", " ", "."],
            [".", ".", ".", ".", ".", " ", "."],
            [".", " ", " ", " ", " ", " ", "."],
            [".", " ", " ", " ", " ", " ", "."],
          ],
          clues: {
            across: [
              { number: 1, row: 0, col: 0, length: 4, text: "Erdtrabant, leuchtet nachts (4)", answer: "MOND" },
              { number: 3, row: 3, col: 0, length: 5, text: "Unser nächster Stern (5)", answer: "SONNE" },
              { number: 4, row: 5, col: 1, length: 5, text: "Himmelskörper mit Schweif (5)", answer: "KOMET" },
              { number: 5, row: 6, col: 1, length: 5, text: "Ehemaliger neunter Planet (5)", answer: "PLUTO" },
            ],
            down: [
              { number: 1, row: 0, col: 0, length: 4, text: "Roter Planet (4)", answer: "MARS" },
              { number: 2, row: 0, col: 5, length: 5, text: "Leuchtendes Himmelsobjekt (5)", answer: "STERN" },
            ],
          },
        },
        hints: [
          "3 waagerecht: Ein Himmelskörper, der die Sonne umkreist.",
          "5 senkrecht: Die griechische Göttin der Jagd und des Mondes.",
        ],
        clue: "LICHT",
        backgroundImage: "/images/puzzle-bg-ch2.png",
      },
      {
        id: "ch2-memory",
        chapter: 2,
        puzzleIndex: 3,
        type: "memory",
        title: "Memory",
        description:
          "Decke Paare von Sternbildern und ihren Namen auf, um alle Karten aufzulösen.",
        isSignature: false,
        data: {
          pairs: [
            { id: 1, name: "Orion", symbol: "\u2694\uFE0F" },
            { id: 2, name: "Lyra", symbol: "\uD83C\uDFB5" },
            { id: 3, name: "Draco", symbol: "\uD83D\uDC09" },
            { id: 4, name: "Cygnus", symbol: "\uD83E\uDDA2" },
            { id: 5, name: "Ursa", symbol: "\uD83D\uDC3B" },
            { id: 6, name: "Corona", symbol: "\uD83D\uDC51" },
            { id: 7, name: "Cassiopeia", symbol: "\uD83D\uDC8E" },
            { id: 8, name: "Aquila", symbol: "\uD83E\uDD85" },
          ],
        },
        hints: [
          "Merke dir die Positionen der Eckkarten zuerst.",
          "Die Sternbilder in der oberen Reihe gehören alle zur Nordhalbkugel.",
        ],
        clue: "LICHT",
        backgroundImage: "/images/puzzle-bg-ch2.png",
      },
      {
        id: "ch2-numbers",
        chapter: 2,
        puzzleIndex: 4,
        type: "number-sequence",
        title: "Zahlenfolge",
        description:
          "Erkenne das kosmische Muster in der Zahlenreihe und finde die fehlende Zahl.",
        isSignature: false,
        data: {
          sequences: [
            { shown: [2, 4, 8, 16, 32], answers: [64, 128], hint: "Jede Zahl verdoppelt sich" },
            { shown: [1, 1, 2, 3, 5, 8], answers: [13, 21], hint: "Fibonacci \u2014 addiere die letzten zwei" },
            { shown: [3, 6, 11, 18, 27], answers: [38, 51], hint: "Die Differenzen wachsen: +3, +5, +7, +9..." },
          ],
        },
        hints: [
          "Die Abstände zwischen den Zahlen verändern sich regelmäßig.",
          "Versuche, die Differenzen der aufeinanderfolgenden Zahlen zu bilden.",
        ],
        clue: "LICHT",
        backgroundImage: "/images/puzzle-bg-ch2.png",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Kapitel 3 — Cassiopeia (Spiegelungen & Symmetrie)
  // ─────────────────────────────────────────────────────────
  {
    id: 3,
    name: "Cassiopeia",
    constellation: "Cassiopeia",
    theme: "Spiegelungen & Symmetrie",
    storyIntro:
      "Die eitle Königin Cassiopeia bewunderte einst ihr Spiegelbild in den stillen Gewässern des Kosmos. " +
      "Doch der Spiegel zerbrach und die symmetrischen Muster ihres Sternbilds gerieten in Unordnung. " +
      "Setze die Spiegelungen wieder zusammen und stelle die königliche Harmonie des W am Himmel wieder her.",
    storyOutro:
      "Cassiopeias Thron erstrahlt in vollkommener Symmetrie! Das markante W funkelt am Nordhimmel " +
      "und die Königin blickt zufrieden auf ihr wiederhergestelltes Reich.",
    introImage: "/images/chapter3-cassiopeia.png",
    puzzles: [
      {
        id: "ch3-symmetry",
        chapter: 3,
        puzzleIndex: 1,
        type: "symmetry",
        title: "Symmetrie-Puzzle",
        description:
          "Vervollständige das halbierte Sternenmuster, indem du die fehlende Spiegelhälfte ergänzt.",
        isSignature: true,
        data: {},
        hints: [
          "Die Spiegelachse verläuft genau durch die Mitte des Bildes.",
          "Achte darauf, dass auch die Helligkeiten der Sterne gespiegelt werden.",
        ],
        clue: "WEIST",
        backgroundImage: "/images/puzzle-bg-ch3.png",
      },
      {
        id: "ch3-anagram",
        chapter: 3,
        puzzleIndex: 2,
        type: "anagram",
        title: "Anagramm",
        description:
          "Ordne die durcheinander geratenen Buchstaben, um die Namen berühmter Sternbilder zu enthüllen.",
        isSignature: false,
        data: {},
        hints: [
          "Das erste Anagramm ergibt ein Sternbild mit fünf Buchstaben.",
          "Suche zuerst nach bekannten Buchstabenkombinationen wie 'RI' oder 'ON'.",
        ],
        clue: "WEIST",
        backgroundImage: "/images/puzzle-bg-ch3.png",
      },
      {
        id: "ch3-slide",
        chapter: 3,
        puzzleIndex: 3,
        type: "slide-puzzle",
        title: "Schiebepuzzle",
        description:
          "Verschiebe die Kacheln, um das Bild von Cassiopeias Sternbild wiederherzustellen.",
        isSignature: false,
        data: {},
        hints: [
          "Beginne damit, die obere Reihe in die richtige Position zu bringen.",
          "Löse das Puzzle Zeile für Zeile von oben nach unten.",
        ],
        clue: "WEIST",
        backgroundImage: "/images/puzzle-bg-ch3.png",
      },
      {
        id: "ch3-spotdiff",
        chapter: 3,
        puzzleIndex: 4,
        type: "spot-difference",
        title: "Unterschiede finden",
        description:
          "Vergleiche zwei Himmelsbilder und finde die versteckten Unterschiede zwischen ihnen.",
        isSignature: false,
        data: {},
        hints: [
          "Schaue genau auf die Helligkeit der einzelnen Sterne.",
          "Einer der Unterschiede versteckt sich in der unteren rechten Ecke.",
        ],
        clue: "WEIST",
        backgroundImage: "/images/puzzle-bg-ch3.png",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Kapitel 4 — Orion (Jagd & Strategie)
  // ─────────────────────────────────────────────────────────
  {
    id: 4,
    name: "Orion",
    constellation: "Orion",
    theme: "Jagd & Strategie",
    storyIntro:
      "Der mächtige Jäger Orion durchstreifte einst mit scharfem Verstand und klarem Blick den Himmel. " +
      "Nun sind seine Sterne verstreut, sein Gürtel zerbrochen und die Strategie des Jägers vergessen. " +
      "Nutze Logik und Scharfsinn, um Orions Sternbild Stück für Stück zusammenzusetzen.",
    storyOutro:
      "Orion erhebt sich in voller Pracht! Schultern, Gürtel und Schwert leuchten in majestätischem Glanz " +
      "und der große Jäger wacht wieder über den Winterhimmel.",
    introImage: "/images/chapter4-orion.png",
    puzzles: [
      {
        id: "ch4-logic",
        chapter: 4,
        puzzleIndex: 1,
        type: "logic-deduction",
        title: "Logik-Deduktion",
        description:
          "Löse ein kniffliges Einstein-Rätsel, um die Positionen der Sterne in Orions Gürtel zu bestimmen.",
        isSignature: true,
        data: {},
        hints: [
          "Beginne mit den Hinweisen, die nur eine mögliche Lösung zulassen.",
          "Der mittlere Stern des Gürtels hat eine besondere Eigenschaft.",
        ],
        clue: "DEN",
        backgroundImage: "/images/puzzle-bg-ch4.png",
      },
      {
        id: "ch4-rebus",
        chapter: 4,
        puzzleIndex: 2,
        type: "rebus",
        title: "Rebus / Bilderrätsel",
        description:
          "Entschlüssle die Bildfolge, die zusammen einen astronomischen Begriff ergibt.",
        isSignature: false,
        data: {},
        hints: [
          "Das erste Bild klingt wie ein alltäglicher Gegenstand.",
          "Kombiniere die Silben der Bildnamen zu einem einzigen Wort.",
        ],
        clue: "DEN",
        backgroundImage: "/images/puzzle-bg-ch4.png",
      },
      {
        id: "ch4-nonogram",
        chapter: 4,
        puzzleIndex: 3,
        type: "nonogram",
        title: "Nonogramm",
        description:
          "Fülle das Raster nach den Zahlenhinweisen und enthülle eine verborgene Sternen-Pixel-Art.",
        isSignature: false,
        data: {},
        hints: [
          "Suche zuerst nach Zeilen und Spalten, die fast vollständig gefüllt sind.",
          "Eine Zeile mit der Angabe '5' in einem 5er-Raster ist komplett ausgefüllt.",
        ],
        clue: "DEN",
        backgroundImage: "/images/puzzle-bg-ch4.png",
      },
      {
        id: "ch4-wordsearch",
        chapter: 4,
        puzzleIndex: 4,
        type: "word-search",
        title: "Wortsuche",
        description:
          "Finde die versteckten Wörter aus Orions Jagdrevier im Buchstabenfeld.",
        isSignature: false,
        data: {},
        hints: [
          "Die Wörter können auch diagonal und rückwärts versteckt sein.",
          "Suche zuerst nach dem längsten Wort in der Liste.",
        ],
        clue: "DEN",
        backgroundImage: "/images/puzzle-bg-ch4.png",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Kapitel 5 — Cygnus (Verwandlung & Metamorphose)
  // ─────────────────────────────────────────────────────────
  {
    id: 5,
    name: "Cygnus",
    constellation: "Cygnus",
    theme: "Verwandlung & Metamorphose",
    storyIntro:
      "Der Schwan Cygnus gleitet seit Äonen über die Milchstraße, ein Symbol ewiger Verwandlung. " +
      "Doch ein dunkler Schleier hat seine Schwingen verhüllt und seine Sterne in Chiffren verwandelt. " +
      "Entschlüssle die Codes der Verwandlung und lass den Schwan erneut über das Sternenband fliegen.",
    storyOutro:
      "Der Schwan breitet seine leuchtenden Schwingen aus! Cygnus gleitet wieder majestätisch " +
      "über die Milchstraße und sein Kreuz erstrahlt in silberweißem Glanz.",
    introImage: "/images/chapter5-cygnus.png",
    puzzles: [
      {
        id: "ch5-cipher",
        chapter: 5,
        puzzleIndex: 1,
        type: "cipher",
        title: "Chiffre knacken",
        description:
          "Eine geheime Botschaft wurde mit einer Caesar-Verschlüsselung codiert. Finde den Schlüssel und entschlüssle sie.",
        isSignature: true,
        data: {},
        hints: [
          "Versuche verschiedene Verschiebungen, beginnend bei 3.",
          "Das häufigste Zeichen im Chiffretext steht vermutlich für 'E'.",
        ],
        clue: "WEG",
        backgroundImage: "/images/puzzle-bg-ch5.png",
      },
      {
        id: "ch5-jigsaw",
        chapter: 5,
        puzzleIndex: 2,
        type: "jigsaw",
        title: "Jigsaw-Puzzle",
        description:
          "Setze die Puzzleteile zusammen, um das vollständige Sternbild des Schwans zu enthüllen.",
        isSignature: false,
        data: {},
        hints: [
          "Beginne mit den Randstücken und arbeite dich nach innen vor.",
          "Die Teile mit den hellsten Sternen gehören zur Mitte des Bildes.",
        ],
        clue: "WEG",
        backgroundImage: "/images/puzzle-bg-ch5.png",
      },
      {
        id: "ch5-sudoku",
        chapter: 5,
        puzzleIndex: 3,
        type: "star-sudoku",
        title: "Sternen-Sudoku",
        description:
          "Fülle das 6x6-Raster mit Sternsymbolen, sodass jedes Symbol in jeder Zeile und Spalte genau einmal vorkommt.",
        isSignature: false,
        data: {},
        hints: [
          "Beginne mit der Zeile oder Spalte, die bereits die meisten Symbole enthält.",
          "In Block 2 fehlt nur noch das Mond-Symbol.",
        ],
        clue: "WEG",
        backgroundImage: "/images/puzzle-bg-ch5.png",
      },
      {
        id: "ch5-pipes",
        chapter: 5,
        puzzleIndex: 4,
        type: "pipe-puzzle",
        title: "Pipe-Puzzle",
        description:
          "Drehe die Rohrstücke, um die Sternenlicht-Bahnen vom Quellstern zum Zielstern zu verbinden.",
        isSignature: false,
        data: {},
        hints: [
          "Beginne beim Quellstern und arbeite dich Stück für Stück vor.",
          "Manche Rohrstücke haben nur zwei mögliche Ausrichtungen.",
        ],
        clue: "WEG",
        backgroundImage: "/images/puzzle-bg-ch5.png",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Kapitel 6 — Draco (Altes Wissen & Rätsel)
  // ─────────────────────────────────────────────────────────
  {
    id: 6,
    name: "Draco",
    constellation: "Draco",
    theme: "Altes Wissen & Rätsel",
    storyIntro:
      "Der uralte Drache Draco hütet seit Anbeginn der Zeit die Geheimnisse des Universums. " +
      "Doch sein Wissen liegt nun verschlüsselt in blinkenden Sternen und vergessenen Silben verborgen. " +
      "Beweise dein Wissen und entschlüssle die Rätsel des Drachen, um seine uralte Weisheit zu befreien.",
    storyOutro:
      "Draco entrollt sich in seiner vollen Länge über den Nordhimmel! Der Drache teilt nun bereitwillig " +
      "sein uraltes Wissen und seine Sterne funkeln wie kostbare Juwelen.",
    introImage: "/images/chapter6-draco.png",
    puzzles: [
      {
        id: "ch6-quiz",
        chapter: 6,
        puzzleIndex: 1,
        type: "quiz",
        title: "Wissens-Quiz",
        description:
          "Beantworte Multiple-Choice-Fragen zu Astronomie und Mythologie, um den Drachen zu beeindrucken.",
        isSignature: true,
        data: {},
        hints: [
          "Die Antwort auf die erste Frage hat mit griechischer Mythologie zu tun.",
          "Bei der dritten Frage ist es hilfreich, an die Größe der Planeten zu denken.",
        ],
        clue: "HEIM",
        backgroundImage: "/images/puzzle-bg-ch6.png",
      },
      {
        id: "ch6-morse",
        chapter: 6,
        puzzleIndex: 2,
        type: "morse-code",
        title: "Morse-Code",
        description:
          "Die Sterne von Draco blinken in einem rhythmischen Muster. Entschlüssle den Morse-Code.",
        isSignature: false,
        data: {},
        hints: [
          "Kurzes Blinken ist ein Punkt, langes Blinken ein Strich.",
          "Das erste Wort hat vier Buchstaben und beginnt mit 'S'.",
        ],
        clue: "HEIM",
        backgroundImage: "/images/puzzle-bg-ch6.png",
      },
      {
        id: "ch6-tangram",
        chapter: 6,
        puzzleIndex: 3,
        type: "tangram",
        title: "Tangram",
        description:
          "Lege die geometrischen Formen so zusammen, dass sie die Silhouette des Drachen-Sternbilds ergeben.",
        isSignature: false,
        data: {},
        hints: [
          "Das große Dreieck bildet den Kopf des Drachen.",
          "Der Schwanz besteht aus dem Parallelogramm und dem kleinen Dreieck.",
        ],
        clue: "HEIM",
        backgroundImage: "/images/puzzle-bg-ch6.png",
      },
      {
        id: "ch6-syllables",
        chapter: 6,
        puzzleIndex: 4,
        type: "syllable-puzzle",
        title: "Silbenrätsel",
        description:
          "Kombiniere die verstreuten Silben zu vollständigen astronomischen Begriffen.",
        isSignature: false,
        data: {},
        hints: [
          "Eine der gesuchten Silbenkombinationen ergibt 'Ga-la-xie'.",
          "Achte auf Silben, die nur zu einem einzigen Wort passen können.",
        ],
        clue: "HEIM",
        backgroundImage: "/images/puzzle-bg-ch6.png",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Kapitel 7 — Corona Borealis (Krone & Vollendung)
  // ─────────────────────────────────────────────────────────
  {
    id: 7,
    name: "Corona Borealis",
    constellation: "Corona Borealis",
    theme: "Krone & Vollendung",
    storyIntro:
      "Die Nördliche Krone ist das letzte Sternbild, das auf seine Wiederherstellung wartet. " +
      "In ihr vereinen sich die Erkenntnisse aller bisherigen Abenteuer zu einem großen Ganzen. " +
      "Setze die gesammelten Hinweise zusammen und vollende die Sternenreise mit der Krönung des Himmels.",
    storyOutro:
      "Die Corona Borealis erstrahlt in vollem Glanz! Alle sieben Sternbilder leuchten nun vereint am Firmament. " +
      "Die Sternenreise ist vollendet und der Nachthimmel singt wieder sein uraltes Lied.",
    introImage: "/images/chapter7-corona-borealis.png",
    puzzles: [
      {
        id: "ch7-meta",
        chapter: 7,
        puzzleIndex: 1,
        type: "meta-puzzle",
        title: "Meta-Rätsel",
        description:
          "Kombiniere die Hinweise aus allen vorherigen Kapiteln, um die finale Botschaft der Sterne zu enthüllen.",
        isSignature: true,
        data: {},
        hints: [
          "Jedes abgeschlossene Kapitel hat dir ein Wort offenbart.",
          "Setze die sechs Wörter in der Reihenfolge der Kapitel zusammen.",
        ],
        backgroundImage: "/images/puzzle-bg-ch7.png",
      },
      {
        id: "ch7-simon",
        chapter: 7,
        puzzleIndex: 2,
        type: "simon-says",
        title: "Simon Says",
        description:
          "Beobachte die leuchtende Sternensequenz und wiederhole sie in der richtigen Reihenfolge.",
        isSignature: false,
        data: {},
        hints: [
          "Die Sequenz wird mit jedem Durchgang um einen Stern länger.",
          "Sprich die Farben leise mit, um dir die Reihenfolge besser zu merken.",
        ],
        backgroundImage: "/images/puzzle-bg-ch7.png",
      },
      {
        id: "ch7-sorting",
        chapter: 7,
        puzzleIndex: 3,
        type: "sorting",
        title: "Sortier-Rätsel",
        description:
          "Bringe die Himmelskörper in die richtige Reihenfolge, von der Sonne bis zum Rand des Sonnensystems.",
        isSignature: false,
        data: {},
        hints: [
          "Merkspruch: 'Mein Vater erklärt mir jeden Sonntag unseren Nachthimmel.'",
          "Der größte Planet befindet sich an fünfter Stelle.",
        ],
        backgroundImage: "/images/puzzle-bg-ch7.png",
      },
      {
        id: "ch7-image",
        chapter: 7,
        puzzleIndex: 4,
        type: "image-puzzle",
        title: "Bilderrätsel",
        description:
          "Erkenne die Details aus den Kapitelbildern deiner Reise und beantworte die Fragen dazu.",
        isSignature: false,
        data: {},
        hints: [
          "Schau dir die Einleitungsbilder der vorherigen Kapitel noch einmal genau an.",
          "Die Antwort auf die dritte Frage findest du im Bild von Kapitel 3.",
        ],
        backgroundImage: "/images/puzzle-bg-ch7.png",
      },
    ],
  },
];

// Meta-puzzle solution: STERN LICHT WEIST DEN WEG HEIM
// "Sternlicht weist den Weg heim."

export function getChapter(id: number): ChapterDef | undefined {
  return chapters.find((c) => c.id === id);
}

export function getAllChapters(): ChapterDef[] {
  return chapters;
}
