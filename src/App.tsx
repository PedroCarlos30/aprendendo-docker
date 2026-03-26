import { useEffect, useMemo, useState } from "react";

const WORDS: string[] = [
  "PROGRAMACAO",
  "COMPUTADOR",
  "ALGORITMO",
  "JAVASCRIPT",
  "TAILWIND",
  "INTERNET",
];

const MAX_ERRORS = 6;

const HANGMAN: string[] = [
` +---+
 |   |
     |
     |
     |
     |
=======`,
` +---+
 |   |
 O   |
     |
     |
     |
=======`,
` +---+
 |   |
 O   |
 |   |
     |
     |
=======`,
` +---+
 |   |
 O   |
/|   |
     |
     |
=======`,
` +---+
 |   |
 O   |
/|\\  |
     |
     |
=======`,
` +---+
 |   |
 O   |
/|\\  |
/    |
     |
=======`,
` +---+
 |   |
 O   |
/|\\  |
/ \\  |
     |
=======`,
];

export default function App() {
  const [word, setWord] = useState<string>("");
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const letters = useMemo<string[]>(
    () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    []
  );

  function startGame(): void {
    const random = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(random);
    setGuessed(new Set());
    setErrors(0);
    setMessage("");
  }

  useEffect(() => {
    startGame();
  }, []);

  function guess(letter: string): void {
    if (guessed.has(letter) || message) return;

    const next = new Set(guessed);
    next.add(letter);
    setGuessed(next);

    if (!word.includes(letter)) {
      setErrors((e) => e + 1);
    }
  }

  const displayWord: string = word
    .split("")
    .map((l) => (guessed.has(l) ? l : "_"))
    .join(" ");

  useEffect(() => {
    if (!word) return;

    const won = word.split("").every((l) => guessed.has(l));
    if (won) {
      setMessage("🎉 Você venceu!");
    } else if (errors >= MAX_ERRORS) {
      setMessage(`💀 Você perdeu! Palavra: ${word}`);
    }
  }, [guessed, errors, word]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-6">🎮 Jogo da Forca</h1>

        <pre className="text-green-400 text-lg h-40 whitespace-pre">
          {HANGMAN[errors]}
        </pre>

        <div className="text-3xl tracking-widest my-6">
          {displayWord}
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {letters.map((letter) => {
            const disabled = guessed.has(letter) || !!message;

            return (
              <button
                key={letter}
                onClick={() => guess(letter)}
                disabled={disabled}
                className={`p-2 rounded transition ${
                  disabled
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <div className="text-xl font-semibold mb-4">
          {message}
        </div>

        <button
          onClick={startGame}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}