"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 將句子切成適合 5 歲小朋友嘅詞語塊 (Chunks)
const SENTENCE_LIST = [
  { text: "小種子發芽了。", chunks: ["小種子", "發芽了", "。"] },
  { text: "我在温室種植番茄。", chunks: ["我", "在", "温室", "種植", "番茄", "。"] },
  { text: "姐姐細心地除細草。", chunks: ["姐姐", "細心地", "除細草", "。"] },
  { text: "番茄在田裏生長。", chunks: ["番茄", "在", "田裏", "生長", "。"] },
  { text: "媽媽到公園做運動。", chunks: ["媽媽", "到", "公園", "做運動", "。"] },
  { text: "信用卡付款真方便。", chunks: ["信用卡", "付款", "真方便", "。"] },
  { text: "八達通付款真方便。", chunks: ["八達通", "付款", "真方便", "。"] },
  { text: "農夫在田裏工作。", chunks: ["農夫", "在", "田裏", "工作", "。"] },
  { text: "同學們在操場上跑步。", chunks: ["同學們", "在", "操場上", "跑步", "。"] },
  { text: "暑假後，我升讀小學。", chunks: ["暑假後", "，", "我", "升讀", "小學", "。"] },
  { text: "媽媽到市場買生菜。", chunks: ["媽媽", "到", "市場", "買生菜", "。"] }
];

const PRAISES = [
  "你好叻呀！全部句子都識排喇！",
  "直係超級小博士！好聰明呀！",
  "爸爸為你感到驕傲！太棒了！",
  "你已經學識晒所有句子喇！加油！",
  "好厲害！你係重組句子小戰士！"
];

// 用嚟追踪每個字塊嘅唯一 ID
type WordBlock = { id: string; text: string };

