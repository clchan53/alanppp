"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 10 句英文句子庫
const SENTENCE_LIST = [
  { text: "I like bread for breakfast.", chunks: ["I", "like", "bread", "for", "breakfast."] },
  { text: "I like noodles for lunch.", chunks: ["I", "like", "noodles", "for", "lunch."] },
  { text: "I like rice for dinner.", chunks: ["I", "like", "rice", "for", "dinner."] },
  { text: "I can take photos.", chunks: ["I", "can", "take", "photos."] },
  { text: "I can ride a horse.", chunks: ["I", "can", "ride", "a", "horse."] },
  { text: "I can play hockey.", chunks: ["I", "can", "play", "hockey."] },
  { text: "Do you like painting?", chunks: ["Do", "you", "like", "painting?"] },
  { text: "Do you like flying a kite?", chunks: ["Do", "you", "like", "flying", "a", "kite?"] },
  { text: "Do you like dancing?", chunks: ["Do", "you", "like", "dancing?"] },
  { text: "He likes playing basketball.", chunks: ["He", "likes", "playing", "basketball."] }
];

const PRAISES = [
  "You did it! You are an English Superstar! ⭐",
  "Fantastic! You parsed all sentences perfectly! 🎉",
  "Awesome job! I'm so proud of you! ❤️",
  "Brilliant! You are a master of English sentences! 🚀",
  "Amazing! Your English is super good! 🌟"
];

type WordBlock = { id: string; text: string };

