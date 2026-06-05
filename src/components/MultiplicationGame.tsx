"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- 九因歌發聲引擎 ---
const CH_NUMS = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

// 動態生成傳統九因歌口訣 (例如 3x4 -> 三四一十二, 2x5 -> 二五得一十)
const getChant = (a: number, b: number) => {
  const p = a * b;
  const chA = CH_NUMS[a];
  const chB = CH_NUMS[b];
  
  if (p < 10) {
    // 傳統上 3x3 會讀「三三歸九」，其他讀「如」
    if (a === 3 && b === 3) return "三三歸九";
    return `${chA}${chB}如${CH_NUMS[p]}`;
  }
  if (p === 10) return `${chA}${chB}得一十`;
  
  const tens = Math.floor(p / 10);
  const units = p % 10;
  const chTens = tens === 1 ? "一十" : `${CH_NUMS[tens]}十`;
  const chUnits = units === 0 ? "" : CH_NUMS[units];
  
  return `${chA}${chB}${chTens}${chUnits}`;
};

const PRAISES = [
  "你好叻呀！九因歌大師！🍎",
  "太完美喇！全部答啱晒！🎉",
  "爸爸為你感到驕傲！好聰明！⭐",
  "你已經背熟喇！超級棒！🚀"
];

type QuizQuestion = { a: number; b: number; ans: number; chant: string };

