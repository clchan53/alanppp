"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VOCAB_LIST = [
  { word: "商店", hint: "🏪", desc: "可以買到嘢食同玩具嘅地方" },
  { word: "超級市場", hint: "🛒", desc: "好大間、有好多推車仔嘅舖頭" },
  { word: "糖果", hint: "🍬", desc: "甜椰椰，食完要記得刷牙" },
  { word: "金錢", hint: "💰", desc: "買嘢食同買玩具需要用到嘅嘢" },
  { word: "硬幣", hint: "🪙", desc: "圓形、銀色或金色嘅「神沙」錢" },
  { word: "紙幣", hint: "💵", desc: "用紙做嘅銀紙，面額會大啲" },
  { word: "零用錢", hint: "👛", desc: "爸爸媽媽獎勵你放喺銀包嘅錢" },
  { word: "文具", hint: "✏️", desc: "做功課用嘅鉛筆、擦膠同尺" },
  { word: "玩具", hint: "🧸", desc: "你最鍾意玩嘅積木、公仔同車車" },
  { word: "番茄", hint: "🍅", desc: "紅色、酸酸甜甜，煮蛋好好食" },
  { word: "種植", hint: "🌱", desc: "把種子放進泥土裏，用心照顧佢" },
  { word: "香蕉", hint: "🍌", desc: "黃色、彎彎嘅，馬騮最鍾意食" },
  { word: "農夫", hint: "👨‍🌾", desc: "喺農場好辛苦種菜同水果嘅叔叔" },
  { word: "澆水", hint: "💧", desc: "拿著水壺，請植物飲水" },
  { word: "除草", hint: "🌿", desc: "把壞掉、會搶營養嘅雜草拔走" },
  { word: "發芽", hint: "🌱", desc: "種子剛剛伸出一點點小綠芽" },
  { word: "肥料", hint: "🍂", desc: "幫植物快高長大嘅大餐、營養食物" },
  { word: "幼苗", hint: "🪴", desc: "啱啱長大了一點點、好脆弱嘅小植物" },
  { word: "温室", hint: "🏠", desc: "用玻璃造嘅暖笠笠小屋，保護植物" }
];

// 讚美語句庫
const PRAISES = [
  "你好叻呀！全部識晒喇！",
  "直係超級小博士！好聰明呀！",
  "爸爸為你感到驕傲！太棒了！",
  "你已經學識晒所有生字喇！加油！",
  "好厲害！你係認字小戰士！"
];

export default function WordGame() {
  const [shuffledDeck, setShuffledDeck] = useState<typeof VOCAB_LIST>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [current, setCurrent] = useState(VOCAB_LIST[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  
  // 👇 新增：遊戲完成狀態
  const [isFinished, setIsFinished] = useState(false);
  const [praiseText, setPraiseText] = useState("");

  const playSound = (sound: "coin" | "bump") => {
    try {
      const audio = new Audio(`/${sound}.mp3`);
      audio.play().catch((e) => console.log("聲音被阻擋", e));
    } catch (error) {}
  };

  const speakCantonese = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-HK"; 
      utterance.rate = 0.9;    
      window.speechSynthesis.speak(utterance);
    }
  };

  // 初始化遊戲
  const initGame = () => {
    const shuffled = [...VOCAB_LIST].sort(() => Math.random() - 0.5);
    setShuffledDeck(shuffled);
    setCurrentIndex(0);
    setIsFinished(false);
    setScore(0);
    setFeedback("idle");
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (shuffledDeck.length > 0 && !isFinished) {
      const targetItem = shuffledDeck[currentIndex];
      setCurrent(targetItem);

      const wrongAnswers = new Set<string>();
      while (wrongAnswers.size < 3) {
        const r = VOCAB_LIST[Math.floor(Math.random() * VOCAB_LIST.length)].word;
        if (r !== targetItem.word) wrongAnswers.add(r);
      }

      const optionsArray = Array.from(wrongAnswers);
      optionsArray.push(targetItem.word);
      setOptions(optionsArray.sort(() => Math.random() - 0.5));
      setFeedback("idle");
    }
  }, [currentIndex, shuffledDeck, isFinished]);

  const handleChoice = (chosenWord: string) => {
    if (feedback !== "idle" || isFinished) return;

    if (chosenWord === current.word) {
      playSound("coin");
      setFeedback("correct");
      setScore((s) => s + 1);
      speakCantonese(current.word);
      
      setTimeout(() => {
        // 判斷係咪最後一題
        if (currentIndex + 1 >= shuffledDeck.length) {
          const randomPraise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
          setPraiseText(randomPraise);
          setIsFinished(true);
          speakCantonese(randomPraise); // 讀出讚美說話
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 1200);

    } else {
      playSound("bump");
      setFeedback("wrong");
      setScore((s) => Math.max(0, s - 1)); 
      setTimeout(() => setFeedback("idle"), 600);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#E8F5E9] rounded-3xl p-6 shadow-inner relative overflow-hidden select-none">
      
      {/* 計分錶 */}
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white/90 p-3 px-5 rounded-full border-4 border-green-400 z-10 shadow-md">
        <span className="text-4xl">🌟</span>
        <span className="text-4xl font-extrabold text-green-700 font-mono tracking-tighter">
          {score.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="text-center mb-8 z-10 max-w-xl">
        <h2 className="text-3xl font-black text-green-700 mb-2 tracking-wider">中文認字大冒險</h2>
        {!isFinished && (
          <p className="text-green-600 font-bold mb-4">
            進度：第 {currentIndex + 1} / {VOCAB_LIST.length} 題
          </p>
        )}
        
        <motion.div 
          key={current.word}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-9xl mb-4 drop-shadow-xl"
        >
          {current.hint}
        </motion.div>

        <p className="text-xl sm:text-2xl font-bold text-gray-700 bg-white/80 border-2 border-green-200 px-6 py-3 rounded-2xl shadow-sm inline-block">
          💡 {current.desc}
        </p>
      </div>

      {/* 按鈕區 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl z-10 px-2 pb-6">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            disabled={isFinished}
            onClick={() => handleChoice(opt)}
            className={`py-5 px-4 text-3xl font-black rounded-2xl border-b-8 shadow-md transition-colors text-center
              ${i % 2 === 0 
                ? "bg-white text-green-700 border-green-200 hover:bg-green-50" 
                : "bg-green-600 text-white border-green-800 hover:bg-green-700"
              }
            `}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      {/* 👇 遊戲完成大獎勵畫面 👇 */}
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
              🏆
            </motion.div>
            <h1 className="text-6xl font-black text-green-700 mb-6">完成任務！</h1>
            <p className="text-4xl font-bold text-orange-500 mb-12 leading-relaxed">
              {praiseText}
            </p>
            <button
              onClick={initGame}
              className="px-12 py-6 bg-green-600 text-white text-3xl font-black rounded-full shadow-[0_10px_0_0_#1B5E20] hover:bg-green-700 active:translate-y-2 active:shadow-none transition-all"
            >
              再挑戰一次 🚀
            </button>
            <div className="mt-8 flex gap-4 text-6xl">
              <span>🎉</span><span>🎈</span><span>✨</span><span>🎈</span><span>🎉</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 答題回饋動畫 */}
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