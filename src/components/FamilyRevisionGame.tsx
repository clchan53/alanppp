"use client";

import React, { useState } from 'react';

// 定義家族成員的頭像，用可愛的 Emoji 搭配圓形背景來代表
const FamilyTreeVisual = () => {
  return (
    <div className="w-full max-w-3xl mx-auto my-6 p-6 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100 shadow-inner">
      <div className="text-center font-bold text-emerald-800 text-lg mb-4 flex items-center justify-center gap-2">
        <span>🌳</span> Mimi's Family Tree 家族樹狀圖
      </div>

      <div className="flex flex-col items-center gap-8 relative">
        {/* ================= 第一代 (祖父母) ================= */}
        <div className="flex justify-center gap-12 sm:gap-24 relative">
          {/* Dave */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full border-4 border-amber-300 flex items-center justify-center text-3xl sm:text-4xl shadow-md">
              👴🏻
            </div>
            <span className="mt-1 bg-amber-200 text-amber-900 px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
              Dave
            </span>
          </div>

          {/* 夫婦連線 (橫線) */}
          <div className="absolute top-8 sm:top-10 left-12 right-12 h-1 border-t-2 border-dashed border-emerald-400 -z-10" />

          {/* Daisy */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-100 rounded-full border-4 border-pink-300 flex items-center justify-center text-3xl sm:text-4xl shadow-md">
              👵🏻
            </div>
            <span className="mt-1 bg-pink-200 text-pink-900 px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
              Daisy
            </span>
          </div>
        </div>

        {/* 串聯第一代與第二代的垂直線 */}
        <div className="w-0.5 h-6 border-l-2 border-dashed border-emerald-400" />

        {/* ================= 第二代 (父母、姑嫂叔侄) ================= */}
        <div className="w-full flex justify-around relative px-2">
          {/* 連接第二代兩對夫婦的橫向總線 */}
          <div className="absolute -top-3 left-[20%] right-[20%] h-1 border-t-2 border-dashed border-emerald-400 -z-10" />
          {/* 左垂直分線 */}
          <div className="absolute -top-3 left-[25%] h-3 border-l-2 border-dashed border-emerald-400" />
          {/* 右垂直分線 */}
          <div className="absolute -top-3 right-[25%] h-3 border-l-2 border-dashed border-emerald-400" />

          {/* 左邊：Jack & Jude (父母) */}
          <div className="flex flex-col items-center">
            <div className="flex gap-4 sm:gap-8 relative">
              {/* Jack */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full border-3 border-blue-400 flex items-center justify-center text-2xl sm:text-3xl shadow-sm">
                  👨🏻‍💼
                </div>
                <span className="mt-1 bg-blue-200 text-blue-900 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  Jack
                </span>
              </div>
              {/* 橫向連接 */}
              <div className="absolute top-7 sm:top-8 left-8 right-8 h-0.5 border-t-2 border-dashed border-emerald-400 -z-10" />
              {/* Jude */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full border-3 border-red-300 flex items-center justify-center text-2xl sm:text-3xl shadow-sm">
                  👩🏻‍⚕️
                </div>
                <span className="mt-1 bg-red-200 text-red-900 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  Jude
                </span>
              </div>
            </div>
            {/* 去第三代的垂直線 */}
            <div className="w-0.5 h-6 border-l-2 border-dashed border-emerald-400 mt-2" />
          </div>

          {/* 右邊：May & Ken (姑姑與姑丈) */}
          <div className="flex flex-col items-center">
            <div className="flex gap-4 sm:gap-8 relative">
              {/* May */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full border-3 border-purple-300 flex items-center justify-center text-2xl sm:text-3xl shadow-sm">
                  👩🏼
                </div>
                <span className="mt-1 bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  May
                </span>
              </div>
              {/* 橫向連接 */}
              <div className="absolute top-7 sm:top-8 left-8 right-8 h-0.5 border-t-2 border-dashed border-emerald-400 -z-10" />
              {/* Ken */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cyan-100 rounded-full border-3 border-cyan-400 flex items-center justify-center text-2xl sm:text-3xl shadow-sm">
                  👨🏼‍💻
                </div>
                <span className="mt-1 bg-cyan-200 text-cyan-900 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  Ken
                </span>
              </div>
            </div>
            {/* 去第三代的垂直線 */}
            <div className="w-0.5 h-6 border-l-2 border-dashed border-emerald-400 mt-2" />
          </div>
        </div>

        {/* ================= 第三代 (孩子們) ================= */}
        <div className="w-full flex justify-around px-1 relative">
          {/* 左三子輩橫連線 */}
          <div className="absolute -top-0.5 left-[10%] right-[60%] h-0.5 border-t-2 border-dashed border-emerald-400 -z-10" />
          {/* 右獨子輩垂直連線 (在下面) */}

          {/* 左側 3 個孩子 */}
          <div className="flex justify-center gap-2 sm:gap-6 w-1/2">
            {/* Lily */}
            <div className="flex flex-col items-center">
              <div className="absolute -top-0.5 w-0.5 h-2.5 border-l-2 border-dashed border-emerald-400" />
              <div className="w-12 h-12 bg-indigo-100 rounded-full border-2 border-indigo-300 flex items-center justify-center text-xl sm:text-2xl shadow-sm">
                👧🏻
              </div>
              <span className="mt-1 text-xs font-medium text-gray-700">Lily</span>
            </div>

            {/* Mimi (me) */}
            <div className="flex flex-col items-center relative scale-110">
              <div className="absolute -top-1 w-0.5 h-2.5 border-l-2 border-dashed border-emerald-400" />
              {/* 強調顯示的主角 */}
              <div className="w-12 h-12 bg-orange-100 rounded-full border-2 border-orange-400 flex items-center justify-center text-xl sm:text-2xl shadow-md ring-4 ring-orange-200 animate-pulse">
                👧🏽
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                Mimi (me)
              </span>
            </div>

            {/* Bob */}
            <div className="flex flex-col items-center">
              <div className="absolute -top-0.5 w-0.5 h-2.5 border-l-2 border-dashed border-emerald-400" />
              <div className="w-12 h-12 bg-teal-50 rounded-full border-2 border-teal-300 flex items-center justify-center text-xl sm:text-2xl shadow-sm">
                👶🏻
              </div>
              <span className="mt-1 text-xs font-medium text-gray-700">Bob</span>
            </div>
          </div>

          {/* 右側 1 個獨子 */}
          <div className="flex justify-center w-1/2">
            {/* Frank */}
            <div className="flex flex-col items-center relative">
              <div className="absolute -top-2 w-0.5 h-4 border-l-2 border-dashed border-emerald-400" />
              <div className="w-12 h-12 bg-green-100 rounded-full border-2 border-green-300 flex items-center justify-center text-xl sm:text-2xl shadow-sm">
                👦🏼
              </div>
              <span className="mt-1 text-xs font-medium text-gray-700">Frank</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FamilyRevisionGame = () => {
  const [activeBlank, setActiveBlank] = useState(1);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const wordBank = [
    'grandfather', 'grandmother', 'mother', 'father', 'brother',
    'sister', 'aunt', 'uncle', 'son', 'cousin'
  ];

  const correctAnswers: Record<number, string> = {
    1: 'grandfather', 2: 'grandmother', 3: 'mother', 4: 'father',
    5: 'brother', 6: 'sister', 7: 'aunt', 8: 'uncle', 9: 'son', 10: 'cousin'
  };

  const handleWordClick = (word: string) => {
    if (activeBlank !== null) {
      setUserAnswers((prev) => ({ ...prev, [activeBlank]: word }));
      setIsSubmitted(false);
      
      if (activeBlank < 10) {
        setActiveBlank(activeBlank + 1);
      } else {
        setActiveBlank(null);
      }
    }
  };

  const handleBlankClick = (id: number) => {
    setActiveBlank(id);
    setIsSubmitted(false);
  };

  const checkAnswers = () => {
    setIsSubmitted(true);
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 1; i <= 10; i++) {
      if (userAnswers[i] === correctAnswers[i]) {
        score++;
      }
    }
    return score;
  };

  const Blank = ({ id }: { id: number }) => {
    const answer = userAnswers[id] || '';
    const isCorrect = isSubmitted && answer === correctAnswers[id];
    const isWrong = isSubmitted && answer !== '' && answer !== correctAnswers[id];

    let textColor = 'text-purple-600';
    if (isCorrect) textColor = 'text-green-600';
    else if (isWrong) textColor = 'text-red-500';

    return (
      <span
        onClick={() => handleBlankClick(id)}
        className={`
          inline-block min-w-[90px] md:min-w-[110px] h-[32px] md:h-[35px] border-b-[3px] border-orange-500 mx-1 
          text-center font-bold cursor-pointer px-1 md:px-2 align-bottom transition-colors
          ${activeBlank === id ? 'bg-pink-100 rounded-t-md' : 'hover:bg-gray-100'}
          ${textColor}
        `}
      >
        {answer}
      </span>
    );
  };

  const score = calculateScore();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-yellow-50 rounded-2xl shadow-lg font-sans text-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1 flex items-center justify-center gap-2">
        🌳 Mimi's Family Tree
      </h1>
      <p className="text-gray-600 text-xs sm:text-sm mb-4">
        Look at the family tree, click a blank line, then pick a word to fill it in!
      </p>

      {/* 🚀 自制互動家族樹狀圖 (完全取代實體圖片) */}
      <FamilyTreeVisual />

      {/* 單字庫 (Word Bank) */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 p-4 bg-cyan-50 border-2 border-dashed border-cyan-400 rounded-xl mb-6">
        {wordBank.map((word) => (
          <button
            key={word}
            onClick={() => handleWordClick(word)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-teal-500 text-white text-sm sm:text-base font-bold rounded-lg cursor-pointer hover:bg-teal-600 hover:scale-105 active:scale-95 transition-all select-none"
          >
            {word}
          </button>
        ))}
      </div>

      {/* 故事內容 (Story Area) */}
      <div className="text-left text-lg sm:text-xl md:text-2xl leading-loose bg-white p-5 sm:p-6 rounded-xl shadow-inner text-gray-800">
        <p className="mb-4">Hello! I am Mimi. This is my family.</p>
        <p className="mb-2">
          Dave is my 1. <Blank id={1} />. Daisy is my 2. <Blank id={2} />.
        </p>
        <p className="mb-2">
          Jude is my 3. <Blank id={3} />. Jack is my 4. <Blank id={4} />.
        </p>
        <p className="mb-2">
          Bob is my 5. <Blank id={5} />. Lily is my 6. <Blank id={6} />.
        </p>
        <p className="mb-2">
          May is my 7. <Blank id={7} />. Ken is my 8. <Blank id={8} />.
        </p>
        <p className="mb-2">
          Frank is his 9. <Blank id={9} />. He is my 10. <Blank id={10} />. We always play together.
        </p>
      </div>

      <button
        onClick={checkAnswers}
        className="mt-6 px-6 py-2.5 sm:px-8 sm:py-3 bg-orange-500 text-white text-lg sm:text-xl font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-md"
      >
        Check Answers 🔍
      </button>

      {isSubmitted && (
        <div className="mt-6 min-h-[40px]">
          {score === 10 ? (
            <p className="text-xl sm:text-2xl font-bold text-green-600 animate-bounce">
              🎉 滿分！Archie 係家族大探險家！
            </p>
          ) : (
            <p className="text-lg sm:text-xl font-bold text-blue-600 animate-pulse">
              好叻仔！答啱咗 {score} 題！紅色嘅字填錯咗少少，點擊紅字再試下啦！
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyRevisionGame;