"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🧪 完整 Jolly Phonics 42 個核心音素數據庫 (按官方 7 個學習階段分組)
const PHONEMES_DB = [
  // --- 第 1 組 ---
  { phoneme: "s", sound: "/s/", word: "sun", emoji: "☀️", type: "consonant" },
  { phoneme: "a", sound: "/æ/", word: "apple", emoji: "🍎", type: "vowel" },
  { phoneme: "t", sound: "/t/", word: "tiger", emoji: "🐅", type: "consonant" },
  { phoneme: "i", sound: "/ɪ/", word: "igloo", emoji: "🧊", type: "vowel" },
  { phoneme: "p", sound: "/p/", word: "pig", emoji: "🐷", type: "consonant" },
  { phoneme: "n", sound: "/n/", word: "net", emoji: "🕸️", type: "consonant" },

  // --- 第 2 組 ---
  { phoneme: "c / k", sound: "/k/", word: "cat", emoji: "🐱", type: "consonant" },
  { phoneme: "e", sound: "/e/", word: "egg", emoji: "🥚", type: "vowel" },
  { phoneme: "h", sound: "/h/", word: "hat", emoji: "🧢", type: "consonant" },
  { phoneme: "r", sound: "/r/", word: "rabbit", emoji: "🐇", type: "consonant" },
  { phoneme: "m", sound: "/m/", word: "monkey", emoji: "🐒", type: "consonant" },
  { phoneme: "d", sound: "/d/", word: "dog", emoji: "🐶", type: "consonant" },

  // --- 第 3 組 ---
  { phoneme: "g", sound: "/g/", word: "goat", emoji: "🐐", type: "consonant" },
  { phoneme: "o", sound: "/ɒ/", word: "octopus", emoji: "🐙", type: "vowel" },
  { phoneme: "u", sound: "/ʌ/", word: "umbrella", emoji: "☂️", type: "vowel" },
  { phoneme: "l", sound: "/l/", word: "lion", emoji: "🦁", type: "consonant" },
  { phoneme: "f", sound: "/f/", word: "fish", emoji: "🐟", type: "consonant" },
  { phoneme: "b", sound: "/b/", word: "bear", emoji: "🐻", type: "consonant" },

  // --- 第 4 組 ---
  { phoneme: "ai", sound: "/eɪ/", word: "rain", emoji: "🌧️", type: "digraph" },
  { phoneme: "j", sound: "/dʒ/", word: "jelly", emoji: "🍮", type: "consonant" },
  { phoneme: "oa", sound: "/oʊ/", word: "boat", emoji: "⛵", type: "digraph" },
  { phoneme: "ie", sound: "/aɪ/", word: "pie", emoji: "🥧", type: "digraph" },
  { phoneme: "ee", sound: "/i:/", word: "bee", emoji: "🐝", type: "digraph" },
  { phoneme: "or", sound: "/ɔ:/", word: "fork", emoji: "🍴", type: "digraph" },

  // --- 第 5 組 ---
  { phoneme: "z", sound: "/z/", word: "zebra", emoji: "🦓", type: "consonant" },
  { phoneme: "w", sound: "/w/", word: "watch", emoji: "⌚", type: "consonant" },
  { phoneme: "ng", sound: "/ŋ/", word: "ring", emoji: "💍", type: "digraph" },
  { phoneme: "v", sound: "/v/", word: "van", emoji: "🚐", type: "consonant" },
  { phoneme: "oo (short)", sound: "/ʊ/", word: "book", emoji: "📖", type: "digraph" },
  { phoneme: "oo (long)", sound: "/u:/", word: "moon", emoji: "🌕", type: "digraph" },

  // --- 第 6 組 ---
  { phoneme: "y", sound: "/j/", word: "yo-yo", emoji: "🪀", type: "consonant" },
  { phoneme: "x", sound: "/ks/", word: "fox", emoji: "🦊", type: "consonant" },
  { phoneme: "ch", sound: "/tʃ/", word: "cheese", emoji: "🧀", type: "digraph" },
  { phoneme: "sh", sound: "/ʃ/", word: "ship", emoji: "🚢", type: "digraph" },
  { phoneme: "th (soft)", sound: "/θ/", word: "thumb", emoji: "👍", type: "digraph" },
  { phoneme: "th (hard)", sound: "/ð/", word: "feather", emoji: "🪶", type: "digraph" },

  // --- 第 7 組 ---
  { phoneme: "qu", sound: "/kw/", word: "queen", emoji: "👸", type: "digraph" },
  { phoneme: "ou", sound: "/aʊ/", word: "mouse", emoji: "🐭", type: "digraph" },
  { phoneme: "oi", sound: "/ɔɪ/", word: "coin", emoji: "🪙", type: "digraph" },
  { phoneme: "ue", sound: "/u:/", word: "glue", emoji: "🧴", type: "digraph" },
  { phoneme: "er", sound: "/ə/", word: "flower", emoji: "🌸", type: "digraph" },
  { phoneme: "ar", sound: "/ɑ:/", word: "star", emoji: "⭐", type: "digraph" }
];

