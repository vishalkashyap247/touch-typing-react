import { useState, useEffect, useRef } from "react";
// import randomWords from "random-words";
import "./home.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// const NUMB_OF_WORDS = 50;
// const SECONDS = 60;
const TimerDuration = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
};

const Difficulty = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  DIFFERENT1: "different1",
};

function Home() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(TimerDuration.FIVE_MINUTES);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const [history, setHistory] = useState([]);
  const [difficulty, setDifficulty] = useState(Difficulty.MEDIUM);
  const [timerDuration, setTimerDuration] = useState(
    TimerDuration.FIVE_MINUTES
  );
  // var startedTimer;
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  function generateWords() {
    const validChars = ["a", "s", "d", "f", "j", "k", "l"];
    const semicolonFrequency = 0.3;
    const minLength = 3;
    const maxLength = 5;
    const minWords = 170;

    const words = [];

    while (words.length < minWords) {
      const wordLength =
        Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
      let word = "";
      let hasSemicolon = Math.random() < semicolonFrequency;

      for (let i = 0; i < wordLength; i++) {
        if (i === 3 && hasSemicolon) {
          word += ";";
        } else {
          word += validChars[Math.floor(Math.random() * validChars.length)];
        }
      }

      words.push(word);
    }

    return words;
  }

  function start() {
    if (status === "finished") {
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      setCurrChar("");
      setHistory([]);
    }

    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            return timerDuration;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  }

  function handleKeyDown({ keyCode, key }) {
    // space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
      // backspace
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
      setHistory((prevHistory) => [
        ...prevHistory,
        { word: wordToCompare, isCorrect: true },
      ]);
    } else {
      setIncorrect(incorrect + 1);
      setHistory((prevHistory) => [
        ...prevHistory,
        { word: wordToCompare, isCorrect: false },
      ]);
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  function getWordClass(wordIdx) {
    if (difficulty === Difficulty.MEDIUM) {
      if (wordIdx === currWordIndex && status === "started") {
        return "is-blue";
      } else if (wordIdx < currWordIndex) {
        return "is-grey";
      }
    } else if (difficulty === Difficulty.EASY) {
      const currentWord = words[wordIdx];
      const typedWord = currInput.trim();

      if (wordIdx === currWordIndex) {
        if (typedWord.length === 0) {
          return "";
        } else if (currentWord.startsWith(typedWord)) {
          return "is-green";
        } else {
          return "is-red";
        }
      } else {
        return "is-grey";
      }
    } else {
      return "";
    }
  }

  function handleTimerDurationChange(event) {
    const selectedDuration = parseInt(event.target.value);
    setTimerDuration(selectedDuration);
    setCountDown(selectedDuration);
  }

  function handleReset() {
    window.location.reload();
  }

  return (
    <div className="home">
      <div className="timer">
        <p>{formatTime(countDown)}</p>
      </div>

      {status === "started" && (
        <div className="writeThisText">
          {words.map((word, i) => (
            <span key={i} className={`word ${getWordClass(i)}`}>
              {word}{" "}
            </span>
          ))}
        </div>
      )}
      <div className="inputDiv">
        <form autoComplete="off">
          <input
            ref={textInput}
            disabled={status !== "started"}
            {...(difficulty === Difficulty.DIFFERENT1
              ? { type: "password" }
              : { type: "text" })}
            className=""
            onKeyDown={handleKeyDown}
            value={currInput}
            onChange={(e) => setCurrInput(e.target.value.trim())}
            placeholder="write here"
          />
        </form>
        <div className="button">
          {status === "started" ? (
            <button className="" onClick={handleReset}>
              Reset
            </button>
          ) : (
            <button className="" onClick={start}>
              Lets start
            </button>
          )}
        </div>
        {status !== "started" && (
          <div className="menu">
            <p>Options:</p>
            {/* <Box sx={{ minWidth: 100 }}> */}
            <div className="menuDropdown">
              <FormControl className="first" fullWidth size="small">
                <InputLabel id="difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-label"
                  id="difficulty-select"
                  value={difficulty}
                  label="Difficulty"
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <MenuItem value={Difficulty.EASY}>Easy</MenuItem>
                  <MenuItem value={Difficulty.MEDIUM}>Medium</MenuItem>
                  <MenuItem value={Difficulty.HARD}>Hard</MenuItem>
                  <MenuItem value={Difficulty.DIFFERENT1}>Different1</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="timer-duration-label">
                  Timer Duration
                </InputLabel>
                <Select
                  labelId="timer-duration-label"
                  id="timer-duration-select"
                  value={timerDuration}
                  label="Timer Duration"
                  onChange={handleTimerDurationChange}
                >
                  <MenuItem value={TimerDuration.ONE_MINUTE}>1 Minute</MenuItem>
                  <MenuItem value={TimerDuration.FIVE_MINUTES}>
                    5 Minutes
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {/* </Box> */}
          </div>
        )}
      </div>
      {status === "finished" && (
        <div className="resultMain">
          <p className="timer">Result time</p>
          <div className="result">
            <div className="">
              <div className="">
                <span className="">Words per minute: </span>
                <span className="">{correct / (timerDuration / 60)}</span>
              </div>
              <div className="">
                <span className="">Accuracy: </span>

                {correct !== 0 ? (
                  <span className="">
                    {Math.round((correct / (correct + incorrect)) * 100)}%
                  </span>
                ) : (
                  <span className="">0%</span>
                )}
              </div>
            </div>
            <div className="">
              <h4 className="mrgTop">Given string: </h4>
              {words.map((word, i) => (
                <span key={i}>{word} </span>
              ))}
              <h4 className="mrgTop">Your string:</h4>
              <p className="history">
                {history.map((entry, index) => (
                  <span
                    key={index}
                    className={entry.isCorrect ? "is-correct" : "is-incorrect"}
                  >
                    <span>{entry.word} </span>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