export default function MultiplicationGame() {
  const [activeTab, setActiveTab] = useState<"learn" | "quiz">("learn");
  
  // --- 學習模式狀態 ---
  const [learnTable, setLearnTable] = useState(2); // 預設學 2 的乘數表
  const [learnMultiplier, setLearnMultiplier] = useState(1);

  // --- 挑戰模式狀態 ---
  const [quizDeck, setQuizDeck] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizOptions, setQuizOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [isFinished, setIsFinished] = useState(false);
  const [praiseText, setPraiseText] = useState("");

  const playSound = (sound: "coin" | "bump") => {
    try { const audio = new Audio(`/${sound}.mp3`); audio.play().catch(()=>{}); } catch (e) {}
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-HK"; 
      utterance.rate = 0.85; // 稍微放慢，啱聽口訣
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- 學習模式：點擊蘋果 ---
  const handleLearnClick = (a: number, b: number) => {
    setLearnTable(a);
    setLearnMultiplier(b);
    const chant = getChant(a, b);
    speak(chant);
  };

  // --- 挑戰模式：產生 10 題隨機不重覆題目 ---
  const initQuiz = () => {
    const allPairs: QuizQuestion[] = [];
    // 挑選 2 至 9 的乘數表進行挑戰
    for (let i = 2; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        allPairs.push({ a: i, b: j, ans: i * j, chant: getChant(i, j) });
      }
    }
    
    // 洗牌並抽出 10 題
    const shuffled = allPairs.sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizDeck(shuffled);
    setQuizIndex(0);
    setIsFinished(false);
    setScore(0);
    setFeedback("idle");
    generateOptions(shuffled[0]);
  };

  const generateOptions = (question: QuizQuestion) => {
    const opts = new Set([question.ans]);
    while (opts.size < 4) {
      // 產生附近嘅混淆數字 (例如加上或減去 a)
      const offset = (Math.floor(Math.random() * 3) + 1) * question.a;
      const isAdd = Math.random() > 0.5;
      const wrong = isAdd ? question.ans + offset : question.ans - offset;
      if (wrong > 0 && wrong !== question.ans) opts.add(wrong);
    }
    setQuizOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    initQuiz();
  }, []);

  // 主動觸發對答案 (防 Race Condition Bug)
  const handleQuizAnswer = (opt: number) => {
    if (feedback !== "idle" || isFinished || quizDeck.length === 0) return;

    const currentQ = quizDeck[quizIndex];

    if (opt === currentQ.ans) {
      playSound("coin");
      setFeedback("correct");
      setScore((s) => s + 1);
      speak(currentQ.chant); // 答對即刻讀出口訣

      setTimeout(() => {
        if (quizIndex + 1 >= quizDeck.length) {
          const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
          setPraiseText(praise);
          setIsFinished(true);
          speak(praise);
        } else {
          const nextIndex = quizIndex + 1;
          setQuizIndex(nextIndex);
          generateOptions(quizDeck[nextIndex]);
          setFeedback("idle");
        }
      }, 1500);

    } else {
      playSound("bump");
      setFeedback("wrong");
      setScore((s) => Math.max(0, s - 1));
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] bg-[#FFF1F2] rounded-3xl p-4 sm:p-8 shadow-inner select-none overflow-hidden relative">
      
      {/* 導航分頁 */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 z-10">
        <button onClick={() => {setActiveTab("learn"); speak("視覺化學習");}} className={`px-6 py-3 rounded-full font-bold text-xl transition-all ${activeTab === "learn" ? "bg-rose-500 text-white shadow-md scale-105" : "bg-white text-rose-600 border-2 border-rose-200"}`}>👀 視覺化學習</button>
        <button onClick={() => {setActiveTab("quiz"); speak("九因歌挑戰");}} className={`px-6 py-3 rounded-full font-bold text-xl transition-all ${activeTab === "quiz" ? "bg-red-500 text-white shadow-md scale-105" : "bg-white text-red-600 border-2 border-red-200"}`}>⚔️ 九因歌挑戰</button>
      </div>

      {/* 模式一：視覺化學習 (排蘋果) */}
      {activeTab === "learn" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl flex flex-col items-center">
          
          <h2 className="text-2xl sm:text-3xl font-black text-rose-600 mb-4 text-center">點擊數字，學唱九因歌 🍎</h2>
          
          {/* 選擇要學嘅乘數表 (1-9) */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 w-full max-w-2xl bg-white p-3 rounded-2xl shadow-sm border-2 border-rose-100">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button 
                key={`table-${num}`} 
                onClick={() => { setLearnTable(num); setLearnMultiplier(1); speak(`${CH_NUMS[num]}的乘數表`); }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full font-black text-2xl transition-all ${learnTable === num ? "bg-rose-500 text-white shadow-md scale-110" : "bg-rose-100 text-rose-700 hover:bg-rose-200"}`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* 顯示公式與口訣 */}
          <div className="bg-white px-8 py-6 rounded-3xl shadow-lg border-4 border-rose-300 mb-6 w-full max-w-lg text-center flex flex-col items-center gap-2">
            <div className="text-5xl font-mono font-black text-gray-800 tracking-widest mb-2">
              {learnTable} <span className="text-rose-500">×</span> {learnMultiplier} <span className="text-rose-500">=</span> {learnTable * learnMultiplier}
            </div>
            <div className="text-3xl font-black text-rose-600 bg-rose-50 px-6 py-2 rounded-xl border-2 border-rose-200">
              {getChant(learnTable, learnMultiplier)}
            </div>
          </div>

          {/* 乘數列 (選擇 x1 到 x9) */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 max-w-3xl">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button 
                key={`mul-${num}`} 
                onClick={() => handleLearnClick(learnTable, num)}
                className={`px-4 py-2 rounded-xl font-bold text-xl transition-all shadow-sm border-b-4 ${learnMultiplier === num ? "bg-rose-500 text-white border-rose-700" : "bg-white text-rose-600 border-rose-200 hover:bg-rose-50"}`}
              >
                × {num}
              </button>
            ))}
          </div>

          {/* 視覺化陣列 (蘋果排排坐) */}
          <div className="bg-white/80 p-6 rounded-3xl border-4 border-dashed border-rose-300 w-full max-w-2xl flex flex-col items-center justify-center min-h-[200px]">
             <span className="text-rose-400 font-bold mb-4">{learnTable} 排，每排 {learnMultiplier} 個蘋果</span>
             <div className="flex flex-col gap-2">
                {Array.from({ length: learnTable }).map((_, rIndex) => (
                  <motion.div 
                    key={`row-${rIndex}`} 
                    initial={{ x: -20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ delay: rIndex * 0.1 }}
                    className="flex gap-2 justify-center"
                  >
                    {Array.from({ length: learnMultiplier }).map((_, cIndex) => (
                      <span key={`apple-${rIndex}-${cIndex}`} className="text-4xl drop-shadow-sm">🍎</span>
                    ))}
                  </motion.div>
                ))}
             </div>
          </div>

        </motion.div>
      )}

      {/* 模式二：挑戰模式 */}
      {activeTab === "quiz" && quizDeck.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl flex flex-col items-center mt-4">
          
          <div className="absolute top-6 right-6 flex items-center gap-3 bg-white/90 p-3 px-5 rounded-full border-4 border-red-400 z-10 shadow-md">
            <span className="text-4xl">🌟</span>
            <span className="text-4xl font-extrabold text-red-700 font-mono tracking-tighter">
              {score.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="w-full max-w-md bg-red-100 rounded-full h-4 mb-6 relative overflow-hidden border border-red-200 shadow-inner mt-12 sm:mt-0">
            <div className="bg-red-500 h-full absolute left-0 top-0 transition-all duration-300" style={{ width: `${(quizIndex + 1) * 10}%` }} />
            <span className="z-10 absolute inset-0 flex items-center justify-center text-xs font-black text-white drop-shadow-md">進度：第 {quizIndex + 1} / 10 題</span>
          </div>

          {/* 題目板 */}
          <div className="bg-white border-4 border-red-300 p-8 rounded-3xl shadow-lg w-full mb-10 text-center flex flex-col items-center">
            <span className="text-red-400 font-bold text-lg mb-2">算一算，答案是甚麼？</span>
            <div className="text-7xl sm:text-8xl font-mono font-black text-gray-800 tracking-widest flex items-center gap-4">
              {quizDeck[quizIndex].a} <span className="text-red-500">×</span> {quizDeck[quizIndex].b}
            </div>
          </div>

          {/* 選擇答案 */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {quizOptions.map((opt, i) => (
              <motion.button 
                key={i} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => handleQuizAnswer(opt)} 
                className="py-6 sm:py-8 bg-red-50 border-b-8 border-red-300 hover:bg-red-100 active:border-b-4 active:translate-y-1 transition-all rounded-2xl text-5xl font-black text-red-700 shadow-sm flex items-center justify-center"
              >
                {opt}
              </motion.button>
            ))}
          </div>

          {/* 10 題完成大獎勵 */}
          <AnimatePresence>
            {isFinished && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center">
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[120px] mb-4">🏆</motion.div>
                <h1 className="text-5xl font-black text-red-600 mb-4">通關大成功！</h1>
                <p className="text-3xl font-extrabold text-orange-500 mb-10 max-w-md leading-relaxed">{praiseText}</p>
                <button onClick={initQuiz} className="px-10 py-5 bg-red-500 text-white text-2xl font-black rounded-full shadow-[0_8px_0_0_#991B1B] hover:bg-red-600 active:translate-y-1 active:shadow-none transition-all">再挑戰一輪 🚀</button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {feedback === "correct" && !isFinished && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.3 }} exit={{ scale: 0 }} className="absolute inset-0 m-auto w-40 h-40 text-[100px] z-20 flex items-center justify-center">🎉</motion.div>}
            {feedback === "wrong" && <motion.div initial={{ x: -15 }} animate={{ x: [0, -15, 15, -15, 15, 0] }} className="absolute inset-0 m-auto w-40 h-40 text-[100px] z-20 flex items-center justify-center">❌</motion.div>}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
}