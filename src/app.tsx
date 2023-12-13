import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { LOREM_TEXT } from "./data/text";
import { parseTextToWords } from "./utils/parse-text-to-words";
import { parseTimeToHours } from "./utils/parse-time-to-hours";

const DEFAULT_TIME = 60;

function App() {
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  const [testOver, setTestOver] = useState(false);
  const [time, setTime] = useState(DEFAULT_TIME);
  const [timeRunning, setTimeRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState(parseTextToWords({ text: LOREM_TEXT }));
  const [inputWord, setInputWord] = useState("");

  const { total, correct, incorrect } = useMemo(() => {
    let correct = 0;
    let incorrect = 0;

    for (let i = 0; i <= currentIndex; i++) {
      const { state } = words[i];
      if (state === "good") correct++;
      if (state === "bad") incorrect++;
    }

    const total = correct + incorrect;

    return { total, correct, incorrect };
  }, [words, currentIndex]);

  useEffect(() => {
    if (time === 0) {
      setTimeRunning(false);
      setTestOver(true);
    }
  }, [time]);

  useEffect(() => {
    if (time === 0) return setTime(DEFAULT_TIME);

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    if (!timeRunning) return clearInterval(interval);

    return () => clearInterval(interval);
  }, [timeRunning, time]);

  const nextWord = () => {
    if (currentIndex === words.length - 1) return;

    const { current: paragraph } = paragraphRef;

    if (!paragraph) return;

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);

    const spanWord = paragraph.children[newIndex];
    spanWord.scrollIntoView();
  };

  const handleInputFocus = () => setTimeRunning(true);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code !== "Space") return;

    event.preventDefault();

    setWords((prevWords) => {
      const draft = [...prevWords];

      const state = inputWord === draft[currentIndex].word ? "good" : "bad";
      draft[currentIndex].state = state;

      return draft;
    });

    setInputWord("");
    nextWord();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputWord(event.target.value);
  };

  return (
    <>
      <header className="max-w-screen-sm p-4 mx-auto">
        <h1 className="text-2xl leading-[1] font-bold tracking-tighter">
          🔥 Fast Fingers
        </h1>
      </header>
      <main className="max-w-screen-sm px-4 pt-10 mx-auto">
        {!testOver ? (
          <section className="flex flex-col gap-4">
            <p className="text-xl flex gap-2 rounded w-fit leading-[1]">
              <span className="font-bold">Time</span>
              <span>{parseTimeToHours({ time })}</span>
            </p>
            <article className="flex flex-col gap-1">
              <header className="flex gap-2 text-xs">
                <p className="text-zinc-500">
                  <span className="font-bold">Total Words:</span> {total}
                </p>
                <p className="ml-auto text-green-500">
                  <span className="font-bold text-green-600">
                    Correct Words:
                  </span>{" "}
                  {correct}
                </p>
                <p className="text-red-500">
                  <span className="font-bold text-red-600">
                    Incorrect Words:
                  </span>{" "}
                  {incorrect}
                </p>
              </header>
              <div className="relative p-4 border rounded border-zinc-500">
                {!timeRunning && (
                  <div className="absolute inset-0 grid p-4 rounded place-items-center bg-zinc-900/90 backdrop-blur-sm">
                    <p className="text-3xl font-bold text-center uppercase text-zinc-50">
                      Select the input to start
                    </p>
                  </div>
                )}
                <p
                  ref={paragraphRef}
                  className="flex flex-wrap gap-x-1 gap-y-2 text-2xl h-[168px] text-zinc-500 overflow-hidden"
                >
                  {words.map(({ index, word, state }) => (
                    <span
                      key={index}
                      data-state={index === currentIndex ? "current" : state}
                      className="p-[6px] rounded leading-[1] data-[state=current]:bg-zinc-200/50 data-[state=current]:text-zinc-900 data-[state=current]:font-bold data-[state=good]:bg-green-200/50 data-[state=good]:text-green-600 data-[state=bad]:bg-red-200/50 data-[state=bad]:text-red-500"
                    >
                      {word}
                    </span>
                  ))}
                </p>
              </div>
            </article>
            <input
              type="text"
              onFocus={handleInputFocus}
              onKeyDown={handleInputKeyDown}
              onChange={handleInputChange}
              value={inputWord}
              className="flex-1 px-4 py-2 text-sm rounded border-zinc-500 text-zinc-900"
            />
          </section>
        ) : (
          <section>
            <h2>Test is over</h2>
            <button onClick={() => setTestOver(false)}>Retry test</button>
          </section>
        )}
      </main>
    </>
  );
}

export default App;
