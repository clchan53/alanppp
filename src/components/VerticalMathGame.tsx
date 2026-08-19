"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VerticalMathGame() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<"+" | "-">("+");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy"); // easy: 2位數, hard: 3位數

  const playSound = (type: "coin" | "bump" | "success") => {
    try { const audio = new Audio(`/${type}.mp3`); audio.play().catch(()=>{}); } catch (e) {}
  };

  const generateQuestion = () => {
    const max = difficulty === "easy" ? 99 : 999;
    const min = difficulty === "easy" ? 10 : 100;
    
    let n1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let n2 = Math.floor(Math.random() * (max - min + 1)) + min;
    const op = Math.random() > 0.5 ? "+" : "-";

    // 確保減法不會出現負數，且大數在上
    if (op === "-" && n2 > n1) {
      const temp = n1;
      n1 = n2;
      n2 = temp;
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(op);
    setUserInput("");
    setFeedback("idle");
  };

  useEffect(() => {
    generateQuestion();
  }, [difficulty]);

  const handleKeyPress = (key: string) => {
    if (feedback !== "idle") return;

    if (key === "DEL") {
      setUserInput((prev) => prev.slice(0, -1));
    } else if (key === "ENTER") {
      checkAnswer();
    } else {
      if (userInput.length < 4) {
        setUserInput((prev) => prev + key);
      }
    }
  };

  const checkAnswer = () => {
    if (!userInput) return;

    const answer = operator === "+" ? num1 + num2 : num1 - num2;
    
    if (parseInt(userInput) === answer) {
      playSound("coin");
      setFeedback("correct");
      setScore((prev) => prev + 1);
      setTimeout(generateQuestion, 1200);
    } else {
      playSound("bump");
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback("idle");
        setUserInput("");
      }, 800);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[85vh] bg-[#FFFBEB] rounded-3xl p-4 sm:p-8 shadow-inner select-none font-sans overflow-hidden relative">
      
      {/* 難度控制與分數 */}
      <div className="flex justify-between w-full max-w-md mb-8 z-10">
        <div className="flex gap-2">
          <button onClick={() => setDifficulty("easy")} className={`px-4 py-2 rounded-full font-bold transition-all ${difficulty === "easy" ? "bg-amber-500 text-white shadow-md" : "bg-white text-amber-600 border-2 border-amber-200"}`}>2位數</button>
          <button onClick={() => setDifficulty("hard")} className={`px-4 py-2 rounded-full font-bold transition-all ${difficulty === "hard" ? "bg-amber-500 text-white shadow-md" : "bg-white text-amber-600 border-2 border-amber-200"}`}>3位數</button>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-amber-300 shadow-sm">
          <span className="text-xl">⭐</span>
          <span className="text-2xl font-black text-amber-600 font-mono">{score}</span>
        </div>
      </div>

      {/* 直式算式顯示區 */}
      <motion.div 
        animate={feedback === "wrong" ? { x: [-10, 10, -10, 10, 0] } : {}}
        className="bg-white p-8 sm:p-12 rounded-3xl border-b-8 border-amber-300 shadow-lg w-full max-w-sm flex flex-col items-end mb-8 relative"
      >
        {/* 改用 CSS Grid 確保符號與數字各自獨立對齊 */}
        <div className="grid grid-cols-[auto_1fr] gap-x-4 w-full text-6xl sm:text-7xl font-mono font-black text-gray-800 tabular-nums leading-tight">
          <div className="col-start-2 text-right tracking-widest">{num1}</div>
          <div className="col-start-1 text-left">{operator}</div>
          <div className="col-start-2 text-right tracking-widest">{num2}</div>
        </div>
        
        {/* 橫線與輸入區 */}
        <div className="w-full border-t-8 border-gray-800 mt-2 pt-4 flex justify-end">
          <div className={`text-6xl sm:text-7xl font-mono font-black tracking-widest tabular-nums h-20 ${feedback === "correct" ? "text-green-500" : feedback === "wrong" ? "text-red-500" : "text-sky-600"}`}>
            {userInput || "_"}
          </div>
        </div>

        {/* 狀態圖示 */}
        <AnimatePresence>
          {feedback === "correct" && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute inset-0 m-auto w-32 h-32 flex items-center justify-center text-[100px] pointer-events-none">✅</motion.div>}
          {feedback === "wrong" && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute inset-0 m-auto w-32 h-32 flex items-center justify-center text-[100px] pointer-events-none">❌</motion.div>}
        </AnimatePresence>
      </motion.div>

      {/* 自訂數字鍵盤 */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button key={num} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleKeyPress(num.toString())} className="bg-white text-3xl font-black text-gray-700 py-4 rounded-2xl shadow-md border-b-4 border-gray-200 active:border-b-0 active:translate-y-1">
            {num}
          </motion.button>
        ))}
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleKeyPress("DEL")} className="bg-red-100 text-red-600 text-xl font-black py-4 rounded-2xl shadow-md border-b-4 border-red-200 active:border-b-0 active:translate-y-1">
          刪除
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleKeyPress("0")} className="bg-white text-3xl font-black text-gray-700 py-4 rounded-2xl shadow-md border-b-4 border-gray-200 active:border-b-0 active:translate-y-1">
          0
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleKeyPress("ENTER")} className="bg-green-500 text-white text-xl font-black py-4 rounded-2xl shadow-md border-b-4 border-green-600 active:border-b-0 active:translate-y-1">
          確定
        </motion.button>
      </div>

    </div>
  );
} 