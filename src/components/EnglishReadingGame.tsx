"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 📚 英文故事書庫：包含圖片中的句子，及兩篇新增的短文
const STORIES = [
  {
    title: "At the Park",
    paragraphs: [
      ["Sally is sleeping under the tree."],
      ["Peter is standing behind the bench.", "He is laughing."],
      ["Matthew is on the grass.", "He is reading a book."],
      ["Ann is near the slide.", "She is happy."],
      ["Tim is on the swing.", "He has a T-shirt and trousers."],
      ["Cindy is wearing a skirt.", "She is under the slide."]
    ]
  },
  {
    title: "My Pet Dog",
    paragraphs: [
      ["I have a pet dog.", "His name is Max."],
      ["Max is brown and white.", "He has long ears and a short tail."],
      ["He likes to run in the park.", "He likes to catch the ball."],
      ["I love my dog very much!"]
    ]
  },
  {
    title: "A Sunny Day",
    paragraphs: [
      ["Today is a sunny day.", "The sky is blue and clear."],
      ["The birds are singing in the trees.", "The beautiful flowers are blooming."],
      ["I want to go out and play.", "Let's go to the beach together!"]
    ]
  }
];

export default function EnglishReadingGame() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  
  const [activeSentence, setActiveSentence] = useState<string | null>(null);
  const [readSentences, setReadSentences] = useState<Set<string>>(new Set());
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  // 成功音效 (只在完成整篇文章時播放)
  const playSound = (type: "success") => {
    try {
      const audio = new Audio(`/${type}.mp3`);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  // 🗣️ 英式英文發聲系統
  const speakSentence = (sentence: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = "en-GB"; // 設定為英式英文
      utterance.rate = 0.8; // 語速放慢，適合幼兒跟讀
      
      utterance.onstart = () => {
        setActiveSentence(sentence);
      };
      
      utterance.onend = () => {
        setActiveSentence(null);
        // 標記為已讀 (保持安靜無音效)
        setReadSentences((prev) => {
          const newSet = new Set(prev);
          if (!newSet.has(sentence)) {
            setScore(newSet.size + 1);
            newSet.add(sentence);
          }
          return newSet;
        });
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // 計算當前故事的總句數
  const currentStory = selectedStoryIndex !== null ? STORIES[selectedStoryIndex] : null;
  const totalSentences = currentStory 
    ? currentStory.paragraphs.reduce((acc, curr) => acc + curr.length, 0) 
    : 0;

  // 檢查是否完成整篇文章
  useEffect(() => {
    if (totalSentences > 0 && readSentences.size === totalSentences && !isFinished) {
      setTimeout(() => {
        playSound("success");
        setIsFinished(true);
      }, 1000);
    }
  }, [readSentences, totalSentences, isFinished]);

  const handleStartStory = (index: number) => {
    setSelectedStoryIndex(index);
    setReadSentences(new Set());
    setIsFinished(false);
    setScore(0);
    setActiveSentence(null);
    window.speechSynthesis.cancel();
  };

  const resetGame = () => {
    setReadSentences(new Set());
    setIsFinished(false);
    setScore(0);
    window.speechSynthesis.cancel();
    setActiveSentence(null);
  };

  // --- 視圖 A：故事書櫃 (選擇文章) ---
  if (selectedStoryIndex === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#ECFDF5] rounded-3xl p-6 shadow-inner relative select-none">
        <h2 className="text-4xl font-black text-emerald-600 mb-2 tracking-wide">English Bookshelf 📚</h2>
        <p className="text-lg font-bold text-emerald-500 mb-10">Please choose a story to read:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          {STORIES.map((story, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStartStory(index)}
              className="py-10 px-6 bg-white rounded-3xl border-b-8 border-emerald-300 shadow-md flex flex-col items-center justify-center gap-4 hover:bg-emerald-50 transition-all"
            >
              <span className="text-5xl drop-shadow-sm">📖</span>
              <span className="text-3xl font-black text-emerald-800 text-center">{story.title}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // --- 視圖 B：朗讀文章畫面 ---
  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] bg-[#ECFDF5] rounded-3xl p-6 shadow-inner relative overflow-hidden select-none font-sans">
      
      {/* 導航列 */}
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={() => {
            window.speechSynthesis.cancel();
            setSelectedStoryIndex(null);
          }} 
          className="px-6 py-3 bg-white text-emerald-600 font-bold rounded-full shadow-sm border-2 border-emerald-200 hover:bg-emerald-50 transition-colors"
        >
          🔙 Bookshelf
        </button>
      </div>

      {/* 右上角星星進度 */}
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white p-3 px-6 rounded-full border-4 border-emerald-300 z-10 shadow-sm">
        <span className="text-3xl">⭐</span>
        <span className="text-3xl font-extrabold text-emerald-600 font-mono tracking-tighter">
          {score} / {totalSentences}
        </span>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center mt-24 sm:mt-8 z-10">
        
        {/* 遊戲提示 */}
        <p className="text-lg text-emerald-700 font-bold mb-8 bg-emerald-100 px-6 py-2 rounded-full border-2 border-emerald-200 shadow-sm">
          💡 Click any sentence to listen, and try to read aloud!
        </p>

        {/* 故事書本體 */}
        <div className="bg-white w-full p-8 sm:p-12 rounded-3xl shadow-lg border-4 border-emerald-200 relative">
          
          <h1 className="text-4xl sm:text-5xl font-black text-center text-gray-800 mb-10 tracking-wider">
            {currentStory?.title}
          </h1>

          <div className="flex flex-col gap-8 text-3xl sm:text-4xl leading-loose font-medium text-gray-700 tracking-wide">
            {currentStory?.paragraphs.map((paragraph, pIndex) => (
              <p key={pIndex} className="indent-0 sm:indent-8">
                {paragraph.map((sentence, sIndex) => {
                  const isActive = activeSentence === sentence;
                  const isRead = readSentences.has(sentence);

                  return (
                    <motion.span
                      key={sIndex}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => speakSentence(sentence)}
                      className={`inline-block cursor-pointer transition-all duration-300 rounded-2xl px-2 py-1 mx-1 my-1
                        ${isActive ? "bg-emerald-300 text-emerald-900 shadow-md font-bold scale-105" : 
                          isRead ? "text-gray-400 hover:bg-emerald-50" : "hover:bg-emerald-100"}
                      `}
                    >
                      {sentence}
                    </motion.span>
                  );
                })}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 故事完成大獎勵畫面 */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[120px] mb-4">
              🎖️
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-black text-emerald-500 mb-6 tracking-wider">Excellent Reader!</h1>
            <p className="text-3xl font-extrabold text-teal-600 mb-10 max-w-md leading-relaxed">
              You have successfully read "{currentStory?.title}"! Great job!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setSelectedStoryIndex(null)}
                className="px-8 py-4 bg-gray-200 text-gray-700 text-xl font-black rounded-full shadow-md hover:bg-gray-300 transition-all"
              >
                Bookshelf 📚
              </button>
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-emerald-500 text-white text-xl font-black rounded-full shadow-[0_6px_0_0_#047857] hover:bg-emerald-600 active:translate-y-1 active:shadow-none transition-all"
              >
                Read Again 🚀
              </button>
            </div>
            <div className="mt-8 flex gap-4 text-6xl">
              <span>🎉</span><span>📚</span><span>✨</span><span>📚</span><span>🎉</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}