export default function EnglishSentenceGame() {
  const [shuffledDeck, setShuffledDeck] = useState<typeof SENTENCE_LIST>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [pool, setPool] = useState<WordBlock[]>([]);
  const [selected, setSelected] = useState<WordBlock[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [isFinished, setIsFinished] = useState(false);
  const [praiseText, setPraiseText] = useState("");

  const playSound = (sound: "coin" | "bump") => {
    try {
      const audio = new Audio(`/${sound}.mp3`);
      audio.play().catch(() => {});
    } catch (error) {}
  };

  const speakEnglish = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; 
      utterance.rate = 0.8; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const initGame = () => {
    const shuffled = [...SENTENCE_LIST].sort(() => Math.random() - 0.5);
    setShuffledDeck(shuffled);
    setCurrentIndex(0);
    setIsFinished(false);
    setScore(0);
    setFeedback("idle");
  };

  useEffect(() => {
    initGame();
  }, []);

  // 載入新題目 (修復了 ID 衝突問題)
  useEffect(() => {
    if (shuffledDeck.length > 0 && !isFinished) {
      const currentSentence = shuffledDeck[currentIndex];
      
      // 👇 核心修復：將 currentIndex 加入 ID，確保每一題嘅字塊 ID 都係獨一無二
      const initialPool = currentSentence.chunks
        .map((text, i) => ({ id: `q${currentIndex}-word-${i}`, text }))
        .sort(() => Math.random() - 0.5); 
      
      setPool(initialPool);
      setSelected([]);
      setFeedback("idle");
    }
  }, [currentIndex, shuffledDeck, isFinished]);

  useEffect(() => {
    if (shuffledDeck.length === 0 || isFinished) return;
    
    const currentSentence = shuffledDeck[currentIndex];
    
    if (selected.length === currentSentence.chunks.length) {
      const formedSentence = selected.map((w) => w.text).join(" ");
      
      if (formedSentence === currentSentence.text) {
        playSound("coin");
        setFeedback("correct");
        setScore((s) => s + 1);
        speakEnglish(currentSentence.text);

        setTimeout(() => {
          if (currentIndex + 1 >= shuffledDeck.length) {
            const randomPraise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
            setPraiseText(randomPraise);
            setIsFinished(true);
            setTimeout(() => speakEnglish(randomPraise), 500); 
          } else {
            setCurrentIndex((prev) => prev + 1);
          }
        }, 1800);

      } else {
        playSound("bump");
        setFeedback("wrong");
        setScore((s) => Math.max(0, s - 1));
        
        setTimeout(() => {
          setFeedback("idle");
          setPool((prev) => [...prev, ...selected].sort(() => Math.random() - 0.5));
          setSelected([]);
        }, 1000);
      }
    }
  }, [selected, currentIndex, shuffledDeck, isFinished]);

  const handleSelect = (block: WordBlock) => {
    if (feedback !== "idle") return;
    setPool((prev) => prev.filter((b) => b.id !== block.id));
    setSelected((prev) => [...prev, block]);
  };

  const handleDeselect = (block: WordBlock) => {
    if (feedback !== "idle") return;
    setSelected((prev) => prev.filter((b) => b.id !== block.id));
    setPool((prev) => [...prev, block]);
  };

  if (shuffledDeck.length === 0) return null;
  const targetLength = shuffledDeck[currentIndex]?.chunks.length || 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#EEF2FF] rounded-3xl p-6 shadow-inner relative overflow-hidden select-none">
      
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white/90 p-3 px-5 rounded-full border-4 border-indigo-400 z-10 shadow-md">
        <span className="text-4xl">🌟</span>
        <span className="text-4xl font-extrabold text-indigo-700 font-mono tracking-tighter">
          {score.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="text-center mb-8 z-10 max-w-4xl w-full">
        <h2 className="text-3xl font-black text-indigo-700 mb-2 tracking-wider">English Sentence Wizard</h2>
        {!isFinished && (
          <p className="text-indigo-500 font-bold mb-8">
            Progress: {currentIndex + 1} / {SENTENCE_LIST.length}
          </p>
        )}

        {/* 答案放置區 */}
        <motion.div 
          animate={feedback === "wrong" ? { x: [-10, 10, -10, 10, 0] } : {}}
          className={`min-h-[130px] bg-white/70 rounded-3xl p-5 border-4 border-dashed flex flex-wrap justify-center gap-3 items-center mb-8
            ${feedback === "correct" ? "border-green-400 bg-green-50" : feedback === "wrong" ? "border-red-400 bg-red-50" : "border-indigo-300"}
          `}
        >
          {Array.from({ length: targetLength }).map((_, i) => (
            <div key={`eng-slot-${i}`} className="min-w-[90px] h-[75px] flex items-center justify-center">
              {selected[i] ? (
                <motion.button
                  layout
                  layoutId={selected[i].id}
                  onClick={() => handleDeselect(selected[i])}
                  className="px-5 py-3 bg-indigo-600 text-white text-2xl sm:text-3xl font-bold rounded-2xl shadow-md tracking-wide"
                >
                  {selected[i].text}
                </motion.button>
              ) : (
                <div className="w-full h-full min-w-[80px] bg-indigo-100/40 rounded-2xl border-2 border-indigo-200" />
              )}
            </div>
          ))}
        </motion.div>

        {/* 字庫選擇區 */}
        <div className="min-h-[160px] flex flex-wrap justify-center gap-4 bg-indigo-50 p-6 rounded-3xl border-4 border-indigo-200 items-center">
          <AnimatePresence mode="popLayout">
            {pool.map((block) => (
              <motion.button
                layout
                key={block.id}
                layoutId={block.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(block)}
                className="px-5 py-3.5 bg-white text-indigo-700 text-2xl sm:text-3xl font-bold rounded-2xl border-b-8 border-indigo-300 hover:bg-indigo-50 active:border-b-4 active:translate-y-1 transition-all shadow-sm tracking-wide"
              >
                {block.text}
              </motion.button>
            ))}
          </AnimatePresence>
          {pool.length === 0 && <span className="text-indigo-300 font-bold text-xl my-auto">Excellent! Checking your answer...</span>}
        </div>
      </div>

      {/* 大結局畫面 */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[140px] mb-6"
            >
              👑
            </motion.div>
            <h1 className="text-6xl font-black text-indigo-700 mb-6">Congratulations!</h1>
            <p className="text-3xl sm:text-4xl font-extrabold text-orange-500 mb-12 max-w-2xl leading-relaxed">
              {praiseText}
            </p>
            <button
              onClick={initGame}
              className="px-12 py-6 bg-indigo-600 text-white text-3xl font-black rounded-full shadow-[0_10px_0_0_#1E3A8A] hover:bg-indigo-700 active:translate-y-2 active:shadow-none transition-all"
            >
              Play Again 🚀
            </button>
            <div className="mt-8 flex gap-4 text-6xl">
              <span>🎉</span><span>⭐</span><span>🎈</span><span>⭐</span><span>🎉</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback === "correct" && !isFinished && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} exit={{ scale: 0 }} className="absolute text-9xl z-20">
            👍
          </motion.div>
        )}
        {feedback === "wrong" && (
          <motion.div initial={{ x: -20 }} animate={{ x: [0, -20, 20, -20, 20, 0] }} className="absolute text-9xl z-20">
            ❌
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}