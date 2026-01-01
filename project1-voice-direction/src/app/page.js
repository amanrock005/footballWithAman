'use client';

import { useEffect, useRef, useState } from 'react';

const COMMANDS = [
  "left",
  "right",
  "forward",
  "backward",
  "stop",
  "charge",
];

const MIN_DELAY = 2000;
const MAX_DELAY = 5000;
const SESSION_DURATION = 2 * 60 * 1000; // 2 minutes

const randomCommand = () =>
  COMMANDS[Math.floor(Math.random() * COMMANDS.length)];

const randomDelay = () =>
  Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;

export default function Home() {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);

  const loopRef = useRef(false);
  const timeoutRef = useRef(null);
  const endTimerRef = useRef(null);
  const countdownRef = useRef(null);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const loop = async () => {
    while (loopRef.current) {
      speak(randomCommand());
      await new Promise((r) => {
        timeoutRef.current = setTimeout(r, randomDelay());
      });
    }
  };

  const start = () => {
    if (running) return;

    loopRef.current = true;
    setRunning(true);
    setTimeLeft(SESSION_DURATION);

    loop();

    // Auto-end after 2 minutes
    endTimerRef.current = setTimeout(() => {
      stop(true);
    }, SESSION_DURATION);

    // Countdown timer
    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1000, 0));
    }, 1000);
  };

  const stop = (auto = false) => {
    loopRef.current = false;
    setRunning(false);

    clearTimeout(timeoutRef.current);
    clearTimeout(endTimerRef.current);
    clearInterval(countdownRef.current);

    window.speechSynthesis.cancel();

    if (auto) speak("end");
  };

  useEffect(() => {
    return () => stop();
  }, []);

  const formatTime = (ms) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-40">
      <div className="flex items-center justify-center">
        <button
          onClick={start}
          disabled={running}
          className="px-6 py-3 rounded-full bg-gray-500 disabled:opacity-50"
        >
          Start
        </button>

        <button
          onClick={() => stop()}
          disabled={!running}
          className="ml-10 px-6 py-3 rounded-full bg-gray-500 disabled:opacity-50"
        >
          End
        </button>
      </div>

      <div className="mt-10 text-xl font-semibold">
        Time Remaining: {formatTime(timeLeft)}
      </div>
    </div>
  );
}