export default function SentenceGame() {
  const [shuffledDeck, setShuffledDeck] = useState<typeof SENTENCE_LIST>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 遊戲狀態
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

  const speakCantonese = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-HK"; 
      utterance.rate = 0.85;    
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

  // 載入新題目
  useEffect(() => {
    if (shuffledDeck.length > 0 && !isFinished) {
      const currentSentence = shuffledDeck[currentIndex];
      // 將詞語變成帶有 ID 嘅 Object，並洗牌
      const initialPool = currentSentence.chunks
        .map((text, i) => ({ id: `word-${i}`, text }))
        .sort(() => Math.random() - 0.5);
      
      setPool(initialPool);
      setSelected([]);
      setFeedback("idle");
    }
  }, [currentIndex, shuffledDeck, isFinished]);

  // 監聽小朋友係咪已經排好晒全部字
  useEffect(() => {
    if (shuffledDeck.length === 0 || isFinished) return;
    
    const currentSentence = shuffledDeck[currentIndex];
    
    // 如果選中嘅字數 == 句子總字數，自動對答案
    if (selected.length === currentSentence.chunks.length) {
      const formedSentence = selected.map((w) => w.text).join("");
      
      if (formedSentence === currentSentence.text) {
        // 答對
        playSound("coin");
        setFeedback("correct");
        setScore((s) => s + 1);
        speakCantonese(currentSentence.text);

        setTimeout(() => {
          if (currentIndex + 1 >= shuffledDeck.length) {
            const randomPraise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
            setPraiseText(randomPraise);
            setIsFinished(true);
            speakCantonese(randomPraise);
          } else {
            setCurrentIndex((prev) => prev + 1);
          }
        }, 1500);

      } else {
        // 答錯
        playSound("bump");
        setFeedback("wrong");
        setScore((s) => Math.max(0, s - 1));
        
        // 震動半秒後，將啲字自動退返落去畀佢重新排過
        setTimeout(() => {
          setFeedback("idle");
          setPool((prev) => [...prev, ...selected].sort(() => Math.random() - 0.5));
          setSelected([]);
        }, 800);
      }
    }
  }, [selected, currentIndex, shuffledDeck, isFinished]);

  // 點擊下方字庫：飛上去
  const handleSelect = (block: WordBlock) => {
    if (feedback !== "idle") return;
    setPool((prev) => prev.filter((b) => b.id !== block.id));
    setSelected((prev) => [...prev, block]);
  };

  // 點擊上方已選字：跌返落嚟
  const handleDeselect = (block: WordBlock) => {
    if (feedback !== "idle") return;
    setSelected((prev) => prev.filter((b) => b.id !== block.id));
    setPool((prev) => [...prev, block]);
  };

  if (shuffledDeck.length === 0) return null;
  const targetLength = shuffledDeck[currentIndex]?.chunks.length || 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#F3E8FF] rounded-3xl p-6 shadow-inner relative overflow-hidden select-none">
      
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white/90 p-3 px-5 rounded-full border-4 border-purple-400 z-10 shadow-md">
        <span className="text-4xl">🌟</span>
        <span className="text-4xl font-extrabold text-purple-700 font-mono tracking-tighter">
          {score.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="text-center mb-8 z-10 max-w-3xl w-full">
        <h2 className="text-3xl font-black text-purple-700 mb-2 tracking-wider">句子魔法師</h2>
        {!isFinished && (
          <p className="text-purple-500 font-bold mb-8">
            進度：第 {currentIndex + 1} / {SENTENCE_LIST.length} 題
          </p>
        )}

        {/* 答案區 (空位) */}
        <motion.div 
          animate={feedback === "wrong" ? { x: [-10, 10, -10, 10, 0] } : {}}
          className={`min-h-[120px] bg-white/60 rounded-3xl p-4 border-4 border-dashed flex flex-wrap justify-center gap-3 items-center mb-8
            ${feedback === "correct" ? "border-green-400 bg-green-50" : feedback === "wrong" ? "border-red-400 bg-red-50" : "border-purple-300"}
          `}
        >
          {Array.from({ length: targetLength }).map((_, i) => (
            <div key={`slot-${i}`} className="min-w-[80px] h-[70px]">
              {selected[i] ? (
                <motion.button
                  layoutId={selected[i].id}
                  onClick={() => handleDeselect(selected[i])}
                  className="px-6 py-3 bg-purple-600 text-white text-3xl font-black rounded-2xl shadow-md"
                >
                  {selected[i].text}
                </motion.button>
              ) : (
                <div className="w-full h-full bg-purple-100/50 rounded-2xl border-2 border-purple-200" />
              )}
            </div>
          ))}
        </motion.div>

        {/* 選擇區 (字庫) */}
        <div className="min-h-[150px] flex flex-wrap justify-center gap-4 bg-purple-50 p-6 rounded-3xl border-4 border-purple-200">
          <AnimatePresence>
            {pool.map((block) => (
              <motion.button
                key={block.id}
                layoutId={block.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(block)}
                className="px-6 py-4 bg-white text-purple-700 text-3xl font-black rounded-2xl border-b-8 border-purple-300 hover:bg-purple-100 active:border-b-4 active:translate-y-1 transition-all shadow-sm"
              >
                {block.text}
              </motion.button>
            ))}
          </AnimatePresence>
          {pool.length === 0 && <span className="text-purple-300 font-bold text-xl my-auto">字塊已經揀晒喇！</span>}
        </div>
      </div>

      {/* 遊戲完成大獎勵畫面 */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-[150px] mb-8"
            >
              🏅
            </motion.div>
            <h1 className="text-6xl font-black text-purple-700 mb-6">任務大成功！</h1>
            <p className="text-4xl font-bold text-orange-500 mb-12 leading-relaxed">
              {praiseText}
            </p>
            <button
              onClick={initGame}
              className="px-12 py-6 bg-purple-600 text-white text-3xl font-black rounded-full shadow-[0_10px_0_0_#4C1D95] hover:bg-purple-700 active:translate-y-2 active:shadow-none transition-all"
            >
              再挑戰一次 🚀
            </button>
            <div className="mt-8 flex gap-4 text-6xl">
              <span>🎉</span><span>⭐</span><span>🎊</span><span>⭐</span><span>🎉</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback === "correct" && !isFinished && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} exit={{ scale: 0 }} className="absolute text-9xl z-20">
            🎉
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