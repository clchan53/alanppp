"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NUM_WORDS = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

const PRAISES = [
  "You did it! You are a Time Master! ⏰",
  "Fantastic! You know all the times! 🎉",
  "Awesome job! I'm so proud of you! ⭐",
  "Brilliant! You can read the clock perfectly! 🚀"
];

// 根據小時同分鐘產生正確嘅英文讀法
const getEnglishTime = (h: number, m: number) => {
  const currentH = h === 12 ? 12 : h % 12;
  const nextH = (currentH + 1) > 12 ? 1 : currentH + 1;

  if (m === 0) return `${NUM_WORDS[currentH]} o'clock`;
  if (m === 15) return `quarter past ${NUM_WORDS[currentH]}`;
  if (m === 30) return `half past ${NUM_WORDS[currentH]}`;
  if (m === 45) return `quarter to ${NUM_WORDS[nextH]}`;
  return "";
};

type TimeState = { h: number; m: number };

export default function ClockGame() {
  const [activeTab, setActiveTab] = useState<"learn" | "quiz">("learn");

  // 探索模式狀態
  const [learnTime, setLearnTime] = useState<TimeState>({ h: 8, m: 0 });

  // 挑戰模式狀態
  const [targetTime, setTargetTime] = useState<TimeState>({ h: 1, m: 0 });
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [isFinished, setIsFinished] = useState(false);
  const [praiseText, setPraiseText] = useState("");

  const playSound = (sound: "coin" | "bump" | "success") => {
    try { const audio = new Audio(`/${sound}.mp3`); audio.play().catch(() => {}); } catch (e) {}
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-GB"; // 使用英式英文發音
      utterance.rate = 0.8; 
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- 探索模式邏輯 ---
  const handleLearnClick = (minute: number) => {
    const randomH = Math.floor(Math.random() * 12) + 1;
    const newTime = { h: randomH, m: minute };
    setLearnTime(newTime);
    speak(getEnglishTime(randomH, minute));
  };

  // --- 挑戰模式邏輯 ---
  const generateQuiz = () => {
    const randomH = Math.floor(Math.random() * 12) + 1;
    const minutesArray = [0, 15, 30, 45];
    const randomM = minutesArray[Math.floor(Math.random() * minutesArray.length)];
    const correctAns = getEnglishTime(randomH, randomM);

    const opts = new Set([correctAns]);
    while (opts.size < 4) {
      const wrongH = Math.floor(Math.random() * 12) + 1;
      const wrongM = minutesArray[Math.floor(Math.random() * minutesArray.length)];
      opts.add(getEnglishTime(wrongH, wrongM));
    }

    setTargetTime({ h: randomH, m: randomM });
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    setFeedback("idle");
  };

  const startQuiz = () => {
    setActiveTab("quiz");
    setScore(0);
    setQIndex(0);
    setIsFinished(false);
    generateQuiz();
  };

  const handleAnswer = (selectedOpt: string) => {
    if (feedback !== "idle" || isFinished) return;

    const correctAns = getEnglishTime(targetTime.h, targetTime.m);

    if (selectedOpt === correctAns) {
      playSound("coin");
      setFeedback("correct");
      setScore((s) => s + 1);
      speak(correctAns);

      setTimeout(() => {
        if (qIndex + 1 >= 10) {
          const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
          setPraiseText(praise);
          setIsFinished(true);
          playSound("success");
        } else {
          setQIndex((prev) => prev + 1);
          generateQuiz();
        }
      }, 1500);
    } else {
      playSound("bump");
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  // --- 時鐘畫面繪製組件 ---
  const ClockFace = ({ time }: { time: TimeState }) => {
    const hourAngle = (time.h % 12) * 30 + (time.m / 2); // 每小時 30 度，每分鐘加 0.5 度
    const minuteAngle = time.m * 6; // 每分鐘 6 度

    return (
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-full border-8 border-violet-400 shadow-xl flex items-center justify-center mb-8">
        {/* 數字盤 */}
        {[...Array(12)].map((_, i) => {
          const num = i + 1;
          const angle = (num * 30 - 90) * (Math.PI / 180);
          const radius = 100; // 數字離中心距離
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div
              key={num}
              className="absolute text-2xl font-black text-violet-800"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              {num}
            </div>
          );
        })}
        {/* 時針 (短、粗、黑色) */}
        <motion.div
          animate={{ rotate: hourAngle }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
          className="absolute w-2.5 h-16 sm:h-20 bg-gray-800 rounded-full origin-bottom"
          style={{ bottom: "50%" }}
        />
        {/* 分針 (長、幼、紅色) */}
        <motion.div
          animate={{ rotate: minuteAngle }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
          className="absolute w-1.5 h-24 sm:h-28 bg-red-500 rounded-full origin-bottom"
          style={{ bottom: "50%" }}
        />
        {/* 中心點 */}
        <div className="absolute w-4 h-4 bg-violet-600 rounded-full z-10" />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] bg-[#F5F3FF] rounded-3xl p-4 sm:p-8 shadow-inner select-none overflow-hidden relative font-sans">
      
      {/* 導航分頁 */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 z-10 w-full">
        <button onClick={() => { setActiveTab("learn"); speak("Let's explore the clock!"); }} className={`px-5 py-2.5 rounded-full font-bold text-lg transition-all ${activeTab === "learn" ? "bg-violet-500 text-white shadow-md scale-105" : "bg-white text-violet-600 border-2 border-violet-200"}`}>👀 1. 探索時鐘</button>
        <button onClick={startQuiz} className={`px-5 py-2.5 rounded-full font-bold text-lg transition-all ${activeTab === "quiz" ? "bg-purple-500 text-white shadow-md scale-105" : "bg-white text-purple-600 border-2 border-purple-200"}`}>⚔️ 2. 時間挑戰</button>
      </div>

      {/* 模式 1：探索時鐘 */}
      {activeTab === "learn" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl flex flex-col items-center">
          <ClockFace time={learnTime} />
          
          <div className="bg-white px-8 py-4 rounded-3xl shadow-md border-4 border-violet-200 mb-8 text-center min-w-[280px]">
            <p className="text-3xl font-black text-violet-700">{getEnglishTime(learnTime.h, learnTime.m)}</p>
            <p className="text-xl font-bold text-gray-400 mt-1">{learnTime.h}:{learnTime.m === 0 ? "00" : learnTime.m}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            <button onClick={() => handleLearnClick(0)} className="py-4 bg-violet-100 hover:bg-violet-200 text-violet-800 text-2xl font-black rounded-2xl shadow-sm border-b-4 border-violet-300">... o'clock (正)</button>
            <button onClick={() => handleLearnClick(15)} className="py-4 bg-blue-100 hover:bg-blue-200 text-blue-800 text-2xl font-black rounded-2xl shadow-sm border-b-4 border-blue-300">quarter past (15分)</button>
            <button onClick={() => handleLearnClick(30)} className="py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-2xl font-black rounded-2xl shadow-sm border-b-4 border-emerald-300">half past (30分)</button>
            <button onClick={() => handleLearnClick(45)} className="py-4 bg-rose-100 hover:bg-rose-200 text-rose-800 text-2xl font-black rounded-2xl shadow-sm border-b-4 border-rose-300">quarter to (45分)</button>
          </div>
        </motion.div>
      )}

      {/* 模式 2：挑戰模式 */}
      {activeTab === "quiz" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl flex flex-col items-center">
          
          <div className="absolute top-6 right-6 flex items-center gap-3 bg-white p-3 px-6 rounded-full border-4 border-purple-300 z-10 shadow-sm">
            <span className="text-3xl">⭐</span>
            <span className="text-3xl font-extrabold text-purple-600 font-mono tracking-tighter">{score} / 10</span>
          </div>

          {!isFinished && (
            <div className="w-full max-w-sm mx-auto bg-purple-100 rounded-full h-3 mb-6 relative overflow-hidden border border-purple-200 mt-16 sm:mt-0">
              <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${(qIndex / 10) * 100}%` }} />
            </div>
          )}

          <h2 className="text-2xl font-black text-purple-600 mb-6">What time is it? (這是什麼時間？)</h2>
          
          <ClockFace time={targetTime} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
            {options.map((opt, i) => (
              <motion.button
                key={i}
                animate={feedback === "wrong" && opt !== getEnglishTime(targetTime.h, targetTime.m) ? { x: [-10, 10, -10, 10, 0] } : {}}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(opt)}
                className="py-6 px-4 bg-white text-gray-800 text-2xl sm:text-3xl font-black rounded-3xl border-b-8 border-purple-200 hover:bg-purple-50 active:border-b-4 active:translate-y-1 transition-all shadow-md"
              >
                {opt}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {isFinished && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center">
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[120px] mb-4">🏆</motion.div>
                <h1 className="text-5xl font-black text-purple-600 mb-6">Mission Complete!</h1>
                <p className="text-3xl font-extrabold text-orange-500 mb-10">{praiseText}</p>
                <button onClick={startQuiz} className="px-10 py-5 bg-purple-500 text-white text-2xl font-black rounded-full shadow-[0_8px_0_0_#7E22CE] hover:bg-purple-600 active:translate-y-1 active:shadow-none transition-all">Play Again 🚀</button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {feedback === "correct" && !isFinished && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} exit={{ scale: 0 }} className="absolute inset-0 m-auto w-32 h-32 text-[100px] z-20 flex items-center justify-center pointer-events-none">✅</motion.div>}
            {feedback === "wrong" && <motion.div initial={{ x: -20 }} animate={{ x: [0, -20, 20, -20, 20, 0] }} className="absolute inset-0 m-auto w-32 h-32 text-[100px] z-20 flex items-center justify-center pointer-events-none">❌</motion.div>}
          </AnimatePresence>

        </motion.div>
      )}

    </div>
  );
}