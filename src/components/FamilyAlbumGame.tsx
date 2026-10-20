"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const OPTIONS = ["I", "We", "He", "She", "his", "her", "my", "your"];
const ANSWERS: Record<number, string> = { 1: "I", 2: "my", 3: "She", 4: "her", 5: "my", 6: "his", 7: "We", 8: "your" };

export default function FamilyAlbumGame() {
  const [activeBlank, setActiveBlank] = useState<number | null>(1);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (word: string) => {
    if (activeBlank === null) return;

    setUserAnswers((prev) => ({ ...prev, [activeBlank]: word }));
    setIsSubmitted(false);

    // 自動跳到下一個未填嘅空格
    const nextBlank = activeBlank + 1;
    if (nextBlank <= 8) {
      setActiveBlank(nextBlank);
    } else {
      setActiveBlank(null);
    }
  };

  const checkAnswers = () => {
    let currentScore = 0;
    for (let i = 1; i <= 8; i++) {
      if (userAnswers[i] === ANSWERS[i]) currentScore++;
    }
    setScore(currentScore);
    setIsSubmitted(true);
    setActiveBlank(null); // 隱藏選中狀態
  };

  // 空格渲染小組件
  const Blank = ({ id }: { id: number }) => {
    const isAnswered = !!userAnswers[id];
    const isCorrect = isSubmitted && userAnswers[id] === ANSWERS[id];
    const isWrong = isSubmitted && userAnswers[id] !== ANSWERS[id];
    const isActive = activeBlank === id;

    return (
      <span
        onClick={() => setActiveBlank(id)}
        // 移除 h-[32px]，加入 pb-1 (底部留白) 與 align-bottom (對齊基線)
        className={`inline-block min-w-[60px] pb-1 mx-2 px-2 text-center font-bold cursor-pointer transition-all border-b-4 align-bottom
          ${isActive ? "bg-cyan-100 border-cyan-500 text-cyan-800" : "border-gray-800 text-blue-700"}
          ${isCorrect ? "text-green-600 border-green-500" : ""}
          ${isWrong ? "text-red-500 border-red-500" : ""}
          ${!isAnswered && !isActive ? "bg-gray-50" : ""}
        `}
      >
        {userAnswers[id] || ""}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-lg font-sans text-center">
      <h1 className="text-3xl sm:text-4xl font-black text-pink-600 mb-4">📸 Coco's Family Album</h1>
      <p className="text-gray-600 font-bold mb-8 text-lg">Fill in the blanks with the correct pronouns and possessive adjectives!</p>

      {/* 選項區 */}
      <div className="bg-pink-50 p-4 rounded-2xl mb-8 flex flex-wrap justify-center gap-3">
        {OPTIONS.map((word) => (
          <motion.button
            key={word}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectOption(word)}
            className="px-6 py-2 bg-pink-500 text-white font-bold text-lg rounded-xl shadow-sm hover:bg-pink-600 transition-colors"
          >
            {word}
          </motion.button>
        ))}
      </div>

      {/* 句子區 */}
      <div className="text-xl sm:text-2xl leading-[2.5] text-left inline-block font-medium text-gray-800 mb-8">
        Hello! 1. <Blank id={1} /> am Coco. This is 2. <Blank id={2} /> mother.<br />
        3. <Blank id={3} /> is tall. 4. <Blank id={4} /> hair is short.<br />
        This is 5. <Blank id={5} /> father. 6. <Blank id={6} /> eyes are big.<br />
        7. <Blank id={7} /> go to the park together on Sundays.<br />
        How about you? Do you love 8. <Blank id={8} /> family?
      </div>

      {/* 檢查與結果區 */}
      <div className="mt-4 border-t-2 border-gray-100 pt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={checkAnswers}
          className="px-8 py-4 bg-green-500 text-white font-black text-xl rounded-full shadow-[0_6px_0_0_#166534] hover:bg-green-600 active:translate-y-1 active:shadow-none transition-all"
        >
          Check Answers ✅
        </motion.button>

        {isSubmitted && (
          <div className="mt-6 text-2xl font-black">
            {score === 8 ? (
              <span className="text-green-600">🎉 滿分！Archie 太叻啦！</span>
            ) : (
              <span className="text-orange-500">
                繼續努力！答啱咗 {score} 題！<br />
                <span className="text-lg text-gray-500">紅色嘅係錯咗，點擊空格重新填過啦！</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}