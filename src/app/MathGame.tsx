"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MathGame() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState("+");
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");

  // 生成新題目
  const generateProblem = () => {
    const isAddition = Math.random() > 0.5;
    let n1, n2, answer;

    if (isAddition) {
      answer = Math.floor(Math.random() * 31); // 答案 0-30
      n1 = Math.floor(Math.random() * (answer + 1));
      n2 = answer - n1;
    } else {
      n1 = Math.floor(Math.random() * 31); // 0-30
      n2 = Math.floor(Math.random() * (n1 + 1)); // 確保 n2 <= n1，冇負數
      answer = n1 - n2;
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(isAddition ? "+" : "-");

    // 生成包含正確答案嘅 4 個選項並洗牌
    const newOptions = new Set([answer]);
    while (newOptions.size < 4) {
      let randomOpt = answer + Math.floor(Math.random() * 11) - 5; // 答案附近嘅混淆項
      if (randomOpt >= 0 && randomOpt <= 30) newOptions.add(randomOpt);
    }
    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5));
    setFeedback("idle");
  };

  // 初始載入
  useEffect(() => {
    generateProblem();
  }, []);

  // 處理點擊選項
  const handleGuess = (guess: number) => {
    const correctAnswer = operator === "+" ? num1 + num2 : num1 - num2;
    if (guess === correctAnswer) {
      setFeedback("correct");
      setScore((s) => s + 1);
      setTimeout(generateProblem, 1000); // 1秒後換題
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-sky-50 rounded-3xl p-6">
      <div className="text-2xl font-bold text-sky-800 mb-8">
        ⭐ 得分: {score} ⭐
      </div>

      {/* 題目顯示 */}
      <div className="text-7xl font-extrabold text-gray-800 mb-12 flex gap-4 items-center">
        <span>{num1}</span>
        <span className="text-sky-500">{operator}</span>
        <span>{num2}</span>
        <span className="text-sky-500">=</span>
        <span className="w-24 h-24 border-4 border-dashed border-sky-300 rounded-2xl flex items-center justify-center text-sky-600">
          ?
        </span>
      </div>

      {/* 選項按鈕 */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGuess(opt)}
            className="h-24 bg-white text-5xl font-bold text-sky-600 rounded-3xl shadow-sm border-2 border-sky-100 hover:border-sky-300 transition-colors"
          >
            {opt}
          </motion.button>
        ))}
      </div>

      {/* 視覺反饋 */}
      {feedback === "correct" && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute text-8xl"
        >
          🎉
        </motion.div>
      )}
      {feedback === "wrong" && (
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: [0, -20, 20, -20, 20, 0] }}
          transition={{ duration: 0.4 }}
          className="absolute text-8xl"
        >
          🤔
        </motion.div>
      )}
    </div>
  );
}