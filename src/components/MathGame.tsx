"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MathGame() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState("+");
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correctAnswer, setCorrectAnswer] = useState(0);

  // 播放聲音嘅函數
  const playSound = (sound: "coin" | "bump") => {
    try {
      const audio = new Audio(`/${sound}.mp3`);
      audio.play().catch((e) => console.log("聲音播放被阻擋:", e));
    } catch (error) {
      console.log("無法播放聲音", error);
    }
  };

  // 生成新題目
  const generateProblem = () => {
    const isAddition = Math.random() > 0.5;
    let n1, n2, answer;

    if (isAddition) {
      answer = Math.floor(Math.random() * 31);
      n1 = Math.floor(Math.random() * (answer + 1));
      n2 = answer - n1;
    } else {
      n1 = Math.floor(Math.random() * 31);
      n2 = Math.floor(Math.random() * (n1 + 1));
      answer = n1 - n2;
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(isAddition ? "+" : "-");
    setCorrectAnswer(answer);

    const newOptions = new Set([answer]);
    while (newOptions.size < 4) {
      let randomOpt = answer + Math.floor(Math.random() * 7) - 3;
      if (randomOpt >= 0 && randomOpt <= 30) newOptions.add(randomOpt);
    }
    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5));
    setFeedback("idle");
  };

  useEffect(() => {
    generateProblem();
  }, []);

  // 處理小朋友點擊選項
  const handleGuess = (guess: number) => {
    if (guess === correctAnswer) {
      playSound("coin");
      setFeedback("correct");
      setScore((s) => s + 1);
      setTimeout(generateProblem, 1000); // 1秒後換下一題
    } else {
      playSound("bump");
      setFeedback("wrong");
      setScore((s) => Math.max(0, s - 1)); // 答錯扣1分，最低0分
      setTimeout(() => setFeedback("idle"), 500); // 半秒後回復
    }
  };

  return (
    // Mario 藍天白雲背景
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#5C94FC] rounded-3xl p-6 shadow-inner relative overflow-hidden select-none">
      
      {/* 雲朵裝飾 */}
      <div className="absolute top-10 left-10 w-24 h-12 bg-white rounded-full opacity-80 z-0"></div>
      <div className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full opacity-80 z-0"></div>

      {/* 金幣計數器 */}
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-black/40 p-3 rounded-full border-2 border-yellow-300 z-10">
        <span className="text-4xl drop-shadow-md">🪙</span>
        <span className="text-4xl font-extrabold text-[#F8E808] font-mono tracking-tighter drop-shadow-md">
          {score.toString().padStart(2, "0")}
        </span>
      </div>

      {/* 題目顯示區 (包含大大個馬利奧角色同題目板) */}
      {/* 我增加咗 gap-6 距離同埋 mt-16 上邊距 */}
      <div className="flex items-end gap-6 mb-16 mt-16 relative w-full max-w-5xl justify-center z-10 px-4">
        
        {/* 👇 更新：大大個馬利奧容器，明顯放大 👇 */}
        {/* 原本係 w-40 h-40 sm:w-56 sm:h-56 */}
        {/* 依家放大做 w-64 h-64 sm:w-96 sm:h-96 (加大咗好多！) */}
        <div className="w-64 h-64 sm:w-96 sm:h-96 relative flex items-end justify-center">
          <motion.img
            key={feedback} // 每次 feedback 變都重新行一次入場動畫
            src={
              feedback === "correct"
                ? "/mario-happy.png"
                : feedback === "wrong"
                ? "/mario-sad.png"
                : "/mario-ask.png"
            }
            alt="Mario"
            // 增加 drop-shadow-xl 令大角色更有立體感
            className="absolute bottom-0 h-full w-auto max-w-full drop-shadow-xl pointer-events-none object-contain object-bottom"
            // 出場動畫：彈出嚟
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </div>
        {/* 👆 更新結束 👆 */}

        {/* 題目顯示板 (微調左邊距，增加 gap) */}
        <motion.div 
          key={`${num1}${operator}${num2}`}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-6xl sm:text-8xl font-black text-gray-900 flex gap-3 sm:gap-5 items-center font-mono bg-white/90 p-5 sm:p-7 rounded-3xl shadow-2xl border-4 border-white relative ml-6"
        >
          {/* 對話框小三角 (指向 Mario) */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-r-[20px] border-r-white border-b-[15px] border-b-transparent hidden sm:block"></div>

          <span>{num1}</span>
          <span className="text-[#E31D2B]">{operator}</span>
          <span>{num2}</span>
          <span className="text-[#E31D2B]">=</span>
          <span className="w-20 h-20 sm:w-28 sm:h-28 bg-[#8B5E3C] border-b-8 border-r-8 border-[#5E3F28] rounded-xl flex items-center justify-center text-[#FCD8A8] shadow-inner">
            ?
          </span>
        </motion.div>
      </div>

      {/* 選項按鈕 */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-md z-10 px-4">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            animate={
              feedback === "correct" && opt === correctAnswer 
                ? { y: [0, -30, 0], scale: [1, 1.1, 1] } 
                : feedback === "wrong" && opt !== correctAnswer 
                ? { x: [0, -10, 10, -10, 10, 0] } 
                : {}
            }
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGuess(opt)}
            className={`h-28 text-6xl font-black rounded-xl shadow-[0_8px_0_0_rgba(0,0,0,0.2)] border-4 transition-colors 
              ${i % 2 === 0 
                ? "bg-[#E3902C] text-white border-[#F0A040] hover:bg-[#F0A040]" 
                : "bg-[#8B5E3C] text-[#FCD8A8] border-[#A1631F] hover:bg-[#9B6E4C]"
              }
            `}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      {/* 答對時彈出金幣動畫 */}
      <AnimatePresence>
        {feedback === "correct" && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -200, scale: 2 }}
            exit={{ opacity: 0, y: -300 }}
            transition={{ duration: 0.6 }}
            className="absolute text-8xl pointer-events-none z-20"
          >
            🪙
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}