type PhonemeItem = typeof PHONEMES_DB[0];

export default function PhonicsGame() {
  const [activeTab, setActiveTab] = useState<"lab" | "quiz">("lab");
  
  // 測驗模式狀態
  const [target, setTarget] = useState<PhonemeItem | null>(null);
  const [options, setOptions] = useState<PhonemeItem[]>([]);
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [isFinished, setIsFinished] = useState(false);

  const playSound = (type: "coin" | "bump" | "success") => {
    try { const audio = new Audio(`/${type}.mp3`); audio.play().catch(()=>{}); } catch (e) {}
  };

  // 🗣️ 英式發音引擎 (特別處理特殊拼音顯示字眼)
  const speak = (text: string, isPhoneme: boolean = false) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      
      // 處理特殊音素，令瀏覽器語音引擎讀得準啲
      let textToSpeak = text;
      if (isPhoneme) {
        if (text === "c / k") textToSpeak = "k";
        else if (text.includes("oo")) textToSpeak = text.includes("short") ? "book" : "moon";
        else if (text.includes("th")) textToSpeak = text.includes("soft") ? "thumb" : "the";
        else if (text === "ng") textToSpeak = "ing";
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en-GB";
      utterance.rate = isPhoneme ? 0.6 : 0.85; 
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const initQuiz = () => {
    setScore(0);
    setQIndex(0);
    setIsFinished(false);
    generateQuestion(0);
  };

  const generateQuestion = (currentIndex: number) => {
    if (currentIndex >= 10) {
      playSound("success");
      setIsFinished(true);
      return;
    }

    const shuffledDB = [...PHONEMES_DB].sort(() => Math.random() - 0.5);
    const currentTarget = shuffledDB[0];
    const wrongOptions = shuffledDB.slice(1, 4);
    
    setTarget(currentTarget);
    setOptions([currentTarget, ...wrongOptions].sort(() => Math.random() - 0.5));
    setFeedback("idle");
    
    // 測驗時先讀出單詞，幫助從單詞中辨識音素
    setTimeout(() => speak(currentTarget.word), 500);
  };

  useEffect(() => {
    if (activeTab === "quiz") initQuiz();
    else window.speechSynthesis.cancel();
  }, [activeTab]);

  const handleSelect = (selectedItem: PhonemeItem) => {
    if (feedback !== "idle" || !target) return;

    if (selectedItem.phoneme === target.phoneme) {
      playSound("coin");
      setFeedback("correct");
      setScore((prev) => prev + 1);
      speak(selectedItem.word);
      
      setTimeout(() => {
        setQIndex((prev) => prev + 1);
        generateQuestion(qIndex + 1);
      }, 1500);
    } else {
      playSound("bump");
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[85vh] bg-[#F0FDF4] rounded-3xl p-4 sm:p-8 shadow-inner select-none overflow-hidden relative font-sans">
      
      {/* 導航分頁 */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 w-full z-10">
        <button onClick={() => setActiveTab("lab")} className={`px-5 py-2.5 rounded-full font-bold text-lg transition-all ${activeTab === "lab" ? "bg-emerald-500 text-white shadow-md scale-105" : "bg-white text-emerald-600 border-2 border-emerald-200"}`}>🔬 1. 拼音實驗室</button>
        <button onClick={() => setActiveTab("quiz")} className={`px-5 py-2.5 rounded-full font-bold text-lg transition-all ${activeTab === "quiz" ? "bg-teal-500 text-white shadow-md scale-105" : "bg-white text-teal-600 border-2 border-teal-200"}`}>🎧 2. 聽音辨字</button>
      </div>

      {/* 模式 1：拼音實驗室 */}
      {activeTab === "lab" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl flex flex-col items-center">
          <p className="text-lg font-bold text-emerald-700 mb-6 bg-emerald-100 px-6 py-2 rounded-full border-2 border-emerald-200">
            💡 點擊卡片發掘 42 個核心字母組合的聲音！
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 w-full">
            {PHONEMES_DB.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { speak(item.phoneme, true); setTimeout(() => speak(item.word), 800); }}
                className="bg-white p-4 rounded-3xl border-b-8 border-emerald-300 shadow-sm hover:bg-emerald-50 flex flex-col items-center text-center gap-2 transition-all"
              >
                <span className="text-4xl font-black text-gray-800 tracking-tighter">{item.phoneme}</span>
                <span className="text-sm font-bold text-emerald-500 font-mono bg-emerald-50 px-2 py-0.5 rounded">{item.sound}</span>
                <div className="mt-1 text-xs font-bold text-gray-500 border-t-2 border-dashed border-emerald-100 pt-2 w-full flex flex-col items-center gap-1">
                  <span className="text-2xl">{item.emoji}</span> 
                  <span className="truncate w-full">{item.word}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 模式 2：聽音辨字 */}
      {activeTab === "quiz" && target && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl flex flex-col items-center">
          
          <div className="absolute top-6 right-6 flex items-center gap-3 bg-white p-3 px-6 rounded-full border-4 border-teal-300 z-10 shadow-sm">
            <span className="text-3xl">⭐</span>
            <span className="text-3xl font-extrabold text-teal-600 font-mono tracking-tighter">{score} / 10</span>
          </div>

          <h2 className="text-2xl font-black text-teal-700 mb-6">聽單詞，找出包含的發音字母！</h2>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => speak(target.word)}
            className="w-28 h-28 bg-teal-500 rounded-full flex items-center justify-center text-6xl shadow-[0_8px_0_0_#0F766E] active:translate-y-2 active:shadow-none transition-all mb-8"
          >
            🔊
          </motion.button>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
            {options.map((item, index) => (
              <motion.button
                key={index}
                animate={feedback === "wrong" && item.phoneme !== target.phoneme ? { x: [-10, 10, -10, 10, 0] } : {}}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(item)}
                className="py-10 px-4 bg-white text-gray-800 rounded-3xl border-b-8 border-teal-300 hover:bg-teal-50 active:border-b-4 active:translate-y-1 transition-all shadow-md flex flex-col items-center justify-center gap-2"
              >
                <span className="text-5xl font-black">{item.phoneme}</span>
              </motion.button>
            ))}
          </div>

          {/* 通關畫面與回饋動畫 */}
          <AnimatePresence>
            {isFinished && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center">
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[120px] mb-4">👨‍🔬</motion.div>
                <h1 className="text-5xl sm:text-6xl font-black text-teal-600 mb-6">首席拼音科學家！</h1>
                <p className="text-3xl font-extrabold text-teal-800 mb-10">你已經成功拆解所有發音密碼！</p>
                <button onClick={initQuiz} className="px-10 py-5 bg-teal-500 text-white text-2xl font-black rounded-full shadow-[0_8px_0_0_#0F766E] hover:bg-teal-600 active:translate-y-1 active:shadow-none transition-all">繼續發明 🚀</button>